import { useState } from "react";
import axios from "axios";

function CompletionDashboard() {
  const [quarter, setQuarter] = useState("Q1");
  const [data, setData] = useState([]);

  const token = localStorage.getItem("token");

  const fetchCompletion = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/reports/completion?quarter=${quarter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
    } catch (error) {
      alert("Failed to fetch completion dashboard");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Completion Dashboard</h2>

      <select value={quarter} onChange={(e) => setQuarter(e.target.value)}>
        <option value="Q1">Q1</option>
        <option value="Q2">Q2</option>
        <option value="Q3">Q3</option>
        <option value="Q4">Q4</option>
      </select>

      <button onClick={fetchCompletion}>Load Completion</button>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Goal Sheet Approved</th>
            <th>Total Goals</th>
            <th>Submitted Check-ins</th>
            <th>Manager Reviewed</th>
            <th>Employee Completion</th>
            <th>Manager Completion</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.employeeId}>
              <td>{item.employeeName}</td>
              <td>{item.goalSheetApproved ? "Yes" : "No"}</td>
              <td>{item.totalGoals}</td>
              <td>{item.submittedCheckins}</td>
              <td>{item.reviewedCheckins}</td>
              <td>{item.employeeCompletion}%</td>
              <td>{item.managerReviewCompletion}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CompletionDashboard;