import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export * from "./models/auth";

export const moodEntries = pgTable("mood_entries", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Using text to match Replit Auth user ID
  mood: integer("mood").notNull(), // 1-5
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({ id: true, createdAt: true });

export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
