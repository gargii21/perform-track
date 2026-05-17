import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users, ClipboardList, Share2, MessageSquareText,
  BarChart3, CheckCircle2, TrendingUp, Circle,
  TrendingDown, Send, ChevronDown, MessageSquare,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const navItems = [
  { label: "Dashboard", icon: BarChart3, path: "/manager-dashboard" },
  { label: "Team Members", icon: Users, path: "/manager/team" },
  { label: "Goal Approvals", icon: ClipboardList, path: "/manager/approvals" },
  { label: "Shared Goals", icon: Share2, path: "/manager/shared-goals" },
  { label: "Quarterly Check-ins", icon: MessageSquareText, path: "/manager/checkins" },
  { label: "Team Analytics", icon: BarChart3, path: "/manager/analytics" },
];

const QUARTERS = [
  { value: "Q1", label: "Q1", sub: "July" },
  { value: "Q2", label: "Q2", sub: "October" },
  { value: "Q3", label: "Q3", sub: "January" },
  { value: "Q4", label: "Q4", sub: "March / April" },
];

const STATUS_META = {
  "Not Started": { icon: Circle, color: "#9aaac8", bg: "#f4f7ff" },
  "On Track":    { icon: TrendingUp, color: "#10b981", bg: "#d1fae5" },
  "Completed":   { icon: CheckCircle2, color: "#1b4fff", bg: "#eef2ff" },
};

function ManagerCheckins() {
  const [quarter, setQuarter] = useState("Q1");
  const [checkins, setCheckins] = useState([]);
  const [comments, setComments] = useState({});
  const [saving, setSaving] = useState({});
  const [expanded, setExpanded] = useState({});
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTeamCheckins = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/checkins/manager/team?quarter=${quarter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCheckins(res.data);
    } catch {
      alert("Failed to fetch team check-ins");
    }
  };

  useEffect(() => { fetchTeamCheckins(); }, [quarter]);

  const submitComment = async (checkinId) => {
    setSaving((s) => ({ ...s, [checkinId]: true }));
    try {
      await axios.put(
        `http://localhost:5000/api/checkins/manager/comment/${checkinId}`,
        { managerComment: comments[checkinId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTeamCheckins();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add comment");
    }
    setSaving((s) => ({ ...s, [checkinId]: false }));
  };

  const toggleExpand = (id) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  const groupedByEmployee = checkins.reduce((acc, item) => {
    const name = item.employee?.name || "Unknown";
    if (!acc[name]) acc[name] = [];
    acc[name].push(item);
    return acc;
  }, {});

  const totalEmployees = Object.keys(groupedByEmployee).length;
  const reviewed = checkins.filter((c) => c.isManagerReviewed).length;

  return (
    <div style={S.layout}>
      <Sidebar navItems={navItems} role="manager" />

      <main style={S.main}>
        {/* Topbar */}
        <div style={S.topbar}>
          <div>
            <h1 style={S.pageTitle}>Quarterly Check-ins</h1>
            <p style={S.pageSubtitle}>Review team progress and add your comments</p>
          </div>
          <div style={{ ...S.avatar, background: "#0ea5e9" }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Quarter Selector */}
        <div style={S.quarterRow}>
          {QUARTERS.map((q) => (
            <div
              key={q.value}
              onClick={() => setQuarter(q.value)}
              style={{ ...S.quarterCard, ...(quarter === q.value ? S.quarterActive : {}) }}
            >
              <div style={{ ...S.quarterLabel, color: quarter === q.value ? "#0ea5e9" : "#0f1f5c" }}>
                {q.label}
              </div>
              <div style={S.quarterSub}>{q.sub}</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={S.statsRow}>
          {[
            { label: "Employees", value: totalEmployees, color: "#0ea5e9" },
            { label: "Total Check-ins", value: checkins.length, color: "#1b4fff" },
            { label: "Reviewed", value: reviewed, color: "#10b981" },
            { label: "Pending Review", value: checkins.length - reviewed, color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} style={S.statCard}>
              <div style={{ ...S.statValue, color: s.color }}>{s.value}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Empty */}
        {Object.keys(groupedByEmployee).length === 0 && (
          <div style={S.emptyState}>
            <MessageSquare size={40} color="#c7d2fe" />
            <p style={{ color: "#6b7a99", marginTop: "12px" }}>No check-ins submitted for {quarter}.</p>
          </div>
        )}

        {/* Employee Groups */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {Object.entries(groupedByEmployee).map(([empName, empCheckins]) => {
            const completedCount = empCheckins.filter(c => c.progressStatus === "Completed").length;

            return (
              <div key={empName} style={S.empCard}>
                {/* Employee header */}
                <div style={S.empHeader}>
                  <div style={S.empRow}>
                    <div style={S.empAvatar}>{empName.charAt(0).toUpperCase()}</div>
                    <div>
                      <div style={S.empName}>{empName}</div>
                      <div style={S.empSub}>{empCheckins.length} goals · {quarter}</div>
                    </div>
                  </div>
                  <div style={S.empProgressWrap}>
                    <div style={S.empProgressBg}>
                      <div style={{
                        ...S.empProgressFill,
                        width: `${(completedCount / empCheckins.length) * 100}%`,
                      }} />
                    </div>
                    <span style={S.empProgressLabel}>
                      {completedCount}/{empCheckins.length} completed
                    </span>
                  </div>
                </div>

                {/* Checkin rows */}
                <div style={{ padding: "0 4px 8px" }}>
                  {empCheckins.map((checkin) => {
                    const meta = STATUS_META[checkin.progressStatus] || STATUS_META["Not Started"];
                    const score = Number(checkin.progressScore || 0);
                    const isExpanded = expanded[checkin.id];
                    const alreadyCommented = !!checkin.managerComment;

                    return (
                      <div key={checkin.id} style={C.card}>
                        {/* Row summary */}
                        <div style={C.summary} onClick={() => toggleExpand(checkin.id)}>
                          <div style={C.summaryLeft}>
                            <div style={C.goalTitle}>{checkin.Goal?.title}</div>
                            <div style={C.tagRow}>
                              <span style={C.tag}>{checkin.Goal?.thrustArea}</span>
                              <span style={{ ...C.statusPill, background: meta.bg, color: meta.color }}>
                                <meta.icon size={11} />
                                {checkin.progressStatus}
                              </span>
                              {alreadyCommented && (
                                <span style={{ ...C.tag, background: "#d1fae5", color: "#059669", border: "none" }}>
                                  ✓ Reviewed
                                </span>
                              )}
                            </div>
                          </div>
                          <div style={C.summaryRight}>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ ...C.score, color: score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444" }}>
                                {score.toFixed(1)}%
                              </div>
                              <div style={C.scoreLabel}>progress score</div>
                            </div>
                            <ChevronDown size={16} color="#9aaac8" style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                          </div>
                        </div>

                        {/* Expanded detail */}
                        {isExpanded && (
                          <div style={C.detail}>
                            {/* Data grid */}
                            <div style={C.dataGrid}>
                              {[
                                { label: "Planned Target", value: checkin.plannedTarget },
                                { label: "Actual Achievement", value: checkin.actualAchievement },
                                { label: "Progress Score", value: `${score.toFixed(2)}%` },
                                { label: "Manager Reviewed", value: checkin.isManagerReviewed ? "Yes" : "Not yet" },
                              ].map((d) => (
                                <div key={d.label} style={C.dataItem}>
                                  <div style={C.dataLabel}>{d.label}</div>
                                  <div style={C.dataValue}>{d.value || "—"}</div>
                                </div>
                              ))}
                            </div>

                            {/* Comments side by side */}
                            <div style={C.commentsRow}>
                              {checkin.employeeComment && (
                                <div style={C.commentBox}>
                                  <div style={C.commentLabel}>Employee comment</div>
                                  <p style={C.commentText}>{checkin.employeeComment}</p>
                                </div>
                              )}
                              {alreadyCommented && (
                                <div style={{ ...C.commentBox, background: "#eef2ff", borderColor: "#c7d2fe" }}>
                                  <div style={{ ...C.commentLabel, color: "#1b4fff" }}>Your comment</div>
                                  <p style={C.commentText}>{checkin.managerComment}</p>
                                </div>
                              )}
                            </div>

                            {/* Comment input */}
                            <div style={C.commentInputWrap}>
                              <label style={C.fieldLabel}>
                                {alreadyCommented ? "Update your comment" : "Add manager comment"}
                              </label>
                              <textarea
                                placeholder="Write structured feedback on this goal's progress..."
                                value={comments[checkin.id] ?? (checkin.managerComment || "")}
                                onChange={(e) => setComments({ ...comments, [checkin.id]: e.target.value })}
                                style={C.textarea}
                                rows={3}
                              />
                              <button
                                onClick={() => submitComment(checkin.id)}
                                disabled={saving[checkin.id]}
                                style={C.saveBtn}
                              >
                                <Send size={14} />
                                {saving[checkin.id] ? "Saving..." : alreadyCommented ? "Update Comment" : "Save Comment"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
  avatar: { width: "38px", height: "38px", borderRadius: "10px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "15px" },

  quarterRow: { display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" },
  quarterCard: { padding: "12px 24px", border: "1.5px solid #e2e8f5", borderRadius: "12px", cursor: "pointer", background: "#fff", textAlign: "center", minWidth: "90px", transition: "all 0.15s" },
  quarterActive: { border: "1.5px solid #0ea5e9", background: "#e0f2fe" },
  quarterLabel: { fontSize: "16px", fontWeight: "700" },
  quarterSub: { fontSize: "12px", color: "#9aaac8", marginTop: "2px" },

  statsRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "24px" },
  statCard: { background: "#fff", border: "1.5px solid #e2e8f5", borderRadius: "12px", padding: "16px 20px" },
  statValue: { fontSize: "28px", fontWeight: "700", lineHeight: 1, marginBottom: "4px" },
  statLabel: { fontSize: "13px", color: "#6b7a99", fontWeight: "500" },

  emptyState: { textAlign: "center", padding: "60px 0" },

  empCard: { background: "#fff", border: "1.5px solid #e2e8f5", borderRadius: "16px", overflow: "hidden" },
  empHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderBottom: "1px solid #f0f4ff", flexWrap: "wrap", gap: "12px" },
  empRow: { display: "flex", alignItems: "center", gap: "12px" },
  empAvatar: { width: "40px", height: "40px", borderRadius: "10px", background: "#e0f2fe", color: "#0ea5e9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "16px" },
  empName: { fontSize: "15px", fontWeight: "700", color: "#0f1f5c" },
  empSub: { fontSize: "12px", color: "#9aaac8", marginTop: "1px" },
  empProgressWrap: { display: "flex", alignItems: "center", gap: "10px" },
  empProgressBg: { width: "120px", height: "6px", background: "#e0f2fe", borderRadius: "99px", overflow: "hidden" },
  empProgressFill: { height: "100%", background: "#0ea5e9", borderRadius: "99px", transition: "width 0.3s" },
  empProgressLabel: { fontSize: "12px", fontWeight: "600", color: "#6b7a99", whiteSpace: "nowrap" },
};

const C = {
  card: { border: "1px solid #f0f4ff", borderRadius: "12px", margin: "10px 16px", overflow: "hidden" },
  summary: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", cursor: "pointer", background: "#fafbff" },
  summaryLeft: { flex: 1, minWidth: 0 },
  summaryRight: { display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 },
  goalTitle: { fontSize: "14px", fontWeight: "700", color: "#0f1f5c", marginBottom: "6px" },
  tagRow: { display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" },
  tag: { fontSize: "11px", fontWeight: "600", padding: "3px 9px", borderRadius: "20px", background: "#f4f7ff", color: "#6b7a99", border: "1px solid #e2e8f5" },
  statusPill: { display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: "700", padding: "3px 9px", borderRadius: "20px" },
  score: { fontSize: "18px", fontWeight: "700", lineHeight: 1 },
  scoreLabel: { fontSize: "11px", color: "#9aaac8" },

  detail: { background: "#fff", borderTop: "1px solid #f0f4ff", padding: "16px" },
  dataGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "16px" },
  dataItem: { background: "#f4f7ff", borderRadius: "10px", padding: "12px 14px" },
  dataLabel: { fontSize: "11px", fontWeight: "700", color: "#9aaac8", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "4px" },
  dataValue: { fontSize: "14px", fontWeight: "700", color: "#0f1f5c" },

  commentsRow: { display: "flex", gap: "12px", marginBottom: "14px", flexWrap: "wrap" },
  commentBox: { flex: 1, minWidth: "200px", background: "#f4f7ff", border: "1px solid #e2e8f5", borderRadius: "10px", padding: "12px 14px" },
  commentLabel: { fontSize: "11px", fontWeight: "700", color: "#9aaac8", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "6px" },
  commentText: { fontSize: "13px", color: "#0f1f5c", lineHeight: 1.5, margin: 0 },

  fieldLabel: { display: "block", fontSize: "12px", fontWeight: "700", color: "#3d4f7c", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "6px" },
  commentInputWrap: {},
  textarea: { width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f5", borderRadius: "10px", fontSize: "14px", color: "#0f1f5c", fontFamily: "'Segoe UI', sans-serif", boxSizing: "border-box", outline: "none", resize: "vertical" },
  saveBtn: { display: "flex", alignItems: "center", gap: "7px", marginTop: "10px", padding: "9px 18px", border: "none", borderRadius: "10px", background: "#0ea5e9", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" },
};

export default ManagerCheckins;