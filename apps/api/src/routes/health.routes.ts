import { Router } from "express";
import { isMongoDBConnected } from "../config/mongodb.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "SpendLine API is healthy",
  });
});

router.get("/ready", (_req, res) => {
  const isReady = isMongoDBConnected();

  res.status(isReady ? 200 : 503).json({
    success: isReady,
    status: isReady ? "ready" : "not_ready",
    dependencies: {
      mongodb: isReady ? "connected" : "disconnected",
    },
  });
});

export default router;