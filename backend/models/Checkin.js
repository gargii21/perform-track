import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Checkin = sequelize.define("Checkin", {
  goalId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  managerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  quarter: {
    type: DataTypes.ENUM("Q1", "Q2", "Q3", "Q4"),
    allowNull: false,
  },

  plannedTarget: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  actualAchievement: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  progressStatus: {
    type: DataTypes.ENUM("Not Started", "On Track", "Completed"),
    allowNull: false,
  },

  progressScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },

  employeeComment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  managerComment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  isManagerReviewed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default Checkin;