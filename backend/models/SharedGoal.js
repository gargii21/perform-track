import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SharedGoal = sequelize.define("SharedGoal", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  thrustArea: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  uomType: {
    type: DataTypes.ENUM("numeric", "percentage", "timeline", "zero-based"),
    allowNull: false,
  },

  target: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  primaryOwnerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default SharedGoal;