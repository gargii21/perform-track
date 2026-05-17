import { useEffect, useState } from "react";
import axios from "axios";

function ManagerApprovals() {
  const [sheets, setSheets] = useState([]);
  const token = localStorage.getItem("token");

  const fetchSheets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/goals/submitted", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSheets(res.data);
    } catch (error) {
      alert("Failed to fetch goal sheets");
    }
  };

  useEffect(() => {
    fetchSheets();
  }, []);

  const updateGoal = async (goalId, target, weightage) => {
    try {
      await axios.put(
        `http://localhost:5000/api/goals/manager/edit/${goalId}`,
        { target, weightage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Goal updated");
      fetchSheets();
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const approveSheet = async (sheetId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/goals/manager/approve/${sheetId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      fetchSheets();
    } catch (error) {
      alert(error.response?.data?.message || "Approval failed");
    }
  };

  const returnRework = async (sheetId) => {
    const comment = prompt("Enter rework comment:");

    try {
      const res = await axios.put(
        `http://localhost:5000/api/goals/manager/rework/${sheetId}`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      fetchSheets();
    } catch (error) {
      alert("Failed to return for rework");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Manager Goal Approvals</h2>

      {sheets.map((sheet) => (
        <div
          key={sheet.id}
          style={{
            border: "1px solid black",
            marginBottom: "20px",
            padding: "20px",
          }}
        >
          <h3>Employee: {sheet.employee?.name}</h3>
          <p>Status: {sheet.status}</p>

          {sheet.Goals.map((goal) => (
            <GoalEditCard
              key={goal.id}
              goal={goal}
              updateGoal={updateGoal}
            />
          ))}

          <button onClick={() => approveSheet(sheet.id)}>Approve</button>
          <button onClick={() => returnRework(sheet.id)}>
            Return for Rework
          </button>
        </div>
      ))}
    </div>
  );
}

function GoalEditCard({ goal, updateGoal }) {
  const [target, setTarget] = useState(goal.target);
  const [weightage, setWeightage] = useState(goal.weightage);

  return (
    <div style={{ padding: "10px", borderTop: "1px solid #ccc" }}>
      <h4>{goal.title}</h4>
      <p>{goal.description}</p>
      <p>Thrust Area: {goal.thrustArea}</p>
      <p>UoM: {goal.uomType}</p>

      <input
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Target"
      />

      <input
        type="number"
        value={weightage}
        onChange={(e) => setWeightage(e.target.value)}
        placeholder="Weightage"
      />

      <button onClick={() => updateGoal(goal.id, target, weightage)}>
        Save Changes
      </button>
    </div>
  );
}

export default ManagerApprovals;