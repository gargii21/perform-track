import { useEffect, useState } from "react";
import axios from "axios";
import {
  Target,
  ClipboardCheck,
  BarChart3,
  UserCircle,
  Send,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Clock,
  Circle,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
const API_URL = import.meta.env.VITE_API_URL;
const navItems = [
  { label: "Dashboard", icon: BarChart3, path: "/employee-dashboard" },
  { label: "My Goal Sheet", icon: Target, path: "/employee/goals" },
  { label: "Quarterly Check-ins", icon: ClipboardCheck, path: "/employee/checkins" },
//   { label: "My Progress", icon: BarChart3, path: "/employee/progress" },
//   { label: "My Profile", icon: UserCircle, path: "/employee/profile" },
];

const QUARTERS = [
  { value: "Q1", label: "Q1", sub: "July" },
  { value: "Q2", label: "Q2", sub: "October" },
  { value: "Q3", label: "Q3", sub: "January" },
  { value: "Q4", label: "Q4", sub: "March / April" },
];

const STATUS_OPTIONS = [
  { value: "Not Started", icon: Circle, color: "#f43c3c", bg: "#f4f7ff" },
  { value: "On Track", icon: TrendingUp, color: "#10b981", bg: "#d1fae5" },
  { value: "Completed", icon: CheckCircle2, color: "#1b4fff", bg: "#eef2ff" },
];

const DIRECTION_ICON = {
  min: <TrendingUp size={13} />,
  max: <TrendingDown size={13} />,
  timeline: <Clock size={13} />,
  zero: <Minus size={13} />,
};

function EmployeeCheckins() {
  const [quarter, setQuarter] = useState("Q1");
  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchApprovedGoals = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/checkins/employee/approved-goals`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals(res.data);
      const init = {};
      res.data.forEach((g) => {
        init[g.id] = { actualAchievement: "", progressStatus: "Not Started", employeeComment: "" };
      });
      setFormData(init);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch goals");
    }
  };

  useEffect(() => { fetchApprovedGoals(); }, []);

  const handleChange = (goalId, field, value) => {
    setFormData({ ...formData, [goalId]: { ...formData[goalId], [field]: value } });
  };

  const submitCheckin = async () => {
    const checkins = goals.map((g) => ({
      goalId: g.id,
      actualAchievement: formData[g.id]?.actualAchievement,
      progressStatus: formData[g.id]?.progressStatus,
      employeeComment: formData[g.id]?.employeeComment,
    }));
    for (let item of checkins) {
      if (!item.actualAchievement || !item.progressStatus)
        return alert("Please fill actual achievement and status for all goals");
    }
    try {
      const res = await axios.post(
        `${API_URL}/api/checkins/employee/submit`,
        { quarter, checkins },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit check-in");
    }
  };

  const completedCount = goals.filter(
    (g) => formData[g.id]?.progressStatus === "Completed"
  ).length;

  return (
    <div style={S.layout}>
      <Sidebar navItems={navItems} role="employee" />

      <main style={S.main}>
        {/* Topbar */}
        <div style={S.topbar}>
          <div>
            <h1 style={S.pageTitle}>Quarterly Check-ins</h1>
            <p style={S.pageSubtitle}>Update your actual achievement for each goal</p>
          </div>
          <div style={S.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
        </div>

        {/* Quarter Selector */}
        <div style={S.quarterRow}>
          {QUARTERS.map((q) => (
            <div
              key={q.value}
              onClick={() => setQuarter(q.value)}
              style={{
                ...S.quarterCard,
                ...(quarter === q.value ? S.quarterCardActive : {}),
              }}
            >
              <div style={{ ...S.quarterLabel, color: quarter === q.value ? "#1b4fff" : "#0f1f5c" }}>
                {q.label}
              </div>
              <div style={S.quarterSub}>{q.sub}</div>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        {goals.length > 0 && (
          <div style={S.summaryCard}>
            <div style={S.summaryLeft}>
              <span style={S.summaryNum}>{completedCount}</span>
              <span style={S.summaryOf}>/ {goals.length} goals completed</span>
            </div>
            <div style={S.progressBarWrap}>
              <div style={S.progressBarBg}>
                <div
                  style={{
                    ...S.progressBarFill,
                    width: `${goals.length ? (completedCount / goals.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div style={S.summaryPct}>
              {goals.length ? Math.round((completedCount / goals.length) * 100) : 0}%
            </div>
          </div>
        )}

        {/* Empty State */}
        {goals.length === 0 && (
          <div style={S.emptyState}>
            <ClipboardCheck size={40} color="#c7d2fe" />
            <p style={{ color: "#6b7a99", marginTop: "12px" }}>No approved goals found for check-in.</p>
          </div>
        )}

        {/* Goal Check-in Cards */}
        <div style={S.goalList}>
          {goals.map((goal, idx) => {
            const status = formData[goal.id]?.progressStatus || "Not Started";
            const statusInfo = STATUS_OPTIONS.find((s) => s.value === status);

            return (
              <div key={goal.id} style={S.goalCard}>
                {/* Card top: goal info */}
                <div style={S.goalTop}>
                  <div style={S.goalMeta}>
                    <div style={S.goalIndex}>Goal {idx + 1}</div>
                    <h3 style={S.goalTitle}>{goal.title}</h3>
                    <p style={S.goalDesc}>{goal.description}</p>

                    <div style={S.tagRow}>
                      <span style={S.tag}>{goal.thrustArea}</span>
                      <span style={S.tag}>{goal.uomType}</span>
                      <span style={{ ...S.tag, display: "flex", alignItems: "center", gap: "4px" }}>
                        {DIRECTION_ICON[goal.targetDirection]}
                        {goal.targetDirection}
                      </span>
                      <span style={{ ...S.tag, background: "#eef2ff", color: "#1b4fff" }}>
                        {goal.weightage}% weight
                      </span>
                    </div>
                  </div>

                  {/* Target box */}
                  <div style={S.targetBox}>
                    <div style={S.targetLabel}>Planned Target</div>
                    <div style={S.targetValue}>{goal.target}</div>
                  </div>
                </div>

                <div style={S.divider} />

                {/* Input area */}
                <div style={S.inputGrid}>
                  {/* Actual achievement */}
                  <div style={S.field}>
                    <label style={S.fieldLabel}>Actual Achievement</label>
                    <input
                      placeholder="e.g. 15 APIs, 180 ms, 0"
                      value={formData[goal.id]?.actualAchievement || ""}
                      onChange={(e) => handleChange(goal.id, "actualAchievement", e.target.value)}
                      style={S.input}
                    />
                  </div>

                  {/* Progress Status — pill toggle */}
                  <div style={S.field}>
                    <label style={S.fieldLabel}>Progress Status</label>
                    <div style={S.statusGroup}>
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleChange(goal.id, "progressStatus", opt.value)}
                          style={{
                            ...S.statusBtn,
                            ...(status === opt.value
                              ? { background: opt.bg, color: opt.color, borderColor: opt.color }
                              : {}),
                          }}
                        >
                          <opt.icon size={14} />
                          {opt.value}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment — full width */}
                  <div style={{ ...S.field, gridColumn: "1 / -1" }}>
                    <label style={S.fieldLabel}>Your Comment <span style={{ color: "#9aaac8", fontWeight: 400 }}>(optional)</span></label>
                    <textarea
                      placeholder="Add notes about your progress, blockers, or highlights..."
                      value={formData[goal.id]?.employeeComment || ""}
                      onChange={(e) => handleChange(goal.id, "employeeComment", e.target.value)}
                      style={S.textarea}
                      rows={2}
                    />
                  </div>
                </div>

                {/* Status indicator strip at bottom */}
                <div
                  style={{
                    ...S.statusStrip,
                    background: statusInfo?.bg,
                    color: statusInfo?.color,
                  }}
                >
                  <statusInfo.icon size={13} />
                  {status}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit */}
        {goals.length > 0 && (
          <div style={S.footer}>
            <button onClick={submitCheckin} style={S.submitBtn}>
              <Send size={16} />
              Submit {quarter} Check-in
            </button>
          </div>
        )}
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
  avatar: { width: "38px", height: "38px", borderRadius: "10px", background: "#1b4fff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "15px" },

  quarterRow: { display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" },
  quarterCard: { padding: "12px 24px", border: "1.5px solid #e2e8f5", borderRadius: "12px", cursor: "pointer", background: "#fff", textAlign: "center", minWidth: "90px", transition: "all 0.15s" },
  quarterCardActive: { border: "1.5px solid #1b4fff", background: "#eef2ff" },
  quarterLabel: { fontSize: "16px", fontWeight: "700" },
  quarterSub: { fontSize: "12px", color: "#9aaac8", marginTop: "2px" },

  summaryCard: { display: "flex", alignItems: "center", gap: "16px", background: "#fff", border: "1.5px solid #e2e8f5", borderRadius: "12px", padding: "14px 20px", marginBottom: "20px" },
  summaryLeft: { display: "flex", alignItems: "baseline", gap: "6px", whiteSpace: "nowrap" },
  summaryNum: { fontSize: "24px", fontWeight: "700", color: "#1b4fff" },
  summaryOf: { fontSize: "13px", color: "#6b7a99" },
  progressBarWrap: { flex: 1 },
  progressBarBg: { height: "8px", background: "#eef2ff", borderRadius: "99px", overflow: "hidden" },
  progressBarFill: { height: "100%", background: "#1b4fff", borderRadius: "99px", transition: "width 0.4s ease" },
  summaryPct: { fontSize: "15px", fontWeight: "700", color: "#1b4fff", whiteSpace: "nowrap" },

  emptyState: { textAlign: "center", padding: "60px 0" },

  goalList: { display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" },
  goalCard: { background: "#fff", border: "1.5px solid #e2e8f5", borderRadius: "14px", overflow: "hidden" },
  goalTop: { display: "flex", justifyContent: "space-between", gap: "20px", padding: "20px 24px 16px" },
  goalMeta: { flex: 1 },
  goalIndex: { fontSize: "12px", fontWeight: "700", color: "#1b4fff", background: "#eef2ff", display: "inline-block", padding: "3px 10px", borderRadius: "20px", marginBottom: "8px" },
  goalTitle: { fontSize: "16px", fontWeight: "700", color: "#0f1f5c", margin: "0 0 4px" },
  goalDesc: { fontSize: "13px", color: "#6b7a99", margin: "0 0 10px", lineHeight: 1.5 },
  tagRow: { display: "flex", flexWrap: "wrap", gap: "6px" },
  tag: { fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px", background: "#f4f7ff", color: "#6b7a99", border: "1px solid #e2e8f5" },
  targetBox: { background: "#f4f7ff", border: "1.5px solid #e2e8f5", borderRadius: "12px", padding: "14px 18px", textAlign: "center", minWidth: "110px", flexShrink: 0 },
  targetLabel: { fontSize: "11px", fontWeight: "700", color: "#9aaac8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" },
  targetValue: { fontSize: "20px", fontWeight: "700", color: "#0f1f5c" },

  divider: { height: "1px", background: "#f0f4ff", margin: "0 24px" },

  inputGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", padding: "16px 24px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  fieldLabel: { fontSize: "12px", fontWeight: "700", color: "#3d4f7c", textTransform: "uppercase", letterSpacing: "0.4px" },
  input: { padding: "10px 14px", border: "1.5px solid #e2e8f5", borderRadius: "10px", fontSize: "14px", color: "#0f1f5c", background: "#fff", outline: "none", fontFamily: "'Segoe UI', sans-serif", boxSizing: "border-box", width: "100%" },
  textarea: { padding: "10px 14px", border: "1.5px solid #e2e8f5", borderRadius: "10px", fontSize: "14px", color: "#0f1f5c", background: "#fff", outline: "none", fontFamily: "'Segoe UI', sans-serif", boxSizing: "border-box", width: "100%", resize: "vertical" },

  statusGroup: { display: "flex", flexWrap: "wrap", gap: "6px" },
  statusBtn: { display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", border: "1.5px solid #e2e8f5", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#6b7a99", background: "#fff", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", transition: "all 0.15s" },

  statusStrip: { display: "flex", alignItems: "center", gap: "6px", padding: "8px 24px", fontSize: "12px", fontWeight: "600" },

  footer: { display: "flex", justifyContent: "flex-end" },
  submitBtn: { display: "flex", alignItems: "center", gap: "8px", padding: "11px 24px", border: "none", borderRadius: "10px", background: "#1b4fff", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" },
};

export default EmployeeCheckins;