import {
  Target,
  ClipboardCheck,
  BarChart3,
  UserCircle,
} from "lucide-react";
import DashboardCard from "../components/DashboardCard";

function EmployeeDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          padding: "40px",
          color: "white",
          borderBottomLeftRadius: "30px",
          borderBottomRightRadius: "30px",
        }}
      >
        <h1>Welcome back, {user?.name}</h1>
        <p style={{ opacity: 0.9 }}>
          Manage your goals, track progress, and complete quarterly check-ins.
        </p>
      </div>

      <div style={{ padding: "30px" }}>
        <h2 style={{ marginBottom: "20px" }}>Employee Dashboard</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "22px",
          }}
        >
          <DashboardCard
            title="My Goal Sheet"
            description="Create, submit, and view your employee goal sheet."
            icon={Target}
            path="/employee/goals"
          />

          <DashboardCard
            title="Quarterly Check-ins"
            description="Update actual achievement and goal progress every quarter."
            icon={ClipboardCheck}
            path="/employee/checkins"
          />

          <DashboardCard
            title="My Progress"
            description="View your goal completion status and progress summary."
            icon={BarChart3}
            path="/employee/progress"
          />

          <DashboardCard
            title="My Profile"
            description="View your role, manager, and basic employee details."
            icon={UserCircle}
            path="/employee/profile"
          />
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;