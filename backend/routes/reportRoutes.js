import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getAchievementReport,
  exportAchievementExcel,
  getCompletionDashboard,
} from "../controllers/reportController.js";

const router = express.Router();

router.get(
  "/achievement",
  protect(["admin", "manager"]),
  getAchievementReport
);

router.get(
  "/achievement/export",
  protect(["admin", "manager"]),
  exportAchievementExcel
);

router.get(
  "/completion",
  protect(["admin", "manager"]),
  getCompletionDashboard
);

export default router;