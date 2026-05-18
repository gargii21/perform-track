import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getEmployeeSummary } from "../controllers/employeeController.js";

import {
  createGoalSheet,
  getMyGoalSheet,
  getSubmittedGoalSheets,
  updateGoalByManager,
  approveGoalSheet,
  returnForRework,
} from "../controllers/goalController.js";
import { getManagerSummary } from "../controllers/managerController.js";

const router = express.Router();

router.post("/", protect(["employee"]), createGoalSheet);
router.get("/my", protect(["employee"]), getMyGoalSheet);

router.get("/submitted", protect(["manager"]), getSubmittedGoalSheets);



router.get("/employee/summary", protect(["employee"]), getEmployeeSummary);

router.put(
  "/manager/edit/:goalId",
  protect(["manager"]),
  updateGoalByManager
);

router.put(
  "/manager/approve/:sheetId",
  protect(["manager"]),
  approveGoalSheet
);

router.put(
  "/manager/rework/:sheetId",
  protect(["manager"]),
  returnForRework
);

export default router;