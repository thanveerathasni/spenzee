import express from "express";
import { container } from "./di/container";
import { TYPES } from "./di/types";
import { AuthController } from "./controllers/AuthController";
import { errorHandler } from "./middleware/errorHandler";

// AFTER routes


const app = express();

app.use(express.json());
const authController = container.get<AuthController>(TYPES.AuthController);

app.post("/auth/login", (req, res) =>
  authController.login(req, res)
);

app.use(errorHandler);


export default app;
