import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeGoals from "./pages/EmployeeGoals";
import ManagerApprovals from "./pages/ManagerApprovals";
import SharedGoals from "./pages/SharedGoals";
import EmployeeCheckins from "./pages/EmployeeCheckins";
import ManagerCheckins from "./pages/ManagerCheckins";
import AdminReports from "./pages/AdminReports";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import AdminGoalSheets from "./pages/AdminGoalSheets";
import CompletionDashboard from "./pages/CompletionDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import ManagerAnalytics  from "./pages/ManagerAnalytics.jsx";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/" />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
}
function ComingSoon({ title }) {
  return (
    <div style={{ padding: "40px" }}>
      <h1>{title}</h1>
      <p>This page will be implemented next.</p>
    </div>
  );
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute allowedRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute allowedRole="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/employee/goals"
  element={
    <ProtectedRoute allowedRole="employee">
      <EmployeeGoals />
    </ProtectedRoute>
  }
/>

<Route
  path="/manager/approvals"
  element={
    <ProtectedRoute allowedRole="manager">
      <ManagerApprovals />
    </ProtectedRoute>
  }
/>

<Route
  path="/manager/shared-goals"
  element={
    <ProtectedRoute allowedRole="manager">
      <SharedGoals />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/shared-goals"
  element={
    <ProtectedRoute allowedRole="admin">
      <SharedGoals />
    </ProtectedRoute>
  }
/>


<Route
  path="/employee/progress"
  element={
    <ProtectedRoute allowedRole="employee">
      <ComingSoon title="My Progress" />
    </ProtectedRoute>
  }
/>

<Route
  path="/employee/profile"
  element={
    <ProtectedRoute allowedRole="employee">
      <ComingSoon title="My Profile" />
    </ProtectedRoute>
  }
/>

<Route
  path="/manager/team"
  element={
    <ProtectedRoute allowedRole="manager">
      <ComingSoon title="Team Members" />
    </ProtectedRoute>
  }
/>

<Route
  path="/employee/checkins"
  element={
    <ProtectedRoute allowedRole="employee">
      <EmployeeCheckins />
    </ProtectedRoute>
  }
/>

<Route
  path="/manager/checkins"
  element={
    <ProtectedRoute allowedRole="manager">
      <ManagerCheckins />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/reports"
  element={
    <ProtectedRoute allowedRole="admin">
      <AdminReports />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/completion"
  element={
    <ProtectedRoute allowedRole="admin">
      <CompletionDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/audit-logs"
  element={
    <ProtectedRoute allowedRole="admin">
      <AdminAuditLogs />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/goal-sheets"
  element={
    <ProtectedRoute allowedRole="admin">
      <AdminGoalSheets />
    </ProtectedRoute>
  }
/>
<Route
  path="/manager/completion"
  element={
    <ProtectedRoute allowedRole="manager">
      <CompletionDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/analytics"
  element={
    <ProtectedRoute allowedRole="admin">
      <AnalyticsDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/manager/analytics"
  element={
    <ProtectedRoute allowedRole="manager">
      <ManagerAnalytics />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;