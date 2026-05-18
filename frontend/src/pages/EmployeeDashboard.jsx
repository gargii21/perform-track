import {
  Target,
  ClipboardCheck,
  BarChart3,
  UserCircle,
  Bell,
} from "lucide-react";
import DashboardCard from "../components/DashboardCard";
import Sidebar from "../components/Sidebar";

const navItems = [
  { label: "Dashboard", icon: BarChart3, path: "/employee-dashboard" },
  { label: "My Goal Sheet", icon: Target, path: "/employee/goals" },
  { label: "Quarterly Check-ins", icon: ClipboardCheck, path: "/employee/checkins" },
  { label: "My Progress", icon: BarChart3, path: "/employee/progress" },
  { label: "My Profile", icon: UserCircle, path: "/employee/profile" },
];

function EmployeeDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={styles.layout}>
      <Sidebar navItems={navItems} role="employee" />

      <main style={styles.main}>
        {/* Top bar */}
        <div style={styles.topbar}>
          <div>
            <h1 style={styles.pageTitle}>Dashboard</h1>
            <p style={styles.pageSubtitle}>Welcome back, {user?.name} 👋</p>
          </div>
          <div style={styles.topbarRight}>
            <div style={styles.notifBtn}>
              <Bell size={18} color="#6b7a99" />
            </div>
            <div style={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow}>
          {[
            { label: "Goals Set", value: "4", color: "#1b4fff" },
            { label: "In Progress", value: "2", color: "#0ea5e9" },
            { label: "Completed", value: "1", color: "#10b981" },
            { label: "Pending Review", value: "1", color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} style={styles.statCard}>
              <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Section heading */}
        <h2 style={styles.sectionTitle}>Quick Actions</h2>

        {/* Cards */}
        <div style={styles.grid}>
          <DashboardCard
            title="My Goal Sheet"
            description="Create, submit, and view your employee goal sheet."
            icon={Target}
            path="/employee/goals"
            color="#1b4fff"
          />
          <DashboardCard
            title="Quarterly Check-ins"
            description="Update actual achievement and goal progress every quarter."
            icon={ClipboardCheck}
            path="/employee/checkins"
            color="#0ea5e9"
          />
          {/* <DashboardCard
            title="My Progress"
            description="View your goal completion status and progress summary."
            icon={BarChart3}
            path="/employee/progress"
            color="#10b981"
          />
          <DashboardCard
            title="My Profile"
            description="View your role, manager, and basic employee details."
            icon={UserCircle}
            path="/employee/profile"
            color="#f59e0b"
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
  main: {
    flex: 1,
    padding: "28px 32px",
    overflowY: "auto",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
  },
  pageTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f1f5c",
    margin: 0,
  },
  pageSubtitle: {
    fontSize: "14px",
    color: "#6b7a99",
    margin: "2px 0 0",
  },
  topbarRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  notifBtn: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f5",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "#1b4fff",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "15px",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "28px",
  },
  statCard: {
    background: "#fff",
    border: "1.5px solid #e2e8f5",
    borderRadius: "12px",
    padding: "16px 20px",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    lineHeight: 1,
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "13px",
    color: "#6b7a99",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f1f5c",
    marginBottom: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  },
};

export default EmployeeDashboard;