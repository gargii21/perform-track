import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

function AnalyticsDashboard() {
  const [data, setData] = useState(null);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/analytics/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    } catch (error) {
      alert("Failed to load analytics");
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (!data) {
    return <h2 style={{ padding: "30px" }}>Loading analytics...</h2>;
  }

  const quarterData = data.quarterWiseProgress.map((item) => ({
    quarter: item.quarter,
    averageScore: Number(item.averageScore).toFixed(2),
  }));

  const uomData = data.uomDistribution.map((item) => ({
    name: item.uomType,
    count: Number(item.count),
  }));

  return (
    <div style={{ padding: "30px", background: "#f5f7fb", minHeight: "100vh" }}>
      <h1>Analytics Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "18px",
          marginTop: "25px",
        }}
      >
        <StatCard title="Employees" value={data.summary.totalEmployees} />
        <StatCard title="Managers" value={data.summary.totalManagers} />
        <StatCard title="Total Goals" value={data.summary.totalGoals} />
        <StatCard title="Check-ins" value={data.summary.totalCheckins} />
        <StatCard title="Average Progress" value={`${data.summary.averageProgress}%`} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "25px",
          marginTop: "30px",
        }}
      >
        <ChartCard title="Goal Status Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.goalStatusDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {data.goalStatusDistribution.map((_, index) => (
                  <Cell key={index} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Quarter-wise Average Progress">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={quarterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="averageScore" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="UoM Type Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={uomData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Manager Review Effectiveness">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.managerReviews}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="managerId" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalReviews" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      }}
    >
      <p style={{ color: "#666" }}>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      }}
    >
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default AnalyticsDashboard;