// import express from "express";
// import { container } from "./di/container";
// import { TYPES } from "./di/types";
// import { AuthController } from "./controllers/AuthController";
// import { errorHandler } from "./middleware/errorHandler";
// import authRoutes from "./routes/auth.routes";



// // AFTER routes


// const app = express();
// app.use(cookieParser());

// app.use(express.json());
// const authController = container.get<AuthController>(TYPES.AuthController);
// app.use("/auth", authRoutes);

// app.post("/auth/login", (req, res) =>
//   authController.login(req, res)
// );

// app.use(errorHandler);


// export default app;



import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import testRoutes from "./routes/test.routes";

const app = express(); // ✅ MUST be first

// middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/auth", authRoutes);
app.use("/test", testRoutes);

// global error handler (LAST)
app.use(errorHandler);

export default app;
