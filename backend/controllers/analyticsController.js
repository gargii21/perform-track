import { User, Goal, GoalSheet, Checkin } from "../models/index.js";
import { Sequelize } from "sequelize";

export const getAdminSummary = async (req, res) => {
  try {
    const [
      totalEmployees,
      totalManagers,
      pendingSheets,
      lockedSheets,
      completedQ1,
    ] = await Promise.all([
      User.count({ where: { role: "employee" } }),
      User.count({ where: { role: "manager" } }),
      GoalSheet.count({ where: { status: "submitted" } }),
      GoalSheet.count({ where: { status: "rework" } }),
      Checkin.count({ where: { quarter: "Q1", progressStatus: "Completed" } }),
    ]);

    res.json({
      totalEmployees,
      totalManagers,
      pendingSheets,
      lockedSheets,
      completedQ1,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch summary", error: error.message });
  }
};

export const getAdminAnalytics = async (req, res) => {
  try {
    const totalEmployees = await User.count({
      where: { role: "employee" },
    });

    const totalManagers = await User.count({
      where: { role: "manager" },
    });

    const totalGoals = await Goal.count();

    const totalCheckins = await Checkin.count();

    const completedGoals = await Checkin.count({
      where: { progressStatus: "Completed" },
    });

    const onTrackGoals = await Checkin.count({
      where: { progressStatus: "On Track" },
    });

    const notStartedGoals = await Checkin.count({
      where: { progressStatus: "Not Started" },
    });

    const avgProgress = await Checkin.findOne({
      attributes: [[Sequelize.fn("AVG", Sequelize.col("progressScore")), "avg"]],
      raw: true,
    });

    const quarterWiseProgress = await Checkin.findAll({
      attributes: [
        "quarter",
        [Sequelize.fn("AVG", Sequelize.col("progressScore")), "averageScore"],
      ],
      group: ["quarter"],
      raw: true,
    });

    const uomDistribution = await Goal.findAll({
      attributes: [
        "uomType",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: ["uomType"],
      raw: true,
    });

    const managerReviews = await Checkin.findAll({
      attributes: [
        "managerId",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "totalReviews"],
      ],
      where: { isManagerReviewed: true },
      group: ["managerId"],
      raw: true,
    });

    res.json({
      summary: {
        totalEmployees,
        totalManagers,
        totalGoals,
        totalCheckins,
        completedGoals,
        onTrackGoals,
        notStartedGoals,
        averageProgress: Number(avgProgress?.avg || 0).toFixed(2),
      },
      goalStatusDistribution: [
        { name: "Completed", value: completedGoals },
        { name: "On Track", value: onTrackGoals },
        { name: "Not Started", value: notStartedGoals },
      ],
      quarterWiseProgress,
      uomDistribution,
      managerReviews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
};