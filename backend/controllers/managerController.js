
import { GoalSheet, User, Goal, Checkin } from "../models/index.js";
import { Sequelize } from "sequelize";

export const getManagerAnalytics = async (req, res) => {
  try {
    const managerId = req.user.id;

    const teamMembers = await User.findAll({
      where: { managerId, role: "employee" },
      attributes: ["id", "name"],
    });
    const employeeIds = teamMembers.map((e) => e.id);
    const teamSize    = employeeIds.length;

    if (teamSize === 0) {
      return res.json({
        summary: { teamSize: 0, totalGoals: 0, completed: 0, pendingApprovals: 0, avgProgress: "0.00" },
        statusDistribution: [],
        quarterWiseProgress: [],
        memberProgress: [],
      });
    }

    const [totalGoals, completed, pendingApprovals, avgProgressRow] = await Promise.all([
      Goal.count({
        include: [{ model: GoalSheet, where: { employeeId: employeeIds }, required: true }],
      }),
      Checkin.count({ where: { employeeId: employeeIds, progressStatus: "Completed" } }),
      GoalSheet.count({ where: { employeeId: employeeIds, status: "submitted" } }),
      Checkin.findOne({
        attributes: [[Sequelize.fn("AVG", Sequelize.col("progressScore")), "avg"]],
        where: { employeeId: employeeIds },
        raw: true,
      }),
    ]);

    const onTrack    = await Checkin.count({ where: { employeeId: employeeIds, progressStatus: "On Track" } });
    const notStarted = await Checkin.count({ where: { employeeId: employeeIds, progressStatus: "Not Started" } });

    const quarterWiseProgress = await Checkin.findAll({
      attributes: [
        "quarter",
        [Sequelize.fn("AVG", Sequelize.col("progressScore")), "avgScore"],
      ],
      where: { employeeId: employeeIds },
      group: ["quarter"],
      raw: true,
    });

    const memberProgress = await Promise.all(
      teamMembers.map(async (emp) => {
        const avg = await Checkin.findOne({
          attributes: [[Sequelize.fn("AVG", Sequelize.col("progressScore")), "avg"]],
          where: { employeeId: emp.id },
          raw: true,
        });
        return {
          name: emp.name,
          avgScore: Number(avg?.avg || 0).toFixed(1),
        };
      })
    );

    res.json({
      summary: {
        teamSize,
        totalGoals,
        completed,
        pendingApprovals,
        avgProgress: Number(avgProgressRow?.avg || 0).toFixed(2),
      },
      statusDistribution: [
        { name: "Completed",   value: completed },
        { name: "On Track",    value: onTrack },
        { name: "Not Started", value: notStarted },
      ],
      quarterWiseProgress: quarterWiseProgress.map((q) => ({
        quarter:  q.quarter,
        avgScore: Number(q.avgScore).toFixed(1),
      })),
      memberProgress,
    });
  } catch (error) {
    console.error("Manager analytics error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
export const getManagerSummary = async (req, res) => {
  try {
    const managerId = req.user.id;

    const teamMembers = await User.findAll({
      where: { managerId, role: "employee" },
      attributes: ["id"],
    });

    const employeeIds = teamMembers.map((e) => e.id);

    console.log("managerId:", managerId);
    console.log("employeeIds:", employeeIds);

    const teamSize = employeeIds.length;

    const pendingApprovals = teamSize
      ? await GoalSheet.count({
          where: { employeeId: employeeIds, status: "submitted" },
        })
      : 0;

    const checkinsDue = teamSize
      ? await GoalSheet.count({
          where: { employeeId: employeeIds, status: "approved" },
        })
      : 0;

    // Count shared goals safely — only if model exists
    let sharedGoals = 0;
    try {
      const { SharedGoal } = await import("../models/index.js");
      sharedGoals = await SharedGoal.count({ where: { managerId } });
    } catch {
      sharedGoals = 0;
    }

    res.json({
      teamSize,
      pendingApprovals,
      sharedGoals,
      checkinsDue,
    });
  } catch (error) {
    console.error("Manager summary error:", error.message);
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
};