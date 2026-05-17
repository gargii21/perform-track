import {
  FileSpreadsheet,
  BarChart3,
  History,
  Unlock,
  Bell,
  Users,
  ShieldCheck,
} from "lucide-react";
import DashboardCard from "../components/DashboardCard";
import Sidebar from "../components/Sidebar";

const navItems = [
  { label: "Dashboard", icon: BarChart3, path: "/admin-dashboard" },
  { label: "Reports", icon: FileSpreadsheet, path: "/admin/reports" },
  { label: "Completion", icon: BarChart3, path: "/admin/completion" },
  { label: "Audit Logs", icon: History, path: "/admin/audit-logs" },
  { label: "Goal Sheet Mgmt", icon: Unlock, path: "/admin/goal-sheets" },
  { label: "Users", icon: Users, path: "/admin/users" },
];

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={styles.layout}>
      <Sidebar navItems={navItems} role="admin" />

      <main style={styles.main}>
        <div style={styles.topbar}>
          <div>
            <h1 style={styles.pageTitle}>Admin / HR Dashboard</h1>
            <p style={styles.pageSubtitle}>Welcome back, {user?.name}</p>
          </div>
          <div style={styles.topbarRight}>
            <div style={styles.notifBtn}>
              <Bell size={18} color="#6b7a99" />
            </div>
            <div style={{ ...styles.avatar, background: "#8b5cf6" }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div style={styles.statsRow}>
          {[
            { label: "Total Employees", value: "42", color: "#8b5cf6" },
            { label: "Pending Sheets", value: "7", color: "#f59e0b" },
            { label: "Locked Sheets", value: "3", color: "#ef4444" },
            { label: "Completed Q1", value: "28", color: "#10b981" },
          ].map((s) => (
            <div key={s.label} style={styles.statCard}>
              <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <h2 style={styles.sectionTitle}>Quick Actions</h2>

        <div style={styles.grid}>
          <DashboardCard
            title="Reports"
            description="View planned vs actual achievement reports and export Excel."
            icon={FileSpreadsheet}
            path="/admin/reports"
            color="#8b5cf6"
          />
          <DashboardCard
            title="Completion Dashboard"
            description="Track employee and manager quarterly completion."
            icon={BarChart3}
            path="/admin/completion"
            color="#10b981"
          />
          <DashboardCard
            title="Audit Logs"
            description="View all goal changes, approvals, and admin interventions."
            icon={History}
            path="/admin/audit-logs"
            color="#0ea5e9"
          />
          <DashboardCard
            title="Goal Sheet Management"
            description="Unlock approved goal sheets with reason tracking."
            icon={Unlock}
            path="/admin/goal-sheets"
            color="#f59e0b"
          />
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

export default AdminDashboard;