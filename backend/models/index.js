import User from "./User.js";
import GoalSheet from "./GoalSheet.js";
import Goal from "./Goal.js";
import SharedGoal from "./SharedGoal.js";
import Checkin from "./Checkin.js";
import AuditLog from "./AuditLog.js";

User.hasMany(GoalSheet, { foreignKey: "employeeId" });
GoalSheet.belongsTo(User, { foreignKey: "employeeId", as: "employee" });

GoalSheet.hasMany(Goal, { foreignKey: "goalSheetId", onDelete: "CASCADE" });
Goal.belongsTo(GoalSheet, { foreignKey: "goalSheetId" });

SharedGoal.hasMany(Goal, { foreignKey: "sharedGoalId" });
Goal.belongsTo(SharedGoal, { foreignKey: "sharedGoalId" });

Goal.hasMany(Checkin, { foreignKey: "goalId", onDelete: "CASCADE" });
Checkin.belongsTo(Goal, { foreignKey: "goalId" });

User.hasMany(Checkin, { foreignKey: "employeeId" });
Checkin.belongsTo(User, { foreignKey: "employeeId", as: "employee" });

User.hasMany(AuditLog, { foreignKey: "userId" });
AuditLog.belongsTo(User, { foreignKey: "userId", as: "user" });

export { User, GoalSheet, Goal, SharedGoal, Checkin, AuditLog };