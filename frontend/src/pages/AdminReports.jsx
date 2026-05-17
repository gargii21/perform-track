import { useState } from "react";
import axios from "axios";

function AdminReports() {
  const [quarter, setQuarter] = useState("Q1");
  const [report, setReport] = useState([]);

  const token = localStorage.getItem("token");

  const fetchReport = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/reports/achievement?quarter=${quarter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReport(res.data);
    } catch (error) {
      alert("Failed to fetch report");
    }
  };

  const exportExcel = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/reports/achievement/export?quarter=${quarter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `achievement_report_${quarter}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Export failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Achievement Report</h2>

      <select value={quarter} onChange={(e) => setQuarter(e.target.value)}>
        <option value="Q1">Q1</option>
        <option value="Q2">Q2</option>
        <option value="Q3">Q3</option>
        <option value="Q4">Q4</option>
      </select>

      <button onClick={fetchReport}>Load Report</button>
      <button onClick={exportExcel}>Export Excel</button>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Quarter</th>
            <th>Goal</th>
            <th>Planned</th>
            <th>Actual</th>
            <th>Status</th>
            <th>Score</th>
            <th>Manager Comment</th>
          </tr>
        </thead>

        <tbody>
          {report.map((item, index) => (
            <tr key={index}>
              <td>{item.employeeName}</td>
              <td>{item.quarter}</td>
              <td>{item.goalTitle}</td>
              <td>{item.plannedTarget}</td>
              <td>{item.actualAchievement}</td>
              <td>{item.progressStatus}</td>
              <td>{Number(item.progressScore).toFixed(2)}%</td>
              <td>{item.managerComment || "Not reviewed"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminReports;