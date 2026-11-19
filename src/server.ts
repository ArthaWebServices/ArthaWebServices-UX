import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";

dotenv.config();

import contactRoutes from "./routes/contact.routes";
import newsletterRoutes from "./routes/newsletter.routes";
import adminRoutes from "./routes/admin.routes";
import healthRoutes from "./routes/health.routes";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Security & Parsing Middleware
app.use(helmet());

// Gzip / Deflate Response Compression Middleware
app.use(
  compression({
    threshold: 1024, // Responses > 1KB are compressed
    filter: (req: express.Request, res: express.Response) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
    level: 6, // Optimal balance of CPU throughput and compression ratio
  })
);
app.use(
  cors({
    origin: [CLIENT_URL, "https://arthawebservices.dev", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/health", healthRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/admin", adminRoutes);

// Fallback 404 for unknown endpoints
app.use((req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`⚡ [Artha Backend] Express API server running on http://localhost:${PORT}`);
  console.log(`🔒 [Artha Backend] Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
