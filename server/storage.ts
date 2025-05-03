import {
  users,
  matches,
  news,
  userProducts,
  matchRatings,
  playerRatings,
  type User,
  type InsertUser,
  type Match,
  type InsertMatch,
  type News,
  type InsertNews,
  type UserProduct,
  type InsertUserProduct,
  type UpdateUser,
  type MatchRating,
  type InsertMatchRating,
  type PlayerRating,
  type InsertPlayerRating,
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByCPF(cpf: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: UpdateUser): Promise<User | undefined>;

  // Matches methods
  getMatches(): Promise<Match[]>;
  getUpcomingMatches(limit?: number): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  getLiveMatch(): Promise<Match | undefined>;
  setMatchLiveStatus(id: number, isLive: boolean): Promise<Match | undefined>;

  // News methods
  getNews(limit?: number): Promise<News[]>;
  getNewsByGame(game: string, limit?: number): Promise<News[]>;
  createNews(newsItem: InsertNews): Promise<News>;

  // User products methods
  getUserProducts(userId: number): Promise<UserProduct[]>;
  addUserProduct(product: InsertUserProduct): Promise<UserProduct>;

  // Rating methods
  getMatchRatings(matchId: number): Promise<MatchRating[]>;
  createMatchRating(rating: InsertMatchRating): Promise<MatchRating>;
  getPlayerRatings(matchId: number): Promise<PlayerRating[]>;
  createPlayerRating(rating: InsertPlayerRating): Promise<PlayerRating>;
  getAverageMatchRating(matchId: number): Promise<number>;
  getAveragePlayerRating(matchId: number, playerName: string): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private matches: Map<number, Match>;
  private news: Map<number, News>;
  private userProducts: Map<number, UserProduct>;
  private matchRatings: Map<number, MatchRating>;
  private playerRatings: Map<number, PlayerRating>;

  private userIdCounter: number;
  private matchIdCounter: number;
  private newsIdCounter: number;
  private userProductIdCounter: number;
  private matchRatingIdCounter: number;
  private playerRatingIdCounter: number;

  constructor() {
    this.users = new Map();
    this.matches = new Map();
    this.news = new Map();
    this.userProducts = new Map();
    this.matchRatings = new Map();
    this.playerRatings = new Map();

    this.userIdCounter = 1;
    this.matchIdCounter = 1;
    this.newsIdCounter = 1;
    this.userProductIdCounter = 1;
    this.matchRatingIdCounter = 1;
    this.playerRatingIdCounter = 1;

    // Initialize with sample data
    this.initializeData();

    // Add some sample ratings
    this.createSampleRatings();
  }

  private createSampleRatings() {
    // We'll add sample ratings after a brief delay, to ensure matches are created first
    setTimeout(() => {
      const liveMatch = Array.from(this.matches.values()).find(
        (match) => match.isLive
      );
      if (liveMatch) {
        // Add some match ratings
        for (let i = 0; i < 5; i++) {
          this.createMatchRating({
            userId: 1, // Our sample user
            matchId: liveMatch.id,
            rating: 3 + Math.floor(Math.random() * 3), // Ratings between 3-5
            timestamp: new Date(Date.now() - (5 - i) * 60000), // Ratings from the past 5 minutes
          });
        }

        // Add some player ratings
        if (liveMatch.team1Players && liveMatch.team2Players) {
          const allPlayers = [
            ...liveMatch.team1Players,
            ...liveMatch.team2Players,
          ];
          for (const player of allPlayers) {
            this.createPlayerRating({
              userId: 1, // Our sample user
              matchId: liveMatch.id,
              playerName: player,
              rating: 2 + Math.floor(Math.random() * 4), // Ratings between 2-5
              timestamp: new Date(
                Date.now() - Math.floor(Math.random() * 300000)
              ), // Random times in the past 5 minutes
            });
          }
        }
      }
    }, 100);
  }

  private initializeData() {
    // Create sample user for login
    const user = this.createUser({
      id: 1,
      username: "furia_fan",
      email: "user@furia.com",
      password:
        "f0004bd2ff474ac7fa84d2f559f2dfb22d9443d935ead6d7a0af33fc90c3a5afdc0ed0548ed922b58ed307dd431db286041c66df93b3ed149306da2b5bef005e.95951fca9cdcc82e53b679ccbb23318e",
      cpf: "123.456.789-00",
      favoriteGame: "CS2",
      frontIdUrl: "/uploads/sample-id-front.jpg",
      backIdUrl: "/uploads/sample-id-back.jpg",
    });

    const user2 = this.createUser({
      username: "furia_admin",
      email: "admin@furia.com",
      password:
        "f0004bd2ff474ac7fa84d2f559f2dfb22d9443d935ead6d7a0af33fc90c3a5afdc0ed0548ed922b58ed307dd431db286041c66df93b3ed149306da2b5bef005e.95951fca9cdcc82e53b679ccbb23318e",
      cpf: "123.456.789-01",
      favoriteGame: "CS2",
      frontIdUrl: "/uploads/sample-id-front.jpg",
      backIdUrl: "/uploads/sample-id-back.jpg",
    });

    // Update the user with gamification info
    this.updateUser(user.id, {
      faceVerified: true,
      gamificationLevel: "bravo",
      gamificationPoints: 1500,
    });

    this.updateUser(user2.id, {
      faceVerified: true,
      gamificationLevel: "bravo",
      gamificationPoints: 1500,
    });
    // Sample matches data
    const sampleMatches: InsertMatch[] = [
      {
        game: "CS2",
        team1: "FURIA",
        team2: "NAVI",
        date: new Date(), // Live match happening now
        tournament: "ESL Pro League Season 19",
        logo1: "furia_logo.png",
        logo2: "navi_logo.png",
        isLive: true,
        team1Players: ["arT", "KSCERATO", "yuurih", "drop", "chelo"],
        team2Players: ["s1mple", "electronic", "Perfecto", "b1t", "Aleksib"],
      },
      {
        game: "VALORANT",
        team1: "FURIA",
        team2: "LOUD",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        tournament: "VCT Americas 2024",
        logo1: "furia_logo.png",
        logo2: "loud_logo.png",
        team1Players: ["Quick", "Khalil", "Mazin", "Nozwerr", "dgzin"],
        team2Players: ["aspas", "Less", "tuyz", "cauanzin", "saadhak"],
      },
      {
        game: "LOL",
        team1: "FURIA",
        team2: "PAIN",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        tournament: "CBLOL 2024 - Split 2",
        logo1: "furia_logo.png",
        logo2: "pain_logo.png",
        team1Players: ["kaze", "ProDelta", "Envy", "Netuno", "RedBert"],
        team2Players: ["Wizer", "CarioK", "dyNquedo", "TitaN", "Kuri"],
      },
    ];

    // Sample news data
    const sampleNews: InsertNews[] = [
      {
        title: "FURIA vence NAVI em épica semifinal do Major",
        content:
          "Em uma partida incrível de 3 mapas, FURIA venceu a NAVI por 2-1 e garantiu vaga na final do Major de Berlim 2024.",
        game: "CS2",
        imageUrl: "furia_navi_match.jpg",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        title: "FURIA anuncia nova line-up para o VCT 2024",
        content:
          "Com grandes mudanças, FURIA anuncia sua nova formação para a temporada 2024 do VCT Americas com a chegada de dois novos jogadores.",
        game: "VALORANT",
        imageUrl: "furia_valorant_team.jpg",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        title: "FURIA classifica para playoffs do CBLOL",
        content:
          "Com uma vitória convincente sobre a PAIN Gaming, FURIA garantiu sua vaga nos playoffs do CBLOL 2024 - Split 2.",
        game: "LOL",
        imageUrl: "furia_lol_victory.jpg",
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
      },
    ];

    // Insert sample data
    sampleMatches.forEach((match) => this.createMatch(match));
    sampleNews.forEach((newsItem) => this.createNews(newsItem));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByCPF(cpf: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.cpf === cpf);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = {
      ...insertUser,
      id,
      gamificationLevel: "irritado",
      gamificationPoints: 0,
      faceVerified: false,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(
    id: number,
    userData: UpdateUser
  ): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;

    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Matches methods
  async getMatches(): Promise<Match[]> {
    return Array.from(this.matches.values());
  }

  async getUpcomingMatches(limit = 10): Promise<Match[]> {
    const now = new Date();
    return Array.from(this.matches.values())
      .filter((match) => new Date(match.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit);
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const id = this.matchIdCounter++;
    const newMatch: Match = { ...match, id };
    this.matches.set(id, newMatch);
    return newMatch;
  }

  // News methods
  async getNews(limit = 10): Promise<News[]> {
    return Array.from(this.news.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  async getNewsByGame(game: string, limit = 10): Promise<News[]> {
    return Array.from(this.news.values())
      .filter((newsItem) => newsItem.game === game)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  async createNews(newsItem: InsertNews): Promise<News> {
    const id = this.newsIdCounter++;
    const newNews: News = { ...newsItem, id };
    this.news.set(id, newNews);
    return newNews;
  }

  // User products methods
  async getUserProducts(userId: number): Promise<UserProduct[]> {
    return Array.from(this.userProducts.values()).filter(
      (product) => product.userId === userId
    );
  }

  async addUserProduct(product: InsertUserProduct): Promise<UserProduct> {
    const id = this.userProductIdCounter++;
    const newProduct: UserProduct = { ...product, id };
    this.userProducts.set(id, newProduct);
    return newProduct;
  }

  // Match Live Status methods
  async getLiveMatch(): Promise<Match | undefined> {
    return Array.from(this.matches.values()).find((match) => match.isLive);
  }

  async setMatchLiveStatus(
    id: number,
    isLive: boolean
  ): Promise<Match | undefined> {
    const match = this.matches.get(id);
    if (!match) return undefined;

    // If setting a match to live, make sure all others are not live
    if (isLive) {
      for (const [matchId, match] of this.matches.entries()) {
        if (matchId !== id && match.isLive) {
          const updatedMatch = { ...match, isLive: false };
          this.matches.set(matchId, updatedMatch);
        }
      }
    }

    const updatedMatch = { ...match, isLive };
    this.matches.set(id, updatedMatch);
    return updatedMatch;
  }

  // Rating methods
  async getMatchRatings(matchId: number): Promise<MatchRating[]> {
    return Array.from(this.matchRatings.values()).filter(
      (rating) => rating.matchId === matchId
    );
  }

  async createMatchRating(rating: InsertMatchRating): Promise<MatchRating> {
    const id = this.matchRatingIdCounter++;
    const newRating: MatchRating = { ...rating, id };
    this.matchRatings.set(id, newRating);
    return newRating;
  }

  async getPlayerRatings(matchId: number): Promise<PlayerRating[]> {
    return Array.from(this.playerRatings.values()).filter(
      (rating) => rating.matchId === matchId
    );
  }

  async createPlayerRating(rating: InsertPlayerRating): Promise<PlayerRating> {
    const id = this.playerRatingIdCounter++;
    const newRating: PlayerRating = { ...rating, id };
    this.playerRatings.set(id, newRating);
    return newRating;
  }

  async getAverageMatchRating(matchId: number): Promise<number> {
    const ratings = await this.getMatchRatings(matchId);
    if (ratings.length === 0) return 0;

    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return sum / ratings.length;
  }

  async getAveragePlayerRating(
    matchId: number,
    playerName: string
  ): Promise<number> {
    const ratings = (await this.getPlayerRatings(matchId)).filter(
      (rating) => rating.playerName === playerName
    );

    if (ratings.length === 0) return 0;

    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return sum / ratings.length;
  }
}

export const storage = new MemStorage();
