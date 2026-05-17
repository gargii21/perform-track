import { useState } from "react";
import axios from "axios";

function EmployeeGoals() {
  const [goals, setGoals] = useState([
    {
      thrustArea: "",
      title: "",
      description: "",
      uomType: "numeric",
      target: "",
      weightage: 10,
      targetDirection: "min",
    },
  ]);

  const token = localStorage.getItem("token");

  const handleChange = (index, field, value) => {
    const updatedGoals = [...goals];
    updatedGoals[index][field] = value;
    setGoals(updatedGoals);
  };

  const addGoal = () => {
    if (goals.length >= 8) {
      alert("Maximum 8 goals allowed");
      return;
    }

    setGoals([
      ...goals,
      {
        thrustArea: "",
        title: "",
        description: "",
        uomType: "numeric",
        target: "",
        weightage: 10,
        targetDirection: "min",
      },
    ]);
  };

  const removeGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const submitGoals = async () => {
    const total = goals.reduce((sum, goal) => sum + Number(goal.weightage), 0);

    if (total !== 100) {
      alert("Total weightage must be exactly 100%");
      return;
    }

    for (let goal of goals) {
      if (Number(goal.weightage) < 10) {
        alert("Minimum weightage per goal must be 10%");
        return;
      }
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/goals",
        { goals },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit goals");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Create Goal Sheet</h2>

      {goals.map((goal, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            marginBottom: "15px",
          }}
        >
          <h3>Goal {index + 1}</h3>

          <input
            placeholder="Thrust Area"
            value={goal.thrustArea}
            onChange={(e) =>
              handleChange(index, "thrustArea", e.target.value)
            }
          />

          <input
            placeholder="Goal Title"
            value={goal.title}
            onChange={(e) => handleChange(index, "title", e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={goal.description}
            onChange={(e) =>
              handleChange(index, "description", e.target.value)
            }
          />

          <select
            value={goal.uomType}
            onChange={(e) => handleChange(index, "uomType", e.target.value)}
          >
            <option value="numeric">Numeric</option>
            <option value="percentage">Percentage</option>
            <option value="timeline">Timeline</option>
            <option value="zero-based">Zero-based</option>
          </select>

          <select
  value={goal.targetDirection}
  onChange={(e) => handleChange(index, "targetDirection", e.target.value)}
>
  <option value="min">Min / Higher is Better</option>
  <option value="max">Max / Lower is Better</option>
  <option value="timeline">Timeline</option>
  <option value="zero">Zero-based</option>
</select>

          <input
            placeholder="Target"
            value={goal.target}
            onChange={(e) => handleChange(index, "target", e.target.value)}
          />

          <input
            type="number"
            placeholder="Weightage"
            value={goal.weightage}
            onChange={(e) => handleChange(index, "weightage", e.target.value)}
          />

          <button onClick={() => removeGoal(index)}>Remove</button>
        </div>
      ))}

      <h3>
        Total Weightage:{" "}
        {goals.reduce((sum, goal) => sum + Number(goal.weightage), 0)}%
      </h3>

      

      <button onClick={addGoal}>Add Goal</button>
      <button onClick={submitGoals}>Submit Goal Sheet</button>
    </div>
  );
}

export default EmployeeGoals;