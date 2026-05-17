import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Goal = sequelize.define("Goal", {
  goalSheetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  thrustArea: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  uomType: {
    type: DataTypes.ENUM("numeric", "percentage", "timeline", "zero-based"),
    allowNull: false,
  },

  targetDirection: {
    type: DataTypes.ENUM("min", "max", "timeline", "zero"),
    defaultValue: "min",
  },

  target: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  weightage: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  isShared: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  sharedGoalId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  isPrimaryOwner: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default Goal;