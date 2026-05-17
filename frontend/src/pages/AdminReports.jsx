// AdminReports.jsx
import { useState } from "react";
import axios from "axios";
import { FileDown, Search } from "lucide-react";
import {
  AdminLayout,
  StyledTable,
  Toolbar,
  Select,
  PrimaryBtn,
  GhostBtn,
  StatusBadge,
} from "./AdminLayout";

const QUARTER_OPTIONS = [
  { value: "Q1", label: "Q1" },
  { value: "Q2", label: "Q2" },
  { value: "Q3", label: "Q3" },
  { value: "Q4", label: "Q4" },
];

const STATUS_MAP = {
  "on-track":  { label: "On Track",  bg: "#d1fae5", color: "#065f46" },
  "at-risk":   { label: "At Risk",   bg: "#fef3c7", color: "#92400e" },
  "completed": { label: "Completed", bg: "#dbeafe", color: "#1e40af" },
  "overdue":   { label: "Overdue",   bg: "#fee2e2", color: "#991b1b" },
};

const COLUMNS = [
  { key: "employeeName", label: "Employee" },
  { key: "quarter",      label: "Quarter"  },
  { key: "goalTitle",    label: "Goal"     },
  { key: "plannedTarget",   label: "Planned"  },
  { key: "actualAchievement", label: "Actual"  },
  {
    key: "progressStatus",
    label: "Status",
    render: (row) => <StatusBadge value={row.progressStatus} map={STATUS_MAP} />,
  },
  {
    key: "progressScore",
    label: "Score",
    render: (row) => (
      <span style={{ fontWeight: 700, color: "#8b5cf6" }}>
        {Number(row.progressScore).toFixed(2)}%
      </span>
    ),
  },
  {
    key: "managerComment",
    label: "Manager Comment",
    render: (row) => (
      <span style={{ color: row.managerComment ? "#0f1f5c" : "#9aaac8", fontStyle: row.managerComment ? "normal" : "italic" }}>
        {row.managerComment || "Not reviewed"}
      </span>
    ),
  },
];

function AdminReports() {
  const [quarter, setQuarter] = useState("Q1");
  const [report,  setReport]  = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/reports/achievement?quarter=${quarter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReport(res.data);
    } catch {
      alert("Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/reports/achievement/export?quarter=${quarter}`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
      );
      const url  = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href  = url;
      link.setAttribute("download", `achievement_report_${quarter}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Export failed");
    }
  };

  return (
    <AdminLayout
      title="Achievement Report"
      subtitle="View and export quarterly goal achievement data"
    >
      <Toolbar>
        <Select value={quarter} onChange={setQuarter} options={QUARTER_OPTIONS} />
        <PrimaryBtn onClick={fetchReport} disabled={loading}>
          <Search size={15} />
          {loading ? "Loading…" : "Load Report"}
        </PrimaryBtn>
        <GhostBtn onClick={exportExcel}>
          <FileDown size={15} />
          Export Excel
        </GhostBtn>
      </Toolbar>

      <StyledTable
        columns={COLUMNS}
        rows={report}
        emptyText="No report data. Select a quarter and click Load Report."
      />
    </AdminLayout>
  );
}

export default AdminReports;
