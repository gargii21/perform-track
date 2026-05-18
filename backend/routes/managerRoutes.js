import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getManagerSummary, getManagerAnalytics } from "../controllers/managerController.js";

const router = express.Router();

router.get("/summary", protect(["manager"]), getManagerSummary);
router.get("/analytics", protect(["manager"]), getManagerAnalytics);

export default router;