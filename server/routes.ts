import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cors from "cors";
import * as faceapi from "@vladmandic/face-api";
import canvas from "canvas";


const idStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (file.fieldname === "frontId") {
      cb(null, `frontId${ext}`);
    } else if (file.fieldname === "backId") {
      cb(null, `backId${ext}`);
    } else {
      cb(null, file.originalname);
    }
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODEL_PATH = path.resolve(__dirname, "./faceID/models");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({
  Canvas: canvas.createCanvas(1, 1).constructor as unknown as { new (): HTMLCanvasElement; prototype: HTMLCanvasElement },
  Image: canvas.Image as unknown as { new (): HTMLImageElement; prototype: HTMLImageElement },
  ImageData: canvas.ImageData as any,
});

let modelsLoaded = false;
async function loadModels() {
  if (modelsLoaded) return;
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(
    path.join(MODEL_PATH, "ssd_mobilenetv1")
  );
  await faceapi.nets.faceRecognitionNet.loadFromDisk(
    path.join(MODEL_PATH, "face_recognition")
  );
  await faceapi.nets.faceLandmark68Net.loadFromDisk(
    path.join(MODEL_PATH, "face_landmark_68")
  );
  modelsLoaded = true;
}

async function processImageFromBase64(base64: string) {
  const buffer = Buffer.from(base64.split(",")[1], "base64");
  const img = await canvas.loadImage(buffer);
  const canvasElement = canvas.createCanvas(img.width, img.height);
  const ctx = canvasElement.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const detection = await faceapi
    .detectSingleFace(canvasElement as unknown as HTMLCanvasElement)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    throw new Error("Nenhum rosto detectado na imagem.");
  }

  return detection.descriptor;
}

const upload = multer({ storage: idStorage });

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  app.use(cors());
  
  // Set up file uploads route
  app.post("/api/upload-id", upload.fields([
    { name: "frontId", maxCount: 1 },
    { name: "backId", maxCount: 1 }
  ]), (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (!files.frontId || !files.backId) {
        return res.status(400).json({ message: "Ambas as imagens do RG são necessárias" });
      }
      
      const frontIdPath = `/uploads/${files.frontId[0].filename}`;
      const backIdPath = `/uploads/${files.backId[0].filename}`;
      
      res.json({
        frontIdUrl: frontIdPath,
        backIdUrl: backIdPath
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao fazer upload dos arquivos" });
    }
  });

  // Get upcoming matches
  app.get("/api/matches", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const matches = await storage.getUpcomingMatches(limit);
      res.json(matches);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar partidas" });
    }
  });

  // Get news
  app.get("/api/news", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const game = req.query.game as string | undefined;
      
      let news;
      if (game) {
        news = await storage.getNewsByGame(game, limit);
      } else {
        news = await storage.getNews(limit);
      }
      
      res.json(news);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar notícias" });
    }
  });

  // Get user products
  app.get("/api/user/products", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const products = await storage.getUserProducts(req.user.id);
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar produtos do usuário" });
    }
  });
  
  // Update user gamification level
  app.post("/api/user/gamification", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { level, points } = req.body;
      
      if (level && !["irritado", "bravo", "furioso"].includes(level)) {
        return res.status(400).json({ message: "Nível de gamificação inválido" });
      }
      
      const updateData: any = {};
      if (level) updateData.gamificationLevel = level;
      if (points !== undefined) updateData.gamificationPoints = points;
      
      const updatedUser = await storage.updateUser(req.user.id, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar nível de gamificação" });
    }
  });

  // Live match and rating endpoints
  app.get("/api/matches/live", async (req, res) => {
    try {
      const match = await storage.getLiveMatch();
      if (match) {
        res.json(match);
      } else {
        res.status(404).json({ message: "Nenhuma partida ao vivo no momento" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar partida ao vivo" });
    }
  });
  
  app.post("/api/matches/:id/live", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const match = await storage.setMatchLiveStatus(parseInt(req.params.id), true);
      if (match) {
        res.json(match);
      } else {
        res.status(404).json({ message: "Partida não encontrada" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao definir partida como ao vivo" });
    }
  });
  
  app.post("/api/matches/:id/end-live", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const match = await storage.setMatchLiveStatus(parseInt(req.params.id), false);
      if (match) {
        res.json(match);
      } else {
        res.status(404).json({ message: "Partida não encontrada" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao finalizar partida ao vivo" });
    }
  });
  
  // Match rating endpoints
  app.get("/api/matches/:id/ratings", async (req, res) => {
    try {
      const ratings = await storage.getMatchRatings(parseInt(req.params.id));
      res.json(ratings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar avaliações da partida" });
    }
  });
  
  app.post("/api/matches/:id/ratings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const rating = await storage.createMatchRating({
        userId: req.user.id,
        matchId: parseInt(req.params.id),
        rating: req.body.rating,
        timestamp: new Date()
      });
      res.status(201).json(rating);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao avaliar partida" });
    }
  });
  
  // Player rating endpoints
  app.get("/api/matches/:id/player-ratings", async (req, res) => {
    try {
      const ratings = await storage.getPlayerRatings(parseInt(req.params.id));
      res.json(ratings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar avaliações dos jogadores" });
    }
  });
  
  app.post("/api/matches/:id/player-ratings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const rating = await storage.createPlayerRating({
        userId: req.user.id,
        matchId: parseInt(req.params.id),
        playerName: req.body.playerName,
        rating: req.body.rating,
        timestamp: new Date()
      });
      res.status(201).json(rating);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao avaliar jogador" });
    }
  });

  app.post("/api/compare-faces", async (req, res) => {
    const { image1 } = req.body;

    if (!image1) {
      return res.status(400).json({ error: "Imagem não fornecida" });
    }

    try {
      await loadModels();

      const frontIDPath = path.join(__dirname, "../uploads", "frontId.jpg");
      if (!fs.existsSync(frontIDPath)) {
        return res.status(404).json({ error: "Imagem frontID não encontrada" });
      }

      const image2Buffer = fs.readFileSync(frontIDPath);
      const image2Base64 = `data:image/jpg;base64,${image2Buffer.toString(
        "base64"
      )}`;

      const descriptor1 = await processImageFromBase64(image1);
      const descriptor2 = await processImageFromBase64(image2Base64);

      const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
      const threshold = 0.6;

      return res.status(200).json({
        distance,
        isSamePerson: distance < threshold,
      });
    } catch (err: any) {
      console.error("Erro na verificação facial:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
  });
  
  // Average ratings
  app.get("/api/matches/:id/average-rating", async (req, res) => {
    try {
      const average = await storage.getAverageMatchRating(parseInt(req.params.id));
      res.json({ average });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar média de avaliações" });
    }
  });
  
  app.get("/api/matches/:id/player/:playerName/average-rating", async (req, res) => {
    try {
      const average = await storage.getAveragePlayerRating(
        parseInt(req.params.id),
        req.params.playerName
      );
      res.json({ average });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar média de avaliações do jogador" });
    }
  });

  const httpServer = createServer(app);
  
  // Set up WebSocket server for live updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('Cliente conectado ao WebSocket');
    
    // Send initial data if there's a live match
    storage.getLiveMatch().then(match => {
      if (match) {
        ws.send(JSON.stringify({ type: 'match', data: match }));
      }
    });
    
    // Handle client messages
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'request_ratings' && data.matchId) {
          const matchRatings = await storage.getMatchRatings(data.matchId);
          const playerRatings = await storage.getPlayerRatings(data.matchId);
          ws.send(JSON.stringify({ 
            type: 'ratings', 
            matchRatings, 
            playerRatings 
          }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('Cliente desconectado do WebSocket');
    });
  });
  
  // Set up interval to broadcast match stats every minute
  setInterval(async () => {
    const liveMatch = await storage.getLiveMatch();
    if (liveMatch && wss.clients.size > 0) {
      const matchRatings = await storage.getMatchRatings(liveMatch.id);
      const playerRatings = await storage.getPlayerRatings(liveMatch.id);
      const averageRating = await storage.getAverageMatchRating(liveMatch.id);
      
      const message = JSON.stringify({
        type: 'live_update',
        matchId: liveMatch.id,
        timestamp: new Date(),
        averageRating,
        matchRatings,
        playerRatings
      });
      
      // Broadcast to all connected clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }
  }, 60000); // Every minute

  return httpServer;
}
