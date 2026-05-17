import { useEffect, useState } from "react";
import axios from "axios";

function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);

  const token = localStorage.getItem("token");

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/audit-logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLogs(res.data);
    } catch (error) {
      alert("Failed to fetch audit logs");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Audit Logs</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Action</th>
            <th>Entity</th>
            <th>Old Value</th>
            <th>New Value</th>
            <th>Reason</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.user?.name}</td>
              <td>{log.user?.role}</td>
              <td>{log.action}</td>
              <td>
                {log.entityType} #{log.entityId}
              </td>
              <td>
                <pre>{JSON.stringify(log.oldValue, null, 2)}</pre>
              </td>
              <td>
                <pre>{JSON.stringify(log.newValue, null, 2)}</pre>
              </td>
              <td>{log.reason}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminAuditLogs;