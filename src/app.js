import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import problemRoutes from "./routes/problemsRoutes.js";


const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// important for cookies to work in frontend
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/problems", problemRoutes);

export default app;
