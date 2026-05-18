import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell,
} from "recharts";
import {
  BarChart3, ClipboardList, Share2,
  MessageSquareText, RefreshCw, TrendingUp,
  Users, CheckCircle2, Clock,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { managerNavItems } from "../constants/managerNav.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const COLORS = ["#1b4fff", "#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

const axisStyle = {
  fontSize: 12,
  fill: "#9aaac8",
  fontFamily: "'Segoe UI', sans-serif",
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={T.tooltip}>
      {label && <div style={T.tooltipLabel}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color || p.fill }} />
          <span style={T.tooltipText}>{p.name}: <b>{p.value}</b></span>
        </div>
      ))}
    </div>
  );
}

function Skeleton({ w = "100%", h = 20, r = 8 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "linear-gradient(90deg,#eef2ff 25%,#f4f7ff 50%,#eef2ff 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    }} />
  );
}

function ManagerAnalytics() {
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const user  = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await axios.get(`${API_URL}/api/manager/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch {
      alert("Failed to load analytics");
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchData(); }, []);

  const statusData  = data?.statusDistribution  || [];
  const quarterData = data?.quarterWiseProgress || [];
  const memberData  = data?.memberProgress      || [];

  const summaryCards = [
    { label: "Team size",          value: data?.summary.teamSize,         color: "#0ea5e9", bg: "#e0f2fe", icon: Users },
    { label: "Total goals",        value: data?.summary.totalGoals,       color: "#1b4fff", bg: "#eef2ff", icon: BarChart3 },
    { label: "Completed",          value: data?.summary.completed,        color: "#10b981", bg: "#d1fae5", icon: CheckCircle2 },
    { label: "Pending approvals",  value: data?.summary.pendingApprovals, color: "#f59e0b", bg: "#fef3c7", icon: Clock },
    { label: "Avg progress",       value: data ? `${data.summary.avgProgress}%` : null, color: "#8b5cf6", bg: "#ede9fe", icon: TrendingUp },
  ];

  return (
    <div style={S.layout}>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      <Sidebar navItems={managerNavItems} role="manager" />

      <main style={S.main}>
        {/* Topbar */}
        <div style={S.topbar}>
          <div>
            <h1 style={S.pageTitle}>Team Analytics</h1>
            <p style={S.pageSubtitle}>Progress and performance overview for your team</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              style={S.refreshBtn}
            >
              <RefreshCw size={15} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <div style={{ ...S.avatar, background: "#0ea5e9" }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={S.statsGrid}>
          {summaryCards.map((s) => (
            <div key={s.label} style={S.statCard}>
              <div style={{ ...S.statIcon, background: s.bg }}>
                <s.icon size={18} color={s.color} />
              </div>
              {loading
                ? <Skeleton w="50%" h={28} />
                : <div style={{ ...S.statValue, color: s.color }}>{s.value ?? "—"}</div>
              }
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div style={S.chartsGrid}>
          {/* Pie: goal status */}
          <div style={S.chartCard}>
            <div style={S.chartHeader}>
              <div style={S.chartTitle}>Goal status breakdown</div>
              <div style={S.chartBadge}>{statusData.length} statuses</div>
            </div>
            {loading ? <Skeleton w="100%" h={260} r={10} /> : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    outerRadius={100} innerRadius={50}
                    labelLine={false}
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
            {!loading && (
              <div style={S.pieLegend}>
                {statusData.map((e, i) => (
                  <div key={i} style={S.legendItem}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: COLORS[i % COLORS.length] }} />
                    <span style={S.legendText}>{e.name}</span>
                    <span style={S.legendValue}>{e.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Line: quarter progress */}
          <div style={{ ...S.chartCard, gridColumn: "span 2" }}>
            <div style={S.chartHeader}>
              <div style={S.chartTitle}>Quarter-wise average progress</div>
              <div style={S.chartBadge}>{quarterData.length} quarters</div>
            </div>
            {loading ? <Skeleton w="100%" h={260} r={10} /> : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={quarterData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
                  <XAxis dataKey="quarter" tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone" dataKey="avgScore"
                    stroke="#0ea5e9" strokeWidth={2.5}
                    dot={{ fill: "#0ea5e9", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#0ea5e9", stroke: "#e0f2fe", strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Charts row 2 */}
        <div style={S.chartsGrid}>
          {/* Bar: member progress */}
          <div style={{ ...S.chartCard, gridColumn: "span 3" }}>
            <div style={S.chartHeader}>
              <div style={S.chartTitle}>Progress by team member</div>
              <div style={S.chartBadge}>{memberData.length} members</div>
            </div>
            {loading ? <Skeleton w="100%" h={260} r={10} /> :
              memberData.length === 0 ? (
                <div style={S.emptyChart}>
                  <BarChart3 size={32} color="#c7d2fe" />
                  <p style={{ color: "#9aaac8", marginTop: "10px", fontSize: "13px" }}>No check-in data yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={memberData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" vertical={false} />
                    <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#eef2ff" }} />
                    <Bar dataKey="avgScore" radius={[6, 6, 0, 0]} maxBarSize={56}>
                      {memberData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )
            }
          </div>
        </div>
      </main>
    </div>
  );
}

const S = {
  layout: { display: "flex", minHeight: "100vh", background: "#f4f7ff", fontFamily: "'Segoe UI', sans-serif" },
  main: { flex: 1, padding: "28px 32px", overflowY: "auto" },
  topbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  pageTitle: { fontSize: "22px", fontWeight: "700", color: "#0f1f5c", margin: 0 },
  pageSubtitle: { fontSize: "14px", color: "#6b7a99", margin: "2px 0 0" },
  refreshBtn: {
    display: "flex", alignItems: "center", gap: "7px",
    padding: "8px 16px", border: "1.5px solid #e2e8f5", borderRadius: "10px",
    background: "#fff", color: "#3d4f7c", fontSize: "13px", fontWeight: "600",
    cursor: "pointer", fontFamily: "'Segoe UI', sans-serif",
  },
  avatar: {
    width: "38px", height: "38px", borderRadius: "10px", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "700", fontSize: "15px",
  },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "24px" },
  statCard: { background: "#fff", border: "1.5px solid #e2e8f5", borderRadius: "14px", padding: "18px 20px" },
  statIcon: { width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" },
  statValue: { fontSize: "26px", fontWeight: "700", lineHeight: 1, marginBottom: "4px" },
  statLabel: { fontSize: "12px", fontWeight: "600", color: "#9aaac8", textTransform: "uppercase", letterSpacing: "0.4px" },
  chartsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "20px" },
  chartCard: { background: "#fff", border: "1.5px solid #e2e8f5", borderRadius: "16px", padding: "20px 22px" },
  chartHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  chartTitle: { fontSize: "15px", fontWeight: "700", color: "#0f1f5c" },
  chartBadge: { fontSize: "11px", fontWeight: "700", color: "#0ea5e9", background: "#e0f2fe", padding: "3px 10px", borderRadius: "20px" },
  emptyChart: { height: "260px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  pieLegend: { display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" },
  legendItem: { display: "flex", alignItems: "center", gap: "8px" },
  legendText: { flex: 1, fontSize: "12px", color: "#6b7a99" },
  legendValue: { fontSize: "12px", fontWeight: "700", color: "#0f1f5c" },
};

const T = {
  tooltip: { background: "#fff", border: "1.5px solid #e2e8f5", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", fontFamily: "'Segoe UI', sans-serif", boxShadow: "0 4px 16px rgba(27,79,255,0.08)" },
  tooltipLabel: { fontSize: "12px", fontWeight: "700", color: "#3d4f7c", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" },
  tooltipText: { fontSize: "13px", color: "#0f1f5c" },
};

export default ManagerAnalytics;