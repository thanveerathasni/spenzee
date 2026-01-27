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
import cors from "cors"
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import testRoutes from "./routes/test.routes";

const app = express(); // ✅ MUST be first

// middleware

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
      ];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/auth", authRoutes);
// app.use("/api/auth", authRoutes);
app.use("/test", testRoutes);

// global error handler (LAST)
app.use(errorHandler);

export default app;
