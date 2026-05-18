import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getAdminAnalytics, getAdminSummary } from "../controllers/analyticsController.js";

const router = express.Router();


router.get("/admin/summary", protect(["admin"]), getAdminSummary);
router.get("/admin", protect(["admin", "manager"]), getAdminAnalytics);

export default router;