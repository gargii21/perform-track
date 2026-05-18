import { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
function SharedGoals() {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    thrustArea: "",
    uomType: "numeric",
    target: "",
    primaryOwnerId: "",
    employeeIds: "",
    defaultWeightage: 10,
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const submitSharedGoal = async () => {
    try {
      const payload = {
        ...form,
        primaryOwnerId: Number(form.primaryOwnerId),
        employeeIds: form.employeeIds.split(",").map((id) => Number(id.trim())),
        defaultWeightage: Number(form.defaultWeightage),
      };

      const res = await axios.post(
        `${API_URL}/api/shared-goals`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create shared goal");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Create Shared Departmental KPI</h2>

      <input
        placeholder="Title"
        onChange={(e) => handleChange("title", e.target.value)}
      />

      <textarea
        placeholder="Description"
        onChange={(e) => handleChange("description", e.target.value)}
      />

      <input
        placeholder="Thrust Area"
        onChange={(e) => handleChange("thrustArea", e.target.value)}
      />

      <select
        onChange={(e) => handleChange("uomType", e.target.value)}
        value={form.uomType}
      >
        <option value="numeric">Numeric</option>
        <option value="percentage">Percentage</option>
        <option value="timeline">Timeline</option>
        <option value="zero-based">Zero-based</option>
      </select>

      <input
        placeholder="Target"
        onChange={(e) => handleChange("target", e.target.value)}
      />

      <input
        placeholder="Primary Owner ID"
        onChange={(e) => handleChange("primaryOwnerId", e.target.value)}
      />

      <input
        placeholder="Employee IDs comma separated, e.g. 1,2,3"
        onChange={(e) => handleChange("employeeIds", e.target.value)}
      />

      <input
        type="number"
        placeholder="Default Weightage"
        value={form.defaultWeightage}
        onChange={(e) => handleChange("defaultWeightage", e.target.value)}
      />

      <button onClick={submitSharedGoal}>Push Shared Goal</button>
    </div>
  );
}

export default SharedGoals;