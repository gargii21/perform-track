import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import sharedGoalRoutes from "./routes/sharedGoalRoutes.js";
import checkinRoutes from "./routes/checkinRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/shared-goals", sharedGoalRoutes);
app.use("/api/checkins", checkinRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
const startServer = async () => {
  try {
    console.log(process.env.DATABASE_URL);

    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync({ alter: true });
    console.log("Models synced");

    app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
  } catch (error) {
    console.log("Server error:", error.message);
  }
};

startServer();