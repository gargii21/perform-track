import { Goal, GoalSheet, Checkin, User } from "../models/index.js";

const extractNumber = (value) => {
  if (!value) return 0;
  const match = String(value).match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

const calculateProgressScore = (goal, actualAchievement) => {
  const targetDirection = goal.targetDirection;
  const target = extractNumber(goal.target);
  const actual = extractNumber(actualAchievement);

  if (targetDirection === "min") {
    if (target === 0) return 0;
    return Math.min((actual / target) * 100, 100);
  }

  if (targetDirection === "max") {
    if (actual === 0) return 100;
    return Math.min((target / actual) * 100, 100);
  }

  if (targetDirection === "zero") {
    return actual === 0 ? 100 : 0;
  }

  if (targetDirection === "timeline") {
    const deadline = new Date(goal.target);
    const completionDate = new Date(actualAchievement);

    if (isNaN(deadline) || isNaN(completionDate)) return 0;

    return completionDate <= deadline ? 100 : 50;
  }

  return 0;
};

export const getApprovedGoalsForCheckin = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const sheet = await GoalSheet.findOne({
      where: {
        employeeId,
        status: "approved",
        isLocked: true,
      },
      include: [Goal],
    });

    if (!sheet) {
      return res.status(404).json({
        message: "No approved goal sheet found",
      });
    }

    res.json(sheet.Goals);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch approved goals",
      error: error.message,
    });
  }
};

export const submitQuarterlyCheckin = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { quarter, checkins } = req.body;

    if (!quarter || !checkins || checkins.length === 0) {
      return res.status(400).json({
        message: "Quarter and check-in data are required",
      });
    }

    const createdCheckins = [];

    for (const item of checkins) {
      const goal = await Goal.findOne({
        where: {
          id: item.goalId,
          employeeId,
        },
      });

      if (!goal) {
        return res.status(404).json({
          message: `Goal not found for id ${item.goalId}`,
        });
      }

      const sheet = await GoalSheet.findByPk(goal.goalSheetId);

      if (!sheet || sheet.status !== "approved") {
        return res.status(400).json({
          message: "Only approved goals can have check-ins",
        });
      }

      const progressScore = calculateProgressScore(
        goal,
        item.actualAchievement
      );

      const existing = await Checkin.findOne({
        where: {
          goalId: goal.id,
          employeeId,
          quarter,
        },
      });

      if (existing) {
        existing.actualAchievement = item.actualAchievement;
        existing.progressStatus = item.progressStatus;
        existing.progressScore = progressScore;
        existing.employeeComment = item.employeeComment || null;
        await existing.save();
        createdCheckins.push(existing);
      } else {
        const checkin = await Checkin.create({
          goalId: goal.id,
          employeeId,
          managerId: sheet.managerId,
          quarter,
          plannedTarget: goal.target,
          actualAchievement: item.actualAchievement,
          progressStatus: item.progressStatus,
          progressScore,
          employeeComment: item.employeeComment || null,
        });

        createdCheckins.push(checkin);
      }
    }

    res.status(201).json({
      message: "Quarterly check-in submitted successfully",
      checkins: createdCheckins,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit check-in",
      error: error.message,
    });
  }
};

export const getMyCheckins = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { quarter } = req.query;

    const whereClause = { employeeId };

    if (quarter) {
      whereClause.quarter = quarter;
    }

    const checkins = await Checkin.findAll({
      where: whereClause,
      include: [Goal],
      order: [["id", "ASC"]],
    });

    res.json(checkins);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch check-ins",
      error: error.message,
    });
  }
};

export const getTeamCheckins = async (req, res) => {
  try {
    const managerId = req.user.id;
    const { quarter } = req.query;

    const whereClause = { managerId };

    if (quarter) {
      whereClause.quarter = quarter;
    }

    const checkins = await Checkin.findAll({
      where: whereClause,
      include: [
        Goal,
        {
          model: User,
          as: "employee",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["employeeId", "ASC"]],
    });

    res.json(checkins);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch team check-ins",
      error: error.message,
    });
  }
};

export const addManagerComment = async (req, res) => {
  try {
    const managerId = req.user.id;
    const { checkinId } = req.params;
    const { managerComment } = req.body;

    const checkin = await Checkin.findOne({
      where: {
        id: checkinId,
        managerId,
      },
    });

    if (!checkin) {
      return res.status(404).json({
        message: "Check-in not found",
      });
    }

    checkin.managerComment = managerComment;
    checkin.isManagerReviewed = true;

    await checkin.save();

    res.json({
      message: "Manager check-in comment added",
      checkin,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add manager comment",
      error: error.message,
    });
  }
};