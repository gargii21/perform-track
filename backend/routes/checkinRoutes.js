import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  getApprovedGoalsForCheckin,
  submitQuarterlyCheckin,
  getMyCheckins,
  getTeamCheckins,
  addManagerComment,
} from "../controllers/checkinController.js";

const router = express.Router();

router.get(
  "/employee/approved-goals",
  protect(["employee"]),
  getApprovedGoalsForCheckin
);

router.post(
  "/employee/submit",
  protect(["employee"]),
  submitQuarterlyCheckin
);

router.get("/employee/my", protect(["employee"]), getMyCheckins);

router.get("/manager/team", protect(["manager"]), getTeamCheckins);

router.put(
  "/manager/comment/:checkinId",
  protect(["manager"]),
  addManagerComment
);

export default router;