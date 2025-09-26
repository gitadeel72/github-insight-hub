import { Router } from "express";
import {
  redirectToGithub,
  githubCallback,
  removeIntegration,
  resyncIntegration,
  getIntegrationStatus,
  getEntityData,
  getCollections,
} from "../controllers/github.controller";

const router = Router();

router.get("/connect", redirectToGithub);
router.post("/callback", githubCallback);
router.delete("/remove", removeIntegration);
router.post("/resync", resyncIntegration);
router.get("/status", getIntegrationStatus);
//
router.get("/collections", getCollections);

router.get("/entity/:entity", getEntityData);

export default router;