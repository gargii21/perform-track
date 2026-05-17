import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  createSharedGoal,
  updateSharedGoalWeightage,
} from "../controllers/sharedGoalController.js";

const router = express.Router();

router.post("/", protect(["manager", "admin"]), createSharedGoal);

router.put(
  "/weightage/:goalId",
  protect(["employee"]),
  updateSharedGoalWeightage
);

export default router;