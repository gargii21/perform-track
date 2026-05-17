import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DashboardCard({ title, description, icon: Icon, path, count, color = "#1b4fff" }) {
  const navigate = useNavigate();

  const bgMap = {
    "#1b4fff": "#eef2ff",
    "#0ea5e9": "#e0f2fe",
    "#10b981": "#d1fae5",
    "#f59e0b": "#fef3c7",
    "#ef4444": "#fee2e2",
    "#8b5cf6": "#ede9fe",
  };

  const lightBg = bgMap[color] || "#eef2ff";

  return (
    <div
      onClick={() => navigate(path)}
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(27,79,255,0.13)";
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
        e.currentTarget.style.borderColor = "#e2e8f5";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ ...styles.iconWrap, background: lightBg }}>
        <Icon size={22} color={color} />
      </div>

      <div style={styles.cardBody}>
        <h3 style={styles.cardTitle}>{title}</h3>
        <p style={styles.cardDesc}>{description}</p>
        {count !== undefined && (
          <div style={{ ...styles.countBadge, background: lightBg, color }}>
            {count} items
          </div>
        )}
      </div>

      <div style={{ ...styles.cardArrow, color }}>
        <ArrowRight size={16} />
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    border: "1.5px solid #e2e8f5",
    borderRadius: "14px",
    padding: "20px",
    cursor: "pointer",
    transition: "all 0.18s ease",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    position: "relative",
  },
  iconWrap: {
    width: "44px",
    height: "44px",
    borderRadius: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f1f5c",
    marginBottom: "4px",
  },
  cardDesc: {
    fontSize: "13px",
    color: "#6b7a99",
    lineHeight: "1.5",
    margin: 0,
  },
  countBadge: {
    display: "inline-block",
    marginTop: "8px",
    fontSize: "12px",
    fontWeight: "600",
    padding: "2px 10px",
    borderRadius: "20px",
  },
  cardArrow: {
    flexShrink: 0,
    marginTop: "2px",
    opacity: 0.5,
  },
};

export default DashboardCard;