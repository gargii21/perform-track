import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DashboardCard({ title, description, icon: Icon, path, count }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      style={{
        background: "white",
        padding: "24px",
        borderRadius: "18px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "0.2s",
        border: "1px solid #eee",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "14px",
          background: "#eef2ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <Icon size={26} color="#4f46e5" />
      </div>

      <h3 style={{ marginBottom: "8px" }}>{title}</h3>

      <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.5" }}>
        {description}
      </p>

      {count !== undefined && (
        <h2 style={{ marginTop: "12px", color: "#111827" }}>{count}</h2>
      )}

      <div
        style={{
          marginTop: "18px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "#4f46e5",
          fontWeight: "600",
        }}
      >
        Open <ArrowRight size={18} />
      </div>
    </div>
  );
}

export default DashboardCard;