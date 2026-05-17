import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const GoalSheet = sequelize.define("GoalSheet", {
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  managerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  status: {
    type: DataTypes.ENUM("draft", "submitted", "approved", "rework"),
    defaultValue: "draft",
  },

  managerComment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  isLocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default GoalSheet;