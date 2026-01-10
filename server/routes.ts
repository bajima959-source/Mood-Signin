import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { eq, and } from "drizzle-orm";
import { moodEntries } from "@shared/schema";
import { db } from "./db";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Mood Entries Routes
  
  // List
  app.get(api.moodEntries.list.path, isAuthenticated, async (req, res) => {
    // req.user is typed as any in express-session/passport usually, 
    // but replit auth puts claims in req.user.claims
    const userId = (req.user as any).claims.sub;
    const entries = await storage.getMoodEntries(userId);
    res.json(entries);
  });

  // Create
  app.post(api.moodEntries.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.moodEntries.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
      
      const entry = await storage.createMoodEntry({
        ...input,
        userId,
      });
      
      res.status(201).json(entry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Delete
  app.delete(api.moodEntries.delete.path, isAuthenticated, async (req, res) => {
    const id = Number(req.params.id);
    const userId = (req.user as any).claims.sub;

    const entry = await storage.getMoodEntry(id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    if (entry.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // We can just use delete directly or add a safe delete to storage.
    // For now, let's just delete it via DB directly here or update storage.ts to include safe delete.
    // I'll use db directly here to ensure safety if storage doesn't fully support it yet.
    await db.delete(moodEntries).where(and(eq(moodEntries.id, id), eq(moodEntries.userId, userId)));
    
    res.status(204).send();
  });

  // Seed Data (if needed, but for auth based app, global seed might confuse things)
  // Maybe seed for the current user if they have none?
  // Let's skip auto-seeding for now to keep it simple for auth users.

  return httpServer;
}
