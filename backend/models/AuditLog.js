import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const AuditLog = sequelize.define("AuditLog", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  entityType: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  entityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  oldValue: {
    type: DataTypes.JSONB,
    allowNull: true,
  },

  newValue: {
    type: DataTypes.JSONB,
    allowNull: true,
  },

  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default AuditLog;