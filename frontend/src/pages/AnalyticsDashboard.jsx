import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, ResponsiveContainer, Legend,
} from "recharts";
import {
  FileSpreadsheet, BarChart3, History, Unlock,
  Bell, Users, TrendingUp, Target, ClipboardCheck,
  RefreshCw, ArrowUpRight,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const navItems = [
  { label: "Dashboard",       icon: BarChart3,       path: "/admin-dashboard" },
  { label: "Reports",         icon: FileSpreadsheet, path: "/admin/reports" },
  { label: "Completion",      icon: BarChart3,       path: "/admin/completion" },
  { label: "Audit Logs",      icon: History,         path: "/admin/audit-logs" },
  { label: "Goal Sheet Mgmt", icon: Unlock,          path: "/admin/goal-sheets" },
  { label: "Analytics",       icon: BarChart3,       path: "/admin/analytics" }
];

// ── Color palette ────────────────────────────────────────────────────────────
const COLORS = ["#1b4fff", "#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

const STATUS_COLORS = {
  draft:     "#9aaac8",
  submitted: "#f59e0b",
  approved:  "#10b981",
  rework:    "#ef4444",
};

// ── Custom tooltip ────────────────────────────────────────────────────────────
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

// ── Custom pie label ──────────────────────────────────────────────────────────
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: "11px", fontWeight: "700", fontFamily: "'Segoe UI', sans-serif" }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function Skeleton({ w = "100%", h = 20, r = 8 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "linear-gradient(90deg, #eef2ff 25%, #f4f7ff 50%, #eef2ff 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    }} />
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user"));
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchAnalytics = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await axios.get(`${API_URL}/api/analytics/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch {
      alert("Failed to load analytics");
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchAnalytics(); }, []);

  const quarterData = data?.quarterWiseProgress.map((item) => ({
    quarter: item.quarter,
    "Avg score": Number(item.averageScore).toFixed(1),
  })) || [];

  const uomData = data?.uomDistribution.map((item) => ({
    name: item.uomType,
    count: Number(item.count),
  })) || [];

  const statusData = data?.goalStatusDistribution || [];

  const managerData = data?.managerReviews.map((m) => ({
    name: `M-${m.managerId}`,
    Reviews: m.totalReviews,
  })) || [];

  const summaryCards = data ? [
    { label: "Total employees",    value: data.summary.totalEmployees,  icon: Users,         color: "#1b4fff", bg: "#eef2ff" },
    { label: "Total managers",     value: data.summary.totalManagers,   icon: Users,         color: "#0ea5e9", bg: "#e0f2fe" },
    { label: "Total goals",        value: data.summary.totalGoals,      icon: Target,        color: "#10b981", bg: "#d1fae5" },
    { label: "Total check-ins",    value: data.summary.totalCheckins,   icon: ClipboardCheck,color: "#f59e0b", bg: "#fef3c7" },
    { label: "Average progress",   value: `${data.summary.averageProgress}%`, icon: TrendingUp, color: "#8b5cf6", bg: "#ede9fe" },
  ] : [];

  return (
    <div style={S.layout}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <Sidebar navItems={navItems} role="admin" />

      <main style={S.main}>

        {/* Topbar */}
        <div style={S.topbar}>
          <div>
            <h1 style={S.pageTitle}>Analytics Dashboard</h1>
            <p style={S.pageSubtitle}>Organisation-wide goal and performance overview</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => fetchAnalytics(true)}
              disabled={refreshing}
              style={S.refreshBtn}
            >
              <RefreshCw size={15} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <div style={{ ...S.avatar, background: "#8b5cf6" }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* ── Summary stat cards ────────────────────────────────── */}
        <div style={S.statsGrid}>
          {loading
            ? Array(5).fill(0).map((_, i) => (
                <div key={i} style={S.statCard}>
                  <Skeleton w={40} h={40} r={10} />
                  <div style={{ marginTop: "12px" }}>
                    <Skeleton w="60%" h={14} />
                    <div style={{ marginTop: "6px" }}><Skeleton w="40%" h={28} /></div>
                  </div>
                </div>
              ))
            : summaryCards.map((s) => (
                <div key={s.label} style={S.statCard}>
                  <div style={{ ...S.statIcon, background: s.bg }}>
                    <s.icon size={20} color={s.color} />
                  </div>
                  <div style={S.statLabel}>{s.label}</div>
                  <div style={{ ...S.statValue, color: s.color }}>{s.value}</div>
                </div>
              ))
          }
        </div>

        {/* ── Charts row 1 ─────────────────────────────────────── */}
        <div style={S.chartsGrid}>

          {/* Pie: goal status */}
          <div style={S.chartCard}>
            <div style={S.chartHeader}>
              <div style={S.chartTitle}>Goal status distribution</div>
              <div style={S.chartBadge}>{statusData.length} statuses</div>
            </div>
            {loading
              ? <Skeleton w="100%" h={260} r={10} />
              : (
                <>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={50}
                        labelLine={false}
                        label={<PieLabel />}
                      >
                        {statusData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={STATUS_COLORS[entry.name?.toLowerCase()] || COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Legend */}
                  <div style={S.pieLegend}>
                    {statusData.map((entry, i) => (
                      <div key={i} style={S.legendItem}>
                        <div style={{
                          width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                          background: STATUS_COLORS[entry.name?.toLowerCase()] || COLORS[i % COLORS.length],
                        }} />
                        <span style={S.legendText}>{entry.name}</span>
                        <span style={S.legendValue}>{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )
            }
          </div>

          {/* Line: quarter-wise progress */}
          <div style={{ ...S.chartCard, gridColumn: "span 2" }}>
            <div style={S.chartHeader}>
              <div style={S.chartTitle}>Quarter-wise average progress</div>
              <div style={S.chartBadge}>{quarterData.length} quarters</div>
            </div>
            {loading
              ? <Skeleton w="100%" h={260} r={10} />
              : (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={quarterData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" />
                    <XAxis dataKey="quarter" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="Avg score"
                      stroke="#1b4fff"
                      strokeWidth={2.5}
                      dot={{ fill: "#1b4fff", r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#1b4fff", stroke: "#eef2ff", strokeWidth: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )
            }
          </div>
        </div>

        {/* ── Charts row 2 ─────────────────────────────────────── */}
        <div style={S.chartsGrid}>

          {/* Bar: UoM distribution */}
          <div style={{ ...S.chartCard, gridColumn: "span 2" }}>
            <div style={S.chartHeader}>
              <div style={S.chartTitle}>Unit of measurement distribution</div>
              <div style={S.chartBadge}>{uomData.length} types</div>
            </div>
            {loading
              ? <Skeleton w="100%" h={260} r={10} />
              : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={uomData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" vertical={false} />
                    <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#eef2ff" }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={56}>
                      {uomData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )
            }
          </div>

          {/* Bar: manager reviews */}
          <div style={S.chartCard}>
            <div style={S.chartHeader}>
              <div style={S.chartTitle}>Manager review effectiveness</div>
              <div style={S.chartBadge}>{managerData.length} managers</div>
            </div>
            {loading
              ? <Skeleton w="100%" h={260} r={10} />
              : managerData.length === 0
                ? (
                  <div style={S.emptyChart}>
                    <BarChart3 size={32} color="#c7d2fe" />
                    <p style={{ color: "#9aaac8", marginTop: "10px", fontSize: "13px" }}>No review data yet</p>
                  </div>
                )
                : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={managerData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" vertical={false} />
                      <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                      <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "#eef2ff" }} />
                      <Bar dataKey="Reviews" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={48} />
                    </BarChart>
                  </ResponsiveContainer>
                )
            }
          </div>

        </div>
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ── Shared axis tick style ────────────────────────────────────────────────────
const axisStyle = {
  fontSize: 12,
  fill: "#9aaac8",
  fontFamily: "'Segoe UI', sans-serif",
};

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
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

  // Topbar
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
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
  refreshBtn: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "8px 16px",
    border: "1.5px solid #e2e8f5",
    borderRadius: "10px",
    background: "#fff",
    color: "#3d4f7c",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "15px",
  },

  // Summary stats
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    background: "#fff",
    border: "1.5px solid #e2e8f5",
    borderRadius: "14px",
    padding: "18px 20px",
  },
  statIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
  },
  statLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#9aaac8",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    marginBottom: "4px",
  },
  statValue: {
    fontSize: "26px",
    fontWeight: "700",
    lineHeight: 1,
  },

  // Charts
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "20px",
  },
  chartCard: {
    background: "#fff",
    border: "1.5px solid #e2e8f5",
    borderRadius: "16px",
    padding: "20px 22px",
  },
  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  chartTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f1f5c",
  },
  chartBadge: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#8b5cf6",
    background: "#ede9fe",
    padding: "3px 10px",
    borderRadius: "20px",
  },
  emptyChart: {
    height: "260px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  // Pie legend
  pieLegend: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginTop: "8px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  legendText: {
    flex: 1,
    fontSize: "12px",
    color: "#6b7a99",
    textTransform: "capitalize",
  },
  legendValue: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#0f1f5c",
  },
};

const T = {
  tooltip: {
    background: "#fff",
    border: "1.5px solid #e2e8f5",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "13px",
    fontFamily: "'Segoe UI', sans-serif",
    boxShadow: "0 4px 16px rgba(27,79,255,0.08)",
  },
  tooltipLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#3d4f7c",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  tooltipText: {
    fontSize: "13px",
    color: "#0f1f5c",
  },
};

export default AnalyticsDashboard;