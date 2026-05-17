import { useEffect, useState } from "react";
import axios from "axios";

function EmployeeCheckins() {
  const [quarter, setQuarter] = useState("Q1");
  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({});

  const token = localStorage.getItem("token");

  const fetchApprovedGoals = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/checkins/employee/approved-goals",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGoals(res.data);

      const initialData = {};
      res.data.forEach((goal) => {
        initialData[goal.id] = {
          actualAchievement: "",
          progressStatus: "Not Started",
          employeeComment: "",
        };
      });

      setFormData(initialData);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch goals");
    }
  };

  useEffect(() => {
    fetchApprovedGoals();
  }, []);

  const handleChange = (goalId, field, value) => {
    setFormData({
      ...formData,
      [goalId]: {
        ...formData[goalId],
        [field]: value,
      },
    });
  };

  const submitCheckin = async () => {
    const checkins = goals.map((goal) => ({
      goalId: goal.id,
      actualAchievement: formData[goal.id]?.actualAchievement,
      progressStatus: formData[goal.id]?.progressStatus,
      employeeComment: formData[goal.id]?.employeeComment,
    }));

    for (let item of checkins) {
      if (!item.actualAchievement || !item.progressStatus) {
        alert("Please fill actual achievement and status for all goals");
        return;
      }
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/checkins/employee/submit",
        {
          quarter,
          checkins,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit check-in");
    }
  };

  return (
    <div style={{ padding: "30px", background: "#f5f7fb", minHeight: "100vh" }}>
      <h2>Quarterly Achievement Update</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Select Quarter: </label>
        <select value={quarter} onChange={(e) => setQuarter(e.target.value)}>
          <option value="Q1">Q1 - July</option>
          <option value="Q2">Q2 - October</option>
          <option value="Q3">Q3 - January</option>
          <option value="Q4">Q4 - March/April</option>
        </select>
      </div>

      {goals.length === 0 && <p>No approved goals found.</p>}

      {goals.map((goal) => (
        <div
          key={goal.id}
          style={{
            background: "white",
            padding: "20px",
            marginBottom: "18px",
            borderRadius: "14px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          }}
        >
          <h3>{goal.title}</h3>

          <p>
            <b>Thrust Area:</b> {goal.thrustArea}
          </p>

          <p>
            <b>Description:</b> {goal.description}
          </p>

          <p>
            <b>Planned Target:</b> {goal.target}
          </p>

          <p>
            <b>UoM:</b> {goal.uomType}
          </p>

          <p>
            <b>Target Direction:</b> {goal.targetDirection}
          </p>

          <p>
            <b>Weightage:</b> {goal.weightage}%
          </p>

          <input
            style={inputStyle}
            placeholder="Actual Achievement e.g. 15 APIs, 180 ms, 0"
            value={formData[goal.id]?.actualAchievement || ""}
            onChange={(e) =>
              handleChange(goal.id, "actualAchievement", e.target.value)
            }
          />

          <select
            style={inputStyle}
            value={formData[goal.id]?.progressStatus || "Not Started"}
            onChange={(e) =>
              handleChange(goal.id, "progressStatus", e.target.value)
            }
          >
            <option value="Not Started">Not Started</option>
            <option value="On Track">On Track</option>
            <option value="Completed">Completed</option>
          </select>

          <textarea
            style={inputStyle}
            placeholder="Employee comment"
            value={formData[goal.id]?.employeeComment || ""}
            onChange={(e) =>
              handleChange(goal.id, "employeeComment", e.target.value)
            }
          />
        </div>
      ))}

      {goals.length > 0 && (
        <button style={buttonStyle} onClick={submitCheckin}>
          Submit {quarter} Check-in
        </button>
      )}
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "12px 22px",
  background: "#4f46e5",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};

export default EmployeeCheckins;