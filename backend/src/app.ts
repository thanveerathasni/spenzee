import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/authRoutes";

const app = express();

// 🔥 CORS (must match frontend port)
app.use(
  cors({
    origin: "http://localhost:5173", // Vite
    credentials: true,
  })
);

// 🔥 REQUIRED MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ❗ YOU MISSED THIS

// 🔍 Health checks
app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello from the server!" });
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// 🔐 Auth routes
app.use("/api/auth", authRoutes);

// ❌ 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

// 💥 Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("ERROR:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
