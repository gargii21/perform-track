import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  unlockGoalSheet,
  getAuditLogs,
  getAllGoalSheets,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/goal-sheets", protect(["admin"]), getAllGoalSheets);

router.put("/unlock-goal-sheet/:sheetId", protect(["admin"]), unlockGoalSheet);

router.get("/audit-logs", protect(["admin"]), getAuditLogs);

export default router;