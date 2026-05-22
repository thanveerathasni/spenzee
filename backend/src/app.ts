import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { errorHandler } from "./middleware/errorHandler";
import adminAuthRoutes from "./routes/admin/admin.auth.routes";
import adminRoutes from "./routes/admin/admin.routes";
import otpRoutes from "./routes/otp.routes";
import notificationRoutes from "./routes/notification.routes";
import providerRoutes from "./routes/provider/provider.routes";
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

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);

/* ================= ERROR HANDLER ================= */
app.use(errorHandler);

/* ================= START LOG ================= */
logger.info(LOG_MESSAGES.SYSTEM.APP_STARTED);

export default app;
