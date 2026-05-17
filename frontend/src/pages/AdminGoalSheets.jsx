import { useEffect, useState } from "react";
import axios from "axios";

function AdminGoalSheets() {
  const [sheets, setSheets] = useState([]);

  const token = localStorage.getItem("token");

  const fetchSheets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/goal-sheets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSheets(res.data);
    } catch (error) {
      alert("Failed to fetch goal sheets");
    }
  };

  const unlockSheet = async (sheetId) => {
    const reason = prompt("Enter reason for unlocking this goal sheet:");

    if (!reason) {
      alert("Reason is required");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/unlock-goal-sheet/${sheetId}`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      fetchSheets();
    } catch (error) {
      alert(error.response?.data?.message || "Unlock failed");
    }
  };

  useEffect(() => {
    fetchSheets();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Admin Goal Sheet Management</h2>

      {sheets.map((sheet) => (
        <div
          key={sheet.id}
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h3>{sheet.employee?.name}</h3>
          <p>Email: {sheet.employee?.email}</p>
          <p>Status: {sheet.status}</p>
          <p>Locked: {sheet.isLocked ? "Yes" : "No"}</p>

          <button onClick={() => unlockSheet(sheet.id)}>
            Unlock Goal Sheet
          </button>

          <h4>Goals</h4>

          {sheet.Goals?.map((goal) => (
            <div key={goal.id}>
              <p>
                <b>{goal.title}</b> — {goal.target} — {goal.weightage}%
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default AdminGoalSheets;