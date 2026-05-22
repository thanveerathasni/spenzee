import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import "reflect-metadata";
import app from "./app";
import { connectDatabase } from "./config/database";

const PORT = Number(process.env.PORT) || 5000;

(async () => {
  await connectDatabase(process.env.MONGO_URI as string);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
