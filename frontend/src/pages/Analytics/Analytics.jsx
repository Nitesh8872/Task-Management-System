import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllTasks } from "../../services/api";
import { TASK_STATUS } from "../../utils/taskStatus";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import StatCard from "../../components/StatCard/StatCard";
import "./Analytics.css";

function Analytics() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getAllTasks(token);
        setTasks(data.tasks || []);
      } catch (err) {
        console.error("Failed to fetch analytics tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [token]);

  if (loading) {
    return (
      <div className="analytics-page">
        <p style={{ color: "var(--color-text-muted)" }}>Loading analytics...</p>
      </div>
    );
  }

  // Handle API response
  const tasksList = Array.isArray(tasks) ? tasks : [];

  // ── 1. Calculate Status Metrics ──
  const total = tasksList.length;
  const completed = tasksList.filter((t) => t.status === TASK_STATUS.COMPLETED).length;
  const inProgress = tasksList.filter((t) => t.status === TASK_STATUS.IN_PROGRESS).length;
  const pending = tasksList.filter((t) => t.status === TASK_STATUS.PENDING).length;

  const statusData = [
    { name: "Pending", value: pending, color: "#f59e0b" },
    { name: "In Progress", value: inProgress, color: "#06b6d4" },
    { name: "Completed", value: completed, color: "#10b981" },
  ].filter((d) => d.value > 0);

  // ── 2. Calculate Category Metrics ──
  const work = tasks.filter((t) => t.category === "work").length;
  const study = tasks.filter((t) => t.category === "study").length;
  const personal = tasks.filter((t) => t.category === "personal").length;

  const categoryData = [
    { name: "Work", count: work, color: "#2563eb" },
    { name: "Study", count: study, color: "#8b5cf6" },
    { name: "Personal", count: personal, color: "#ec4899" },
  ];

  // ── 3. Calculate Priority Metrics ──
  const high = tasks.filter((t) => t.priority === "high").length;
  const medium = tasks.filter((t) => t.priority === "medium").length;
  const low = tasks.filter((t) => t.priority === "low").length;

  const priorityData = [
    { name: "High", count: high, color: "#ef4444" },
    { name: "Medium", count: medium, color: "#f59e0b" },
    { name: "Low", count: low, color: "#10b981" },
  ];

  // ── 4. Calculate Productivity Rate ──
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Custom tooltips
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          padding: "10px 14px",
          borderRadius: "8px",
          boxShadow: "var(--shadow-card)",
          fontSize: "13px"
        }}>
          <p style={{ margin: 0, fontWeight: 700, color: "var(--color-text-heading)" }}>{payload[0].name}</p>
          <p style={{ margin: "4px 0 0 0", color: "var(--color-primary)", fontWeight: 600 }}>
            Count: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>Analytics Overview</h1>
        <p>Analyze details regarding your productivity and task distributions.</p>
      </div>

      {/* Summary Row */}
      <div className="analytics-summary-cards">
        <StatCard
          title="Productivity Score"
          value={`${completionRate}%`}
          icon="🎯"
          type="primary"
          description="Completed ÷ Total × 100"
        />
        <StatCard
          title="Completed Tasks"
          value={completed}
          icon="✅"
          type="success"
          description="Tasks marked completed"
        />
        <StatCard
          title="In Progress Tasks"
          value={inProgress}
          icon="⏳"
          type="info"
          description="Tasks actively in progress"
        />
        <StatCard
          title="Total Tasks"
          value={total}
          icon="📋"
          type="warning"
          description="All tasks registered"
        />
      </div>

      {/* Charts Layout */}
      {total === 0 ? (
        <div className="chart-card" style={{ textAlign: "center", padding: "50px 20px" }}>
          <h2>No Data Available</h2>
          <p style={{ color: "var(--color-text-muted)" }}>Please add some tasks to visualize metrics.</p>
        </div>
      ) : (
        <div className="analytics-grid">
          {/* Status Breakdown (Pie Chart) */}
          <div className="chart-card">
            <h2>Task Status Breakdown</h2>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Distribution (Bar Chart) */}
          <div className="chart-card">
            <h2>Priority Distribution</h2>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} allowDecimals={false} />
                  <Tooltip cursor={{ fill: "var(--color-bg)", opacity: 0.4 }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tasks By Category (Horizontal Bar Chart) */}
          <div className="chart-card chart-card-full">
            <h2>Tasks Distribution by Category</h2>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                >
                  <XAxis type="number" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} />
                  <Tooltip cursor={{ fill: "var(--color-bg)", opacity: 0.4 }} />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
