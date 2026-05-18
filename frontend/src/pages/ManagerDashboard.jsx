import { useEffect, useState } from "react";
import axios from "axios";
import {
  ClipboardList, Share2, MessageSquareText,
  BarChart3, Bell, Users,
} from "lucide-react";
import DashboardCard from "../components/DashboardCard";
import Sidebar from "../components/Sidebar";
import { managerNavItems } from "../constants/managerNav.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ManagerDashboard() {
  const user  = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/manager/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSummary(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Team members",      value: summary?.teamSize,         color: "#0ea5e9" },
    { label: "Pending approvals", value: summary?.pendingApprovals, color: "#f59e0b" },
    { label: "Shared goals",      value: summary?.sharedGoals,      color: "#1b4fff" },
    { label: "Check-ins due",     value: summary?.checkinsDue,      color: "#ef4444" },
  ];

  return (
    <div style={S.layout}>
      <Sidebar navItems={managerNavItems} role="manager" />

      <main style={S.main}>
        {/* Topbar */}
        <div style={S.topbar}>
          <div>
            <h1 style={S.pageTitle}>Manager Workspace</h1>
            <p style={S.pageSubtitle}>Welcome back, {user?.name}</p>
          </div>
          <div style={S.topbarRight}>
            <div style={S.notifBtn}>
              <Bell size={18} color="#6b7a99" />
            </div>
            <div style={{ ...S.avatar, background: "#0ea5e9" }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={S.statsRow}>
          {statCards.map((s) => (
            <div key={s.label} style={S.statCard}>
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
          <DashboardCard
            title="Team Analytics"
            description="View progress trends and review completion insights."
            icon={BarChart3}
            path="/manager/analytics"
            color="#8b5cf6"
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
  layout: { display: "flex", minHeight: "100vh", background: "#f4f7ff", fontFamily: "'Segoe UI', sans-serif" },
  main: { flex: 1, padding: "28px 32px", overflowY: "auto" },
  topbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
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
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" },
  statCard: { background: "#fff", border: "1.5px solid #e2e8f5", borderRadius: "12px", padding: "16px 20px" },
  statValue: { fontSize: "28px", fontWeight: "700", lineHeight: 1, marginBottom: "4px" },
  statLabel: { fontSize: "13px", color: "#6b7a99", fontWeight: "500" },
  skeleton: {
    height: "28px", width: "50%", borderRadius: "6px", marginBottom: "4px",
    background: "linear-gradient(90deg,#eef2ff 25%,#f4f7ff 50%,#eef2ff 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
  },
  sectionTitle: { fontSize: "16px", fontWeight: "700", color: "#0f1f5c", marginBottom: "16px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" },
};

export default ManagerDashboard;