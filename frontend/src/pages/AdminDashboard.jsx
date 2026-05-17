import { FileSpreadsheet, BarChart3, History, Unlock } from "lucide-react";
import DashboardCard from "../components/DashboardCard";
function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <h1>Admin / HR Dashboard</h1>
      <DashboardCard
  title="Reports"
  description="View planned vs actual achievement reports and export Excel."
  icon={FileSpreadsheet}
  path="/admin/reports"
/>

<DashboardCard
  title="Completion Dashboard"
  description="Track employee and manager quarterly completion."
  icon={BarChart3}
  path="/admin/completion"
/>

<DashboardCard
  title="Audit Logs"
  description="View all goal changes, approvals, and admin interventions."
  icon={History}
  path="/admin/audit-logs"
/>

<DashboardCard
  title="Goal Sheet Management"
  description="Unlock approved goal sheets with reason tracking."
  icon={Unlock}
  path="/admin/goal-sheets"
/>
    </div>
  );
}

export default AdminDashboard;