

import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/user/auth.routes";
import testRoutes from "./routes/test.routes";
import adminRouter from "./routes/admin/admin.routes";
import adminAuthRouter from "./routes/admin/admin.auth.routes";
import providerRequestRoutes from './routes/provider/provider.request.routes';
import providerAuthRoutes from "./routes/provider/provider.auth.routes";

const app = express(); 

// middleware

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/auth", authRoutes);
app.use("/test", testRoutes);
app.use("/admin/auth", adminAuthRouter);

app.use("/admin", adminRouter);


app.use('/api', providerRequestRoutes);
app.use("/provider/auth", providerAuthRoutes);

// global error handler 
app.use(errorHandler);

export default app;
