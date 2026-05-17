// AdminAuditLogs.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { AdminLayout, StyledTable, StatusBadge } from "./AdminLayout";

const ACTION_MAP = {
  unlock:  { label: "Unlock",  bg: "#fef3c7", color: "#92400e" },
  update:  { label: "Update",  bg: "#dbeafe", color: "#1e40af" },
  create:  { label: "Create",  bg: "#d1fae5", color: "#065f46" },
  delete:  { label: "Delete",  bg: "#fee2e2", color: "#991b1b" },
};

const ROLE_MAP = {
  admin:    { label: "Admin",    bg: "#ede9fe", color: "#5b21b6" },
  manager:  { label: "Manager",  bg: "#dbeafe", color: "#1e40af" },
  employee: { label: "Employee", bg: "#d1fae5", color: "#065f46" },
};

function JsonCell({ value }) {
  const [open, setOpen] = useState(false);
  if (!value || Object.keys(value).length === 0) {
    return <span style={{ color: "#9aaac8", fontStyle: "italic" }}>—</span>;
  }
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        style={S.jsonToggle}
      >
        {open ? "Hide" : "View"}
      </button>
      {open && (
        <pre style={S.jsonPre}>{JSON.stringify(value, null, 2)}</pre>
      )}
    </div>
  );
}

const COLUMNS = [
  {
    key: "user",
    label: "User",
    render: (row) => (
      <div>
        <div style={{ fontWeight: 600, color: "#0f1f5c" }}>{row.user?.name}</div>
      </div>
    ),
  },
  {
    key: "role",
    label: "Role",
    render: (row) => <StatusBadge value={row.user?.role} map={ROLE_MAP} />,
  },
  {
    key: "action",
    label: "Action",
    render: (row) => <StatusBadge value={row.action?.toLowerCase()} map={ACTION_MAP} />,
  },
  {
    key: "entity",
    label: "Entity",
    render: (row) => (
      <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#6b7a99" }}>
        {row.entityType} #{row.entityId}
      </span>
    ),
  },
  {
    key: "oldValue",
    label: "Old Value",
    render: (row) => <JsonCell value={row.oldValue} />,
  },
  {
    key: "newValue",
    label: "New Value",
    render: (row) => <JsonCell value={row.newValue} />,
  },
  {
    key: "reason",
    label: "Reason",
    render: (row) => (
      <span style={{ color: row.reason ? "#0f1f5c" : "#9aaac8", fontStyle: row.reason ? "normal" : "italic" }}>
        {row.reason || "—"}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Time",
    render: (row) => (
      <span style={{ fontSize: "12.5px", color: "#6b7a99", whiteSpace: "nowrap" }}>
        {new Date(row.createdAt).toLocaleString()}
      </span>
    ),
  },
];

function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/audit-logs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLogs(res.data))
      .catch(() => alert("Failed to fetch audit logs"));
  }, []);

  return (
    <AdminLayout
      title="Audit Logs"
      subtitle="Track all admin and manager actions across the system"
    >
      <StyledTable
        columns={COLUMNS}
        rows={logs}
        emptyText="No audit logs found."
      />
    </AdminLayout>
  );
}

const S = {
  jsonToggle: { fontSize: "11px", fontWeight: "700", color: "#8b5cf6", background: "#ede9fe", border: "none", borderRadius: "6px", padding: "3px 8px", cursor: "pointer" },
  jsonPre:    { marginTop: "6px", padding: "8px", background: "#f4f7ff", borderRadius: "8px", fontSize: "11px", color: "#3d4f7c", fontFamily: "monospace", maxWidth: "220px", overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all" },
};

export default AdminAuditLogs;
