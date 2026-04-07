import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { errorHandler } from "./middleware/errorHandler";
import adminRoutes from "./routes/admin/admin.routes";
import providerRoutes from "./routes/provider/provider.routes";
import otpRoutes from "../src/routes/otp.routes";
import authRoutes from "./routes/user/auth.routes";
import userRoutes from "./routes/user/user.routes";
import { LOG_MESSAGES } from "./shared/constants/logMessages";
import { logger } from "./shared/logger/logger";
dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRoutes);

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/admin", adminRoutes);
/* ================= ERROR HANDLER ================= */
app.use(errorHandler);

/* ================= START LOG ================= */
logger.info(LOG_MESSAGES.SYSTEM.APP_STARTED);

export default app;