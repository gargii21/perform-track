// AdminLayout.jsx — shared layout shell for all Admin pages
// Mirrors the EmployeeGoals design system (blue/white, Segoe UI, card-based)

import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart3,
  FileText,
  ClipboardList,
  ScrollText,
  CheckSquare,
  Target,
  LogOut,
  FileSpreadsheet,
  Unlock,
  History,
  Users,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",       icon: BarChart3,       path: "/admin-dashboard" },
  { label: "Reports",         icon: FileSpreadsheet, path: "/admin/reports" },
  { label: "Completion",      icon: BarChart3,       path: "/admin/completion" },
  { label: "Audit Logs",      icon: History,         path: "/admin/audit-logs" },
  { label: "Goal Sheet Mgmt", icon: Unlock,          path: "/admin/goal-sheets" },
  { label: "Analytics",       icon: BarChart3,       path: "/admin/analytics" }
];

export function AdminSidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const color     = "#8b5cf6";

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  return (
    <aside style={SS.sidebar}>
      {/* Brand */}
      <div style={SS.brand}>
        <div style={{ ...SS.brandLogo, background: color }}>
          <Target size={18} color="#fff" />
        </div>
        <span style={SS.brandName}>
          Perform<span style={{ color }}>track</span>
        </span>
      </div>

      {/* Role badge */}
      <div style={{ ...SS.roleBadge, background: color + "18", color }}>Admin</div>

      {/* Nav */}
      <nav style={SS.nav}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                ...SS.navItem,
                ...(active ? { ...SS.navItemActive, background: color + "15", color } : {}),
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "#f5f0ff"; e.currentTarget.style.color = color; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4a5568"; } }}
            >
              <item.icon size={18} style={{ flexShrink: 0 }} />
              <span>{item.label}</span>
              {active && <div style={{ ...SS.activeBar, background: color }} />}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={SS.logoutWrap}>
        <div
          onClick={handleLogout}
          style={SS.logoutBtn}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#ef4444"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7a99"; }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
}

/** Full-page shell: sidebar + scrollable main */
export function AdminLayout({ title, subtitle, topbarRight, children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div style={SS.layout}>
      <AdminSidebar />
      <main style={SS.main}>
        {/* Topbar */}
        <div style={SS.topbar}>
          <div>
            <h1 style={SS.pageTitle}>{title}</h1>
            {subtitle && <p style={SS.pageSubtitle}>{subtitle}</p>}
          </div>
          <div style={SS.topbarRight}>
            {topbarRight}
            <div style={SS.avatar}>{user?.name?.charAt(0)?.toUpperCase() ?? "A"}</div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

/** Reusable styled data table */
export function StyledTable({ columns, rows, emptyText = "No data available." }) {
  return (
    <div style={SS.tableWrap}>
      {rows.length === 0 ? (
        <div style={SS.empty}>{emptyText}</div>
      ) : (
        <table style={SS.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key ?? col.label} style={SS.th}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                style={SS.tr}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f4f7ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = ri % 2 === 0 ? "#fff" : "#fafbff")}
              >
                {columns.map((col) => (
                  <td key={col.key ?? col.label} style={{ ...SS.td, ...(col.style ?? {}) }}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/** Small pill badge */
export function StatusBadge({ value, map }) {
  const cfg = map?.[value] ?? { bg: "#e2e8f5", color: "#6b7a99" };
  return (
    <span style={{ ...SS.badge, background: cfg.bg, color: cfg.color }}>
      {cfg.label ?? value}
    </span>
  );
}

/** Generic page card */
export function Card({ children, style }) {
  return <div style={{ ...SS.card, ...style }}>{children}</div>;
}

/** Toolbar row for filters + action buttons */
export function Toolbar({ children }) {
  return <div style={SS.toolbar}>{children}</div>;
}

/** Styled select */
export function Select({ value, onChange, options, style }) {
  return (
    <div style={{ position: "relative", ...style }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={SS.select}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

/** Primary action button */
export function PrimaryBtn({ onClick, children, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...SS.primaryBtn, opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
    >
      {children}
    </button>
  );
}

/** Ghost / outline button */
export function GhostBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={SS.ghostBtn}>
      {children}
    </button>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const SS = {
  layout:      { display: "flex", minHeight: "100vh", background: "#f4f7ff", fontFamily: "'Segoe UI', sans-serif" },
  main:        { flex: 1, padding: "28px 32px", overflowY: "auto" },
  topbar:      { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  pageTitle:   { fontSize: "22px", fontWeight: "700", color: "#0f1f5c", margin: 0 },
  pageSubtitle:{ fontSize: "14px", color: "#6b7a99", margin: "2px 0 0" },
  topbarRight: { display: "flex", gap: "12px", alignItems: "center" },
  avatar:      { width: "38px", height: "38px", borderRadius: "10px", background: "#8b5cf6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "15px" },

  sidebar:     { width: "230px", minHeight: "100vh", background: "#fff", borderRight: "1.5px solid #e2e8f5", display: "flex", flexDirection: "column", padding: "20px 12px", flexShrink: 0 },
  brand:       { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", padding: "0 8px" },
  brandLogo:   { width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" },
  brandName:   { fontSize: "17px", fontWeight: "700", color: "#0f1f5c" },
  roleBadge:   { fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "20px", marginBottom: "20px", marginLeft: "8px", display: "inline-block", letterSpacing: "0.5px", textTransform: "uppercase" },
  nav:         { display: "flex", flexDirection: "column", gap: "2px", flex: 1 },
  navItem:     { display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#4a5568", transition: "all 0.15s", position: "relative" },
  navItemActive:{ fontWeight: "700" },
  activeBar:   { position: "absolute", right: "-12px", top: "50%", transform: "translateY(-50%)", width: "3px", height: "20px", borderRadius: "2px 0 0 2px" },
  logoutWrap:  { borderTop: "1px solid #e2e8f5", paddingTop: "12px", marginTop: "12px" },
  logoutBtn:   { display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#6b7a99", transition: "all 0.15s" },

  card:        { background: "#fff", border: "1.5px solid #e2e8f5", borderRadius: "14px", padding: "20px 24px", marginBottom: "20px" },
  toolbar:     { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "20px" },

  tableWrap:   { background: "#fff", border: "1.5px solid #e2e8f5", borderRadius: "14px", overflow: "hidden" },
  table:       { width: "100%", borderCollapse: "collapse" },
  th:          { padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#3d4f7c", textTransform: "uppercase", letterSpacing: "0.5px", background: "#f4f7ff", borderBottom: "1.5px solid #e2e8f5" },
  tr:          { transition: "background 0.1s" },
  td:          { padding: "13px 16px", fontSize: "13.5px", color: "#0f1f5c", borderBottom: "1px solid #f0f4ff", verticalAlign: "middle" },
  empty:       { padding: "48px", textAlign: "center", color: "#9aaac8", fontSize: "14px" },

  badge:       { display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },

  select:      { padding: "9px 36px 9px 14px", border: "1.5px solid #e2e8f5", borderRadius: "10px", fontSize: "14px", color: "#0f1f5c", background: "#fff", outline: "none", appearance: "none", fontFamily: "'Segoe UI', sans-serif", cursor: "pointer", minWidth: "120px" },
  primaryBtn:  { display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", border: "none", borderRadius: "10px", background: "#8b5cf6", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" },
  ghostBtn:    { display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", border: "1.5px solid #8b5cf6", borderRadius: "10px", background: "#fff", color: "#8b5cf6", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" },
};
