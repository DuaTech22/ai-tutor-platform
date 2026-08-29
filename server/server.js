import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import generateRoutes from "./routes/generateRoutes.js";
import discussionRoutes from "./routes/discussionRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import diagramRoutes from "./routes/diagramRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import savedNoteRoutes from "./routes/savedNoteRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(helmet());

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again in a few minutes." },
});
app.use("/api", generalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many login/register attempts. Please try again later.",
  },
});
app.use("/api/auth", authLimiter);

connectDB();

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/generate", generateRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/diagram", diagramRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/saved-notes", savedNoteRoutes);
app.use("/api/progress", progressRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
