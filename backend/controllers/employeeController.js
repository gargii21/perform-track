import { Goal, GoalSheet, Checkin } from "../models/index.js";

export const getEmployeeSummary = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const [
      goalsSet,
      checkins,
      completedCheckins,
      pendingSheet,
    ] = await Promise.all([
      Goal.count({
        include: [{ model: GoalSheet, where: { employeeId }, required: true }],
      }),
      Checkin.count({ where: { employeeId } }),
      Checkin.count({ where: { employeeId, progressStatus: "Completed" } }),
      GoalSheet.count({ where: { employeeId, status: "submitted" } }),
    ]);

    const inProgress = await Checkin.count({
      where: { employeeId, progressStatus: "On Track" },
    });

    res.json({
      goalsSet,
      inProgress,
      completed: completedCheckins,
      pendingReview: pendingSheet,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch summary", error: error.message });
  }
};