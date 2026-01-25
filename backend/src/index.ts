import "dotenv/config";
import app from "./app";
import { connectDatabase } from "./config/database";

const PORT = Number(process.env.PORT) || 4000;

(async () => {
  await connectDatabase(process.env.MONGO_URI);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(` Server running on port ${PORT}`);
  });
})();
