import { AuditLog, GoalSheet, Goal, User } from "../models/index.js";
import { createAuditLog } from "../utils/auditLogger.js";

export const unlockGoalSheet = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { sheetId } = req.params;
    const { reason } = req.body;

    const sheet = await GoalSheet.findByPk(sheetId);

    if (!sheet) {
      return res.status(404).json({ message: "Goal sheet not found" });
    }

    const oldValue = {
      status: sheet.status,
      isLocked: sheet.isLocked,
    };

    sheet.isLocked = false;
    sheet.status = "rework";
    await sheet.save();

    await createAuditLog({
      userId: adminId,
      action: "UNLOCK_GOAL_SHEET",
      entityType: "GoalSheet",
      entityId: sheet.id,
      oldValue,
      newValue: {
        status: sheet.status,
        isLocked: sheet.isLocked,
      },
      reason,
    });

    res.json({
      message: "Goal sheet unlocked successfully",
      sheet,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to unlock goal sheet",
      error: error.message,
    });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch audit logs",
      error: error.message,
    });
  }
};

export const getAllGoalSheets = async (req, res) => {
  try {
    const sheets = await GoalSheet.findAll({
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["id", "name", "email"],
        },
        {
          model: Goal,
        },
      ],
      order: [["id", "DESC"]],
    });

    res.json(sheets);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch goal sheets",
      error: error.message,
    });
  }
};