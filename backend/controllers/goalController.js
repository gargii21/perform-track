import { GoalSheet, Goal, User } from "../models/index.js";
import { createAuditLog } from "../utils/auditLogger.js";

const validateGoals = (goals) => {
  if (!goals || goals.length === 0) {
    return "At least one goal is required";
  }

  if (goals.length > 8) {
    return "Maximum 8 goals are allowed";
  }

  for (let goal of goals) {
    if (Number(goal.weightage) < 10) {
      return "Minimum weightage per goal must be 10%";
    }
  }

  const totalWeightage = goals.reduce(
    (sum, goal) => sum + Number(goal.weightage),
    0
  );

  if (totalWeightage !== 100) {
    return "Total weightage must be exactly 100%";
  }

  return null;
};

export const createGoalSheet = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { goals } = req.body;

    const error = validateGoals(goals);
    if (error) return res.status(400).json({ message: error });

    const existingSheet = await GoalSheet.findOne({
      where: { employeeId, status: ["draft", "submitted", "approved"] },
    });

    if (existingSheet && existingSheet.isLocked) {
      return res.status(400).json({
        message: "Your goal sheet is locked after approval",
      });
    }

    const user = await User.findByPk(employeeId);

    const goalSheet = await GoalSheet.create({
      employeeId,
      managerId: user.managerId || null,
      status: "submitted",
    });

    const goalData = goals.map((goal) => ({
      goalSheetId: goalSheet.id,
      employeeId,
      thrustArea: goal.thrustArea,
      title: goal.title,
      description: goal.description,
      uomType: goal.uomType,
      target: goal.target,
      weightage: goal.weightage,
      isShared: goal.isShared || false,
      sharedGoalId: goal.sharedGoalId || null,
      isPrimaryOwner: goal.isPrimaryOwner || false,
      targetDirection: goal.targetDirection || "min",
    }));

    await Goal.bulkCreate(goalData);

    res.status(201).json({
      message: "Goal sheet submitted successfully",
      goalSheet,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create goal sheet",
      error: error.message,
    });
  }
};

export const getMyGoalSheet = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const goalSheet = await GoalSheet.findOne({
      where: { employeeId },
      include: [Goal],
      order: [[Goal, "id", "ASC"]],
    });

    res.json(goalSheet);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch goal sheet",
      error: error.message,
    });
  }
};

export const getSubmittedGoalSheets = async (req, res) => {
  try {
    const managerId = req.user.id;

    const sheets = await GoalSheet.findAll({
      where: { managerId, status: "submitted" },
      include: [
        { model: Goal },
        { model: User, as: "employee", attributes: ["id", "name", "email"] },
      ],
    });

    res.json(sheets);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch submitted goal sheets",
      error: error.message,
    });
  }
};

export const updateGoalByManager = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { target, weightage } = req.body;

    const goal = await Goal.findByPk(goalId);

    const oldValue = {
  target: goal.target,
  weightage: goal.weightage,
};

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const sheet = await GoalSheet.findByPk(goal.goalSheetId);

    if (sheet.isLocked) {
      return res.status(400).json({ message: "Goal sheet is locked" });
    }

    if (target !== undefined) goal.target = target;
    if (weightage !== undefined) goal.weightage = weightage;

    await goal.save();

    await createAuditLog({
  userId: req.user.id,
  action: "MANAGER_EDIT_GOAL",
  entityType: "Goal",
  entityId: goal.id,
  oldValue,
  newValue: {
    target: goal.target,
    weightage: goal.weightage,
  },
  reason: "Manager edited target/weightage during approval",
});

    res.json({
      message: "Goal updated by manager",
      goal,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update goal",
      error: error.message,
    });
  }
};

export const approveGoalSheet = async (req, res) => {
  try {
    const { sheetId } = req.params;

    const sheet = await GoalSheet.findByPk(sheetId, {
      include: [Goal],
    });

    const oldValue = {
  status: sheet.status,
  isLocked: sheet.isLocked,
};

    if (!sheet) {
      return res.status(404).json({ message: "Goal sheet not found" });
    }

    const error = validateGoals(sheet.Goals);
    if (error) return res.status(400).json({ message: error });

    sheet.status = "approved";
    sheet.isLocked = true;
    await sheet.save();

    await createAuditLog({
  userId: req.user.id,
  action: "APPROVE_GOAL_SHEET",
  entityType: "GoalSheet",
  entityId: sheet.id,
  oldValue,
  newValue: {
    status: sheet.status,
    isLocked: sheet.isLocked,
  },
  reason: "Manager approved goal sheet",
});

    res.json({
      message: "Goal sheet approved and locked",
      sheet,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to approve goal sheet",
      error: error.message,
    });
  }
};

export const returnForRework = async (req, res) => {
  try {
    const { sheetId } = req.params;
    const { comment } = req.body;

    const sheet = await GoalSheet.findByPk(sheetId);

    const oldValue = {
  status: sheet.status,
  isLocked: sheet.isLocked,
  managerComment: sheet.managerComment,
};

    if (!sheet) {
      return res.status(404).json({ message: "Goal sheet not found" });
    }

    sheet.status = "rework";
    sheet.managerComment = comment;
    sheet.isLocked = false;

    await sheet.save();

    await createAuditLog({
  userId: req.user.id,
  action: "RETURN_FOR_REWORK",
  entityType: "GoalSheet",
  entityId: sheet.id,
  oldValue,
  newValue: {
    status: sheet.status,
    isLocked: sheet.isLocked,
    managerComment: sheet.managerComment,
  },
  reason: comment,
});

    res.json({
      message: "Goal sheet returned for rework",
      sheet,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to return for rework",
      error: error.message,
    });
  }
};