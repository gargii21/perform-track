import { SharedGoal, GoalSheet, Goal } from "../models/index.js";

export const createSharedGoal = async (req, res) => {
  try {
    const createdBy = req.user.id;

    const {
      title,
      description,
      thrustArea,
      uomType,
      target,
      primaryOwnerId,
      employeeIds,
      defaultWeightage,
    } = req.body;

    if (!employeeIds || employeeIds.length === 0) {
      return res.status(400).json({ message: "Employee list is required" });
    }

    const sharedGoal = await SharedGoal.create({
      title,
      description,
      thrustArea,
      uomType,
      target,
      primaryOwnerId,
      createdBy,
    });

    for (let employeeId of employeeIds) {
      let sheet = await GoalSheet.findOne({
        where: { employeeId, status: ["draft", "rework", "submitted"] },
      });

      if (!sheet) {
        sheet = await GoalSheet.create({
          employeeId,
          status: "draft",
        });
      }

      await Goal.create({
        goalSheetId: sheet.id,
        employeeId,
        thrustArea,
        title,
        description,
        uomType,
        target,
        weightage: defaultWeightage || 10,
        isShared: true,
        sharedGoalId: sharedGoal.id,
        isPrimaryOwner: employeeId === primaryOwnerId,
      });
    }

    res.status(201).json({
      message: "Shared goal pushed to employees",
      sharedGoal,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create shared goal",
      error: error.message,
    });
  }
};

export const updateSharedGoalWeightage = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { goalId } = req.params;
    const { weightage } = req.body;

    const goal = await Goal.findOne({
      where: { id: goalId, employeeId, isShared: true },
    });

    if (!goal) {
      return res.status(404).json({ message: "Shared goal not found" });
    }

    goal.weightage = weightage;
    await goal.save();

    res.json({
      message: "Shared goal weightage updated",
      goal,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update shared goal weightage",
      error: error.message,
    });
  }
};