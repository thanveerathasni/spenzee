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
import cookieParser from "cookie-parser"; // ✅ REQUIRED
import { container } from "./di/container";
import { TYPES } from "./di/types";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import testRoutes from "./routes/test.routes";


const app = express();

// global middlewares
app.use(express.json());
app.use(cookieParser()); // ✅ now defined
app.use("/test", testRoutes);

// routes
app.use("/auth", authRoutes);

// error handler (MUST be last)
app.use(errorHandler);

export default app;
