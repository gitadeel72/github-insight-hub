import createApp from "./app";
import config from "./config";
import { connectDB } from "./db";

const app = createApp();

const start = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port}`);
  });
};

start().catch((err) => {
  console.error("❌ Startup failed:", err);
  process.exit(1);
});