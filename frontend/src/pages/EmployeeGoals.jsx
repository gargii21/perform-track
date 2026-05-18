import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Target,
  Plus,
  Trash2,
  ClipboardCheck,
  BarChart3,
  UserCircle,
  ChevronDown,
  Send,
  AlertCircle,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
const API_URL = import.meta.env.VITE_API_URL;

const navItems = [
  { label: "Dashboard", icon: BarChart3, path: "/employee-dashboard" },
  { label: "My Goal Sheet", icon: Target, path: "/employee/goals" },
  { label: "Quarterly Check-ins", icon: ClipboardCheck, path: "/employee/checkins" },
  // { label: "My Progress", icon: BarChart3, path: "/employee/progress" },
  // { label: "My Profile", icon: UserCircle, path: "/employee/profile" },
];

const UOM_OPTIONS = [
  { value: "numeric", label: "Numeric" },
  { value: "percentage", label: "Percentage" },
  { value: "timeline", label: "Timeline" },
  { value: "zero-based", label: "Zero-based" },
];

const DIRECTION_OPTIONS = [
  { value: "min", label: "Higher is Better ↑" },
  { value: "max", label: "Lower is Better ↓" },
  { value: "timeline", label: "Timeline" },
  { value: "zero", label: "Zero-based" },
];

const THRUST_AREAS = [
  "Revenue Growth",
  "Customer Success",
  "Operational Efficiency",
  "People & Culture",
  "Innovation",
  "Compliance & Risk",
];

const defaultGoal = () => ({
  thrustArea: "",
  title: "",
  description: "",
  uomType: "numeric",
  target: "",
  weightage: 10,
  targetDirection: "min",
});

function EmployeeGoals() {
  const [goals, setGoals] = useState([defaultGoal()]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const totalWeightage = goals.reduce((sum, g) => sum + Number(g.weightage), 0);
  const weightageOk = totalWeightage === 100;

  const handleChange = (index, field, value) => {
    const updated = [...goals];
    updated[index][field] = value;
    setGoals(updated);
  };

  const addGoal = () => {
    if (goals.length >= 8) return alert("Maximum 8 goals allowed");
    setGoals([...goals, defaultGoal()]);
  };

  const removeGoal = (index) => {
    if (goals.length === 1) return;
    setGoals(goals.filter((_, i) => i !== index));
  };

  const submitGoals = async () => {
    if (!weightageOk) return alert("Total weightage must be exactly 100%");
    for (let g of goals) {
      if (Number(g.weightage) < 10) return alert("Minimum weightage per goal is 10%");
    }
    try {
      const res = await axios.post(
        `${API_URL}/api/goals`,
        { goals },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit goals");
    }
  };

  return (
    <div style={S.layout}>
      <Sidebar navItems={navItems} role="employee" />

      <main style={S.main}>
        {/* Topbar */}
        <div style={S.topbar}>
          <div>
            <h1 style={S.pageTitle}>My Goal Sheet</h1>
            <p style={S.pageSubtitle}>Define and submit your goals for this appraisal cycle</p>
          </div>
          <div style={S.topbarRight}>
            <div style={S.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
          </div>
        </div>

        {/* Weightage Bar */}
        <div style={S.weightCard}>
          <div style={S.weightRow}>
            <div>
              <div style={S.weightLabel}>Total Weightage</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ ...S.weightValue, color: weightageOk ? "#10b981" : totalWeightage > 100 ? "#ef4444" : "#f59e0b" }}>
                  {totalWeightage}%
                </span>
                <span style={S.weightSub}>/ 100%</span>
              </div>
            </div>
            <div style={S.weightBarWrap}>
              <div style={S.weightBarBg}>
                <div
                  style={{
                    ...S.weightBarFill,
                    width: `${Math.min(totalWeightage, 100)}%`,
                    background: weightageOk ? "#10b981" : totalWeightage > 100 ? "#ef4444" : "#f59e0b",
                  }}
                />
              </div>
              {!weightageOk && (
                <div style={S.weightHint}>
                  <AlertCircle size={13} />
                  {totalWeightage < 100
                    ? `Add ${100 - totalWeightage}% more`
                    : `Reduce by ${totalWeightage - 100}%`}
                </div>
              )}
            </div>
            <div style={S.goalCount}>{goals.length} / 8 goals</div>
          </div>
        </div>

        {/* Goal Cards */}
        <div style={S.goalList}>
          {goals.map((goal, index) => (
            <div key={index} style={S.goalCard}>
              {/* Card Header */}
              <div style={S.goalCardHeader}>
                <div style={S.goalNumBadge}>Goal {index + 1}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={S.weightagePill}>
                    {goal.weightage}% weight
                  </div>
                  {goals.length > 1 && (
                    <button onClick={() => removeGoal(index)} style={S.removeBtn}>
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              <div style={S.formGrid}>
                {/* Thrust Area */}
                <div style={S.field}>
                  <label style={S.label}>Thrust Area</label>
                  <div style={S.selectWrap}>
                    <select
                      value={goal.thrustArea}
                      onChange={(e) => handleChange(index, "thrustArea", e.target.value)}
                      style={S.select}
                    >
                      <option value="">Select thrust area</option>
                      {THRUST_AREAS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} style={S.selectIcon} />
                  </div>
                </div>

                {/* Goal Title */}
                <div style={S.field}>
                  <label style={S.label}>Goal Title</label>
                  <input
                    placeholder="e.g. Reduce API response time"
                    value={goal.title}
                    onChange={(e) => handleChange(index, "title", e.target.value)}
                    style={S.input}
                  />
                </div>

                {/* Description — full width */}
                <div style={{ ...S.field, gridColumn: "1 / -1" }}>
                  <label style={S.label}>Description</label>
                  <textarea
                    placeholder="Describe this goal in detail..."
                    value={goal.description}
                    onChange={(e) => handleChange(index, "description", e.target.value)}
                    style={S.textarea}
                    rows={2}
                  />
                </div>

                {/* UoM */}
                <div style={S.field}>
                  <label style={S.label}>Unit of Measurement</label>
                  <div style={S.segmentGroup}>
                    {UOM_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleChange(index, "uomType", opt.value)}
                        style={{
                          ...S.segmentBtn,
                          ...(goal.uomType === opt.value ? S.segmentActive : {}),
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Direction */}
                <div style={S.field}>
                  <label style={S.label}>Target Direction</label>
                  <div style={S.segmentGroup}>
                    {DIRECTION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleChange(index, "targetDirection", opt.value)}
                        style={{
                          ...S.segmentBtn,
                          ...(goal.targetDirection === opt.value ? S.segmentActive : {}),
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target */}
                <div style={S.field}>
                  <label style={S.label}>Target Value</label>
                  <input
                    placeholder="e.g. 180, 95%, 2024-03-31"
                    value={goal.target}
                    onChange={(e) => handleChange(index, "target", e.target.value)}
                    style={S.input}
                  />
                </div>

                {/* Weightage */}
                <div style={S.field}>
                  <label style={S.label}>
                    Weightage — <span style={{ color: "#1b4fff", fontWeight: 700 }}>{goal.weightage}%</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={goal.weightage}
                    onChange={(e) => handleChange(index, "weightage", Number(e.target.value))}
                    style={S.slider}
                  />
                  <div style={S.sliderLabels}>
                    <span>10%</span><span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div style={S.footer}>
          {goals.length < 8 && (
            <button onClick={addGoal} style={S.addBtn}>
              <Plus size={16} /> Add Goal
            </button>
          )}
          <button
            onClick={submitGoals}
            disabled={!weightageOk}
            style={{ ...S.submitBtn, opacity: weightageOk ? 1 : 0.5, cursor: weightageOk ? "pointer" : "not-allowed" }}
          >
            <Send size={16} /> Submit Goal Sheet
          </button>
        </div>
      </main>
    </div>
  );
}

const S = {
  layout: { display: "flex", minHeight: "100vh", background: "#f4f7ff", fontFamily: "'Segoe UI', sans-serif" },
  main: { flex: 1, padding: "28px 32px", overflowY: "auto" },
  topbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  pageTitle: { fontSize: "22px", fontWeight: "700", color: "#0f1f5c", margin: 0 },
  pageSubtitle: { fontSize: "14px", color: "#6b7a99", margin: "2px 0 0" },
  topbarRight: { display: "flex", gap: "12px" },
  avatar: { width: "38px", height: "38px", borderRadius: "10px", background: "#1b4fff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "15px" },

  weightCard: { background: "#fff", border: "1.5px solid #e2e8f5", borderRadius: "14px", padding: "18px 24px", marginBottom: "24px" },
  weightRow: { display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" },
  weightLabel: { fontSize: "12px", fontWeight: "600", color: "#6b7a99", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" },
  weightValue: { fontSize: "28px", fontWeight: "700", lineHeight: 1 },
  weightSub: { fontSize: "14px", color: "#9aaac8" },
  weightBarWrap: { flex: 1, minWidth: "160px" },
  weightBarBg: { height: "8px", background: "#eef2ff", borderRadius: "99px", overflow: "hidden" },
  weightBarFill: { height: "100%", borderRadius: "99px", transition: "width 0.3s ease, background 0.3s" },
  weightHint: { display: "flex", alignItems: "center", gap: "4px", marginTop: "6px", fontSize: "12px", color: "#f59e0b", fontWeight: "600" },
  goalCount: { fontSize: "13px", fontWeight: "600", color: "#6b7a99", whiteSpace: "nowrap" },

  goalList: { display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" },
  goalCard: { background: "#fff", border: "1.5px solid #e2e8f5", borderRadius: "14px", padding: "20px 24px" },
  goalCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" },
  goalNumBadge: { fontSize: "13px", fontWeight: "700", color: "#1b4fff", background: "#eef2ff", padding: "4px 12px", borderRadius: "20px" },
  weightagePill: { fontSize: "12px", fontWeight: "600", color: "#6b7a99", background: "#f4f7ff", padding: "3px 10px", borderRadius: "20px", border: "1px solid #e2e8f5" },
  removeBtn: { background: "#fee2e2", border: "none", borderRadius: "8px", padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center", color: "#ef4444" },

  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: "700", color: "#3d4f7c", textTransform: "uppercase", letterSpacing: "0.4px" },
  input: { padding: "10px 14px", border: "1.5px solid #e2e8f5", borderRadius: "10px", fontSize: "14px", color: "#0f1f5c", background: "#fff", outline: "none", fontFamily: "'Segoe UI', sans-serif", width: "100%", boxSizing: "border-box" },
  textarea: { padding: "10px 14px", border: "1.5px solid #e2e8f5", borderRadius: "10px", fontSize: "14px", color: "#0f1f5c", background: "#fff", outline: "none", fontFamily: "'Segoe UI', sans-serif", width: "100%", boxSizing: "border-box", resize: "vertical" },

  selectWrap: { position: "relative" },
  select: { width: "100%", padding: "10px 36px 10px 14px", border: "1.5px solid #e2e8f5", borderRadius: "10px", fontSize: "14px", color: "#0f1f5c", background: "#fff", outline: "none", appearance: "none", fontFamily: "'Segoe UI', sans-serif", boxSizing: "border-box", cursor: "pointer" },
  selectIcon: { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#9aaac8", pointerEvents: "none" },

  segmentGroup: { display: "flex", flexWrap: "wrap", gap: "6px" },
  segmentBtn: { padding: "6px 12px", border: "1.5px solid #e2e8f5", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#6b7a99", background: "#fff", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", transition: "all 0.15s" },
  segmentActive: { border: "1.5px solid #1b4fff", background: "#eef2ff", color: "#1b4fff" },

  slider: { width: "100%", accentColor: "#1b4fff", cursor: "pointer" },
  sliderLabels: { display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9aaac8", marginTop: "2px" },

  footer: { display: "flex", alignItems: "center", gap: "12px", justifyContent: "flex-end" },
  addBtn: { display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", border: "1.5px solid #1b4fff", borderRadius: "10px", background: "#fff", color: "#1b4fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" },
  submitBtn: { display: "flex", alignItems: "center", gap: "8px", padding: "10px 24px", border: "none", borderRadius: "10px", background: "#1b4fff", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" },
};

export default EmployeeGoals;