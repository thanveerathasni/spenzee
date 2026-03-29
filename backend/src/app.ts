import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { errorHandler } from "./middleware/errorHandler";
import adminRoutes from "./routes/admin/admin.routes";
import providerRoutes from "./routes/provider/provider.routes";

import authRoutes from "./routes/user/auth.routes";
import { logger } from "./shared/logger/logger";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(cookieParser());

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/admin", adminRoutes);

/* ================= ERROR HANDLER ================= */
app.use(errorHandler);

/* ================= START LOG ================= */
logger.info("App initialized");

export default app;