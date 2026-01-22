import "dotenv/config";   // must be first

import mongoose from "mongoose";
import app from "./app";
import { transporter } from "../src/shared/utils/mailer";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// console.log("MAIL_USER =", process.env.MAIL_USER);
// console.log("MAIL_PASS =", process.env.MAIL_PASS);

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("Mongo error:", err);
    process.exit(1);
  });

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
const shutdown = () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
