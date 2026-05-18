import {
  Users,
  ClipboardList,
  Share2,
  MessageSquareText,
  BarChart3,
  Bell,
  Target,
  UserCircle,
} from "lucide-react";
import DashboardCard from "../components/DashboardCard";
import Sidebar from "../components/Sidebar";

const navItems = [
  { label: "Dashboard", icon: BarChart3, path: "/manager-dashboard" },
  // { label: "Team Members", icon: Users, path: "/manager/team" },
  { label: "Goal Approvals", icon: ClipboardList, path: "/manager/approvals" },
  { label: "Shared Goals", icon: Share2, path: "/manager/shared-goals" },
  { label: "Quarterly Check-ins", icon: MessageSquareText, path: "/manager/checkins" },
  // { label: "Team Analytics", icon: BarChart3, path: "/manager/analytics" },
];

function ManagerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={styles.layout}>
      <Sidebar navItems={navItems} role="manager" />

      <main style={styles.main}>
        <div style={styles.topbar}>
          <div>
            <h1 style={styles.pageTitle}>Manager Workspace</h1>
            <p style={styles.pageSubtitle}>Welcome back, {user?.name}</p>
          </div>
          <div style={styles.topbarRight}>
            <div style={styles.notifBtn}>
              <Bell size={18} color="#6b7a99" />
            </div>
            <div style={{ ...styles.avatar, background: "#0ea5e9" }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div style={styles.statsRow}>
          {[
            // { label: "Team Members", value: "8", color: "#0ea5e9" },
            { label: "Pending Approvals", value: "3", color: "#f59e0b" },
            { label: "Shared Goals", value: "5", color: "#1b4fff" },
            { label: "Check-ins Due", value: "2", color: "#ef4444" },
          ].map((s) => (
            <div key={s.label} style={styles.statCard}>
              <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <h2 style={styles.sectionTitle}>Quick Actions</h2>

        <div style={styles.grid}>
          {/* <DashboardCard
            title="Team Members"
            description="View employees mapped under your reporting hierarchy."
            icon={Users}
            path="/manager/team"
            color="#0ea5e9"
          /> */}
          <DashboardCard
            title="Goal Approvals"
            description="Review submitted goal sheets and approve or return them."
            icon={ClipboardList}
            path="/manager/approvals"
            color="#f59e0b"
          />
          <DashboardCard
            title="Shared Goals"
            description="Push departmental KPIs to multiple employees."
            icon={Share2}
            path="/manager/shared-goals"
            color="#1b4fff"
          />
          <DashboardCard
            title="Quarterly Check-ins"
            description="Add check-in comments and review planned vs actual progress."
            icon={MessageSquareText}
            path="/manager/checkins"
            color="#10b981"
          />
          {/* <DashboardCard
            title="Team Analytics"
            description="View team-wise goal completion and progress reports."
            icon={BarChart3}
            path="/manager/analytics"
            color="#8b5cf6"
          /> */}
        </div>
      </main>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    background: "#f4f7ff",
    fontFamily: "'Segoe UI', sans-serif",
  },
  main: { flex: 1, padding: "28px 32px", overflowY: "auto" },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
  },
  pageTitle: { fontSize: "22px", fontWeight: "700", color: "#0f1f5c", margin: 0 },
  pageSubtitle: { fontSize: "14px", color: "#6b7a99", margin: "2px 0 0" },
  topbarRight: { display: "flex", alignItems: "center", gap: "12px" },
  notifBtn: {
    width: "38px", height: "38px", borderRadius: "10px",
    border: "1.5px solid #e2e8f5", background: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  avatar: {
    width: "38px", height: "38px", borderRadius: "10px",
    color: "#fff", display: "flex", alignItems: "center",
    justifyContent: "center", fontWeight: "700", fontSize: "15px",
  },
  statsRow: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px", marginBottom: "28px",
  },
  statCard: {
    background: "#fff", border: "1.5px solid #e2e8f5",
    borderRadius: "12px", padding: "16px 20px",
  },
  statValue: { fontSize: "28px", fontWeight: "700", lineHeight: 1, marginBottom: "4px" },
  statLabel: { fontSize: "13px", color: "#6b7a99", fontWeight: "500" },
  sectionTitle: { fontSize: "16px", fontWeight: "700", color: "#0f1f5c", marginBottom: "16px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  },
};

export default ManagerDashboard;