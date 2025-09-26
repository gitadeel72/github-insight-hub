import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import githubRoutes from "./routes/github.routes";

const createApp = () => {
  const app = express();

  app.use(cors({ origin: true, credentials: true }));
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.use("/api/github", githubRoutes);

  app.get("/health", (req, res) => res.json({ ok: true, uptime: process.uptime() }));

  app.use((err: any, _req: express.Request, res: express.Response, _next: any) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({ message: err.message || "Internal error" });
  });

  return app;
};

export default createApp;