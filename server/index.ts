import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleAnalyzePronunciation } from "./routes/analyze-pronunciation";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());

  // Skip body parsing for analyze-pronunciation (handles raw FormData)
  app.post("/api/analyze-pronunciation", handleAnalyzePronunciation);

  // Use JSON/URL parsers for other routes
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  return app;
}
