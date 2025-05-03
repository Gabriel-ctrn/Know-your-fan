import * as faceapi from "@vladmandic/face-api";
import canvas from "canvas";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODEL_PATH = path.resolve(__dirname, "models");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Carrega os modelos apenas uma vez
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

// Processa a imagem e retorna o descritor facial
export async function processImage(imagePath) {
  const img = await canvas.loadImage(imagePath);
  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    throw new Error(`Nenhum rosto detectado na imagem: ${imagePath}`);
  }

  return detection.descriptor;
}

// Função principal para comparar duas imagens
export async function compareFaces(
  imagePath1,
  imagePath2
) {
  await loadModels();

  const descriptor1 = await processImage(imagePath1);
  const descriptor2 = await processImage(imagePath2);

  const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
  const threshold = 0.6;

  return {
    distance,
    isSamePerson: distance < threshold,
  };
}
