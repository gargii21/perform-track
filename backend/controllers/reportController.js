import ExcelJS from "exceljs";
import { User, Goal, GoalSheet, Checkin } from "../models/index.js";

export const getAchievementReport = async (req, res) => {
  try {
    const { quarter } = req.query;

    const whereClause = {};
    if (quarter) whereClause.quarter = quarter;

    const checkins = await Checkin.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "employee",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Goal,
        },
      ],
      order: [["employeeId", "ASC"]],
    });

    const report = checkins.map((item) => ({
      employeeName: item.employee?.name,
      employeeEmail: item.employee?.email,
      quarter: item.quarter,
      goalTitle: item.Goal?.title,
      thrustArea: item.Goal?.thrustArea,
      uomType: item.Goal?.uomType,
      targetDirection: item.Goal?.targetDirection,
      plannedTarget: item.plannedTarget,
      actualAchievement: item.actualAchievement,
      progressStatus: item.progressStatus,
      progressScore: item.progressScore,
      employeeComment: item.employeeComment,
      managerComment: item.managerComment,
      managerReviewed: item.isManagerReviewed,
    }));

    res.json(report);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate achievement report",
      error: error.message,
    });
  }
};

export const exportAchievementExcel = async (req, res) => {
  try {
    const { quarter } = req.query;

    const whereClause = {};
    if (quarter) whereClause.quarter = quarter;

    const checkins = await Checkin.findAll({
      where: whereClause,
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
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Achievement Report");

    worksheet.columns = [
      { header: "Employee Name", key: "employeeName", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Quarter", key: "quarter", width: 10 },
      { header: "Goal Title", key: "goalTitle", width: 30 },
      { header: "Thrust Area", key: "thrustArea", width: 25 },
      { header: "UoM", key: "uomType", width: 15 },
      { header: "Target Direction", key: "targetDirection", width: 18 },
      { header: "Planned Target", key: "plannedTarget", width: 20 },
      { header: "Actual Achievement", key: "actualAchievement", width: 22 },
      { header: "Status", key: "progressStatus", width: 18 },
      { header: "Progress Score", key: "progressScore", width: 18 },
      { header: "Employee Comment", key: "employeeComment", width: 35 },
      { header: "Manager Comment", key: "managerComment", width: 35 },
      { header: "Manager Reviewed", key: "managerReviewed", width: 18 },
    ];

    checkins.forEach((item) => {
      worksheet.addRow({
        employeeName: item.employee?.name,
        email: item.employee?.email,
        quarter: item.quarter,
        goalTitle: item.Goal?.title,
        thrustArea: item.Goal?.thrustArea,
        uomType: item.Goal?.uomType,
        targetDirection: item.Goal?.targetDirection,
        plannedTarget: item.plannedTarget,
        actualAchievement: item.actualAchievement,
        progressStatus: item.progressStatus,
        progressScore: item.progressScore,
        employeeComment: item.employeeComment,
        managerComment: item.managerComment,
        managerReviewed: item.isManagerReviewed ? "Yes" : "No",
      });
    });

    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=achievement_report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({
      message: "Failed to export Excel report",
      error: error.message,
    });
  }
};

export const getCompletionDashboard = async (req, res) => {
  try {
    const { quarter } = req.query;

    const employees = await User.findAll({
      where: { role: "employee" },
      attributes: ["id", "name", "email", "managerId"],
    });

    const result = [];

    for (const employee of employees) {
      const approvedSheet = await GoalSheet.findOne({
        where: {
          employeeId: employee.id,
          status: "approved",
        },
        include: [Goal],
      });

      const totalGoals = approvedSheet?.Goals?.length || 0;

      let submittedCheckins = 0;
      let reviewedCheckins = 0;

      if (totalGoals > 0 && quarter) {
        submittedCheckins = await Checkin.count({
          where: {
            employeeId: employee.id,
            quarter,
          },
        });

        reviewedCheckins = await Checkin.count({
          where: {
            employeeId: employee.id,
            quarter,
            isManagerReviewed: true,
          },
        });
      }

      result.push({
        employeeId: employee.id,
        employeeName: employee.name,
        employeeEmail: employee.email,
        goalSheetApproved: !!approvedSheet,
        totalGoals,
        submittedCheckins,
        reviewedCheckins,
        employeeCompletion:
          totalGoals === 0 ? 0 : Math.round((submittedCheckins / totalGoals) * 100),
        managerReviewCompletion:
          totalGoals === 0 ? 0 : Math.round((reviewedCheckins / totalGoals) * 100),
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load completion dashboard",
      error: error.message,
    });
  }
};