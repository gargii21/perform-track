import {
  Users,
  ClipboardList,
  Share2,
  MessageSquareText,
  BarChart3,
} from "lucide-react";
import DashboardCard from "../components/DashboardCard";

function ManagerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #111827, #4f46e5)",
          padding: "40px",
          color: "white",
          borderBottomLeftRadius: "30px",
          borderBottomRightRadius: "30px",
        }}
      >
        <h1>Manager Workspace</h1>
        <p style={{ opacity: 0.9 }}>
          Welcome, {user?.name}. Review team goals, approve submissions, and
          manage shared KPIs.
        </p>
      </div>

      <div style={{ padding: "30px" }}>
        <h2 style={{ marginBottom: "20px" }}>Manager Dashboard</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "22px",
          }}
        >
          <DashboardCard
            title="Team Members"
            description="View employees mapped under your reporting hierarchy."
            icon={Users}
            path="/manager/team"
          />

          <DashboardCard
            title="Goal Approvals"
            description="Review submitted goal sheets and approve or return them."
            icon={ClipboardList}
            path="/manager/approvals"
          />

          <DashboardCard
            title="Shared Goals"
            description="Push departmental KPIs to multiple employees."
            icon={Share2}
            path="/manager/shared-goals"
          />

          <DashboardCard
            title="Quarterly Check-ins"
            description="Add check-in comments and review planned vs actual progress."
            icon={MessageSquareText}
            path="/manager/checkins"
          />

          <DashboardCard
            title="Team Analytics"
            description="View team-wise goal completion and progress reports."
            icon={BarChart3}
            path="/manager/analytics"
          />
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;