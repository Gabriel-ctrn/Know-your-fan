import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  cpf: text("cpf").notNull().unique(),
  frontIdUrl: text("front_id_url"),
  backIdUrl: text("back_id_url"),
  faceVerified: boolean("face_verified").default(false),
  favoriteGame: text("favorite_game"),
  gamificationLevel: text("gamification_level").default("irritado"), // irritado, bravo, furioso
  gamificationPoints: integer("gamification_points").default(0),
  twitter: text("twitter"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  discord: text("discord"),
  twitch: text("twitch")
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  game: text("game").notNull(), // CS2, VALORANT, LOL
  team1: text("team1").notNull(),
  team2: text("team2").notNull(),
  date: timestamp("date").notNull(),
  tournament: text("tournament").notNull(),
  logo1: text("logo1"),
  logo2: text("logo2"),
  isLive: boolean("is_live").default(false),
  team1Players: text("team1_players").array(),
  team2Players: text("team2_players").array()
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  game: text("game"), // CS2, VALORANT, LOL
  imageUrl: text("image_url"),
  date: timestamp("date").notNull()
});

export const userProducts = pgTable("user_products", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productName: text("product_name").notNull(),
  purchaseDate: timestamp("purchase_date").notNull()
});

export const matchRatings = pgTable("match_ratings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  matchId: integer("match_id").notNull().references(() => matches.id),
  rating: integer("rating").notNull(), // 0-5 stars
  timestamp: timestamp("timestamp").notNull().defaultNow()
});

export const playerRatings = pgTable("player_ratings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  matchId: integer("match_id").notNull().references(() => matches.id),
  playerName: text("player_name").notNull(),
  rating: integer("rating").notNull(), // 0-5 stars
  timestamp: timestamp("timestamp").notNull().defaultNow()
});

// Validation schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  gamificationLevel: true,
  gamificationPoints: true,
  faceVerified: true
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const insertMatchSchema = createInsertSchema(matches).omit({ id: true });
export const insertNewsSchema = createInsertSchema(news).omit({ id: true });
export const insertUserProductSchema = createInsertSchema(userProducts).omit({ id: true });
export const insertMatchRatingSchema = createInsertSchema(matchRatings).omit({ id: true });
export const insertPlayerRatingSchema = createInsertSchema(playerRatings).omit({ id: true });

export const updateUserSchema = createInsertSchema(users).partial().omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type UserProduct = typeof userProducts.$inferSelect;
export type InsertUserProduct = z.infer<typeof insertUserProductSchema>;
export type MatchRating = typeof matchRatings.$inferSelect;
export type InsertMatchRating = z.infer<typeof insertMatchRatingSchema>;
export type PlayerRating = typeof playerRatings.$inferSelect;
export type InsertPlayerRating = z.infer<typeof insertPlayerRatingSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
