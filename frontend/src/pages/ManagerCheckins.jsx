import { useEffect, useState } from "react";
import axios from "axios";

function ManagerCheckins() {
  const [quarter, setQuarter] = useState("Q1");
  const [checkins, setCheckins] = useState([]);
  const [comments, setComments] = useState({});

  const token = localStorage.getItem("token");

  const fetchTeamCheckins = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/checkins/manager/team?quarter=${quarter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCheckins(res.data);
    } catch (error) {
      alert("Failed to fetch team check-ins");
    }
  };

  useEffect(() => {
    fetchTeamCheckins();
  }, [quarter]);

  const submitManagerComment = async (checkinId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/checkins/manager/comment/${checkinId}`,
        {
          managerComment: comments[checkinId],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      fetchTeamCheckins();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add comment");
    }
  };

  const groupedByEmployee = checkins.reduce((acc, item) => {
    const employeeName = item.employee?.name || "Unknown Employee";

    if (!acc[employeeName]) {
      acc[employeeName] = [];
    }

    acc[employeeName].push(item);
    return acc;
  }, {});

  return (
    <div style={{ padding: "30px", background: "#f5f7fb", minHeight: "100vh" }}>
      <h2>Manager Quarterly Check-ins</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Select Quarter: </label>
        <select value={quarter} onChange={(e) => setQuarter(e.target.value)}>
          <option value="Q1">Q1 - July</option>
          <option value="Q2">Q2 - October</option>
          <option value="Q3">Q3 - January</option>
          <option value="Q4">Q4 - March/April</option>
        </select>
      </div>

      {Object.keys(groupedByEmployee).length === 0 && (
        <p>No check-ins submitted for this quarter.</p>
      )}

      {Object.keys(groupedByEmployee).map((employeeName) => (
        <div
          key={employeeName}
          style={{
            background: "white",
            padding: "20px",
            marginBottom: "25px",
            borderRadius: "14px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          }}
        >
          <h3>{employeeName}</h3>

          {groupedByEmployee[employeeName].map((checkin) => (
            <div
              key={checkin.id}
              style={{
                borderTop: "1px solid #ddd",
                paddingTop: "15px",
                marginTop: "15px",
              }}
            >
              <h4>{checkin.Goal?.title}</h4>

              <p>
                <b>Thrust Area:</b> {checkin.Goal?.thrustArea}
              </p>

              <p>
                <b>Planned Target:</b> {checkin.plannedTarget}
              </p>

              <p>
                <b>Actual Achievement:</b> {checkin.actualAchievement}
              </p>

              <p>
                <b>Status:</b> {checkin.progressStatus}
              </p>

              <p>
                <b>Progress Score:</b>{" "}
                {Number(checkin.progressScore).toFixed(2)}%
              </p>

              <p>
                <b>Employee Comment:</b>{" "}
                {checkin.employeeComment || "No comment"}
              </p>

              <p>
                <b>Manager Reviewed:</b>{" "}
                {checkin.isManagerReviewed ? "Yes" : "No"}
              </p>

              {checkin.managerComment && (
                <p>
                  <b>Manager Comment:</b> {checkin.managerComment}
                </p>
              )}

              <textarea
                style={inputStyle}
                placeholder="Add structured check-in comment"
                value={comments[checkin.id] || ""}
                onChange={(e) =>
                  setComments({
                    ...comments,
                    [checkin.id]: e.target.value,
                  })
                }
              />

              <button
                style={buttonStyle}
                onClick={() => submitManagerComment(checkin.id)}
              >
                Save Manager Comment
              </button>
            </div>
          ))}
        </div>
      ))}
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
  marginTop: "10px",
  padding: "10px 18px",
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default ManagerCheckins;