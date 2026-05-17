import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Target } from "lucide-react";

function Sidebar({ navItems, role }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const roleColors = {
    employee: "#1b4fff",
    manager: "#0ea5e9",
    admin: "#8b5cf6",
  };

  const color = roleColors[role] || "#1b4fff";

  return (
    <aside style={{ ...styles.sidebar, borderRightColor: color + "22" }}>
      {/* Brand */}
      <div style={styles.brand}>
        <div style={{ ...styles.brandLogo, background: color }}>
          <Target size={18} color="#fff" />
        </div>
        <span style={styles.brandName}>
          Perform<span style={{ color }}>task</span>
        </span>
      </div>

      {/* Role Badge */}
      <div style={{ ...styles.roleBadge, background: color + "15", color }}>
        {role?.charAt(0).toUpperCase() + role?.slice(1)}
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.navItem,
                ...(isActive
                  ? { ...styles.navItemActive, background: color + "15", color }
                  : {}),
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#f0f4ff";
                  e.currentTarget.style.color = color;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#4a5568";
                }
              }}
            >
              <item.icon size={18} style={{ flexShrink: 0 }} />
              <span>{item.label}</span>
              {isActive && (
                <div style={{ ...styles.activeBar, background: color }} />
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={styles.logoutWrap}>
        <div
          onClick={handleLogout}
          style={styles.logoutBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fee2e2";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#6b7a99";
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "230px",
    minHeight: "100vh",
    background: "#fff",
    borderRight: "1.5px solid #e2e8f5",
    display: "flex",
    flexDirection: "column",
    padding: "20px 12px",
    flexShrink: 0,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    padding: "0 8px",
  },
  brandLogo: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#0f1f5c",
    fontFamily: "'Segoe UI', sans-serif",
  },
  roleBadge: {
    fontSize: "11px",
    fontWeight: "700",
    padding: "4px 12px",
    borderRadius: "20px",
    marginBottom: "20px",
    marginLeft: "8px",
    display: "inline-block",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#4a5568",
    transition: "all 0.15s",
    position: "relative",
    fontFamily: "'Segoe UI', sans-serif",
  },
  navItemActive: {
    fontWeight: "700",
  },
  activeBar: {
    position: "absolute",
    right: "-12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "3px",
    height: "20px",
    borderRadius: "2px 0 0 2px",
  },
  logoutWrap: {
    borderTop: "1px solid #e2e8f5",
    paddingTop: "12px",
    marginTop: "12px",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#6b7a99",
    transition: "all 0.15s",
    fontFamily: "'Segoe UI', sans-serif",
  },
};

export default Sidebar;