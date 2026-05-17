import { AuditLog } from "../models/index.js";

export const createAuditLog = async ({
  userId,
  action,
  entityType,
  entityId,
  oldValue = null,
  newValue = null,
  reason = null,
}) => {
  await AuditLog.create({
    userId,
    action,
    entityType,
    entityId,
    oldValue,
    newValue,
    reason,
  });
};