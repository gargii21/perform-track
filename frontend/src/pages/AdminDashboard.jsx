import { useEffect, useState } from "react";
import axios from "axios";
import {
  FileSpreadsheet, BarChart3, History, Unlock,
  Bell, Users, TrendingUp, ClipboardCheck,
} from "lucide-react";
import DashboardCard from "../components/DashboardCard";
import Sidebar from "../components/Sidebar";

const navItems = [
  { label: "Dashboard",       icon: BarChart3,       path: "/admin-dashboard" },
  { label: "Reports",         icon: FileSpreadsheet, path: "/admin/reports" },
  { label: "Completion",      icon: BarChart3,       path: "/admin/completion" },
  { label: "Audit Logs",      icon: History,         path: "/admin/audit-logs" },
  { label: "Goal Sheet Mgmt", icon: Unlock,          path: "/admin/goal-sheets" },
  { label: "Analytics",       icon: BarChart3,       path: "/admin/analytics" }
];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminDashboard() {
  const user  = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/analytics/admin/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSummary(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Total employees",
      value: summary?.totalEmployees,
      color: "#8b5cf6",
      icon: Users,
      bg: "#ede9fe",
    },
    {
      label: "Total managers",
      value: summary?.totalManagers,
      color: "#0ea5e9",
      icon: Users,
      bg: "#e0f2fe",
    },
    {
      label: "Pending sheets",
      value: summary?.pendingSheets,
      color: "#f59e0b",
      icon: ClipboardCheck,
      bg: "#fef3c7",
    },
    {
      label: "Sheets in rework",
      value: summary?.lockedSheets,
      color: "#ef4444",
      icon: Unlock,
      bg: "#fee2e2",
    },
    {
      label: "Q1 completions",
      value: summary?.completedQ1,
      color: "#10b981",
      icon: TrendingUp,
      bg: "#d1fae5",
    },
  ];

  return (
    <div style={S.layout}>
      <Sidebar navItems={navItems} role="admin" />

      <main style={S.main}>
        {/* Topbar */}
        <div style={S.topbar}>
          <div>
            <h1 style={S.pageTitle}>Admin / HR Dashboard</h1>
            <p style={S.pageSubtitle}>Welcome back, {user?.name}</p>
          </div>
          <div style={S.topbarRight}>
            <div style={S.notifBtn}>
              <Bell size={18} color="#6b7a99" />
            </div>
            <div style={{ ...S.avatar, background: "#8b5cf6" }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={S.statsRow}>
          {statCards.map((s) => (
            <div key={s.label} style={S.statCard}>
              <div style={{ ...S.statIcon, background: s.bg }}>
                <s.icon size={18} color={s.color} />
              </div>
              {loading ? (
                <div style={S.skeleton} />
              ) : (
                <div style={{ ...S.statValue, color: s.color }}>
                  {s.value ?? "—"}
                </div>
              )}
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <h2 style={S.sectionTitle}>Quick actions</h2>

        <div style={S.grid}>
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
          <DashboardCard
            title="Analytics"
            description="View trends, goal distribution, completion status, and manager effectiveness."
            icon={BarChart3}
            path="/admin/analytics"
            color="#1b4fff"
          />
        </div>
      </main>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

const S = {
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
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "16px",
    marginBottom: "28px",
  },
  statCard: {
    background: "#fff",
    border: "1.5px solid #e2e8f5",
    borderRadius: "14px",
    padding: "16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  statIcon: {
    width: "36px", height: "36px",
    borderRadius: "9px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: "12px",
    color: "#9aaac8",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  skeleton: {
    height: "28px",
    width: "60%",
    borderRadius: "6px",
    background: "linear-gradient(90deg,#eef2ff 25%,#f4f7ff 50%,#eef2ff 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
  },

  sectionTitle: {
    fontSize: "16px", fontWeight: "700", color: "#0f1f5c", marginBottom: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  },
};

export default AdminDashboard;