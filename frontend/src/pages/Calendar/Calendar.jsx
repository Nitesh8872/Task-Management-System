import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllTasks } from "../../services/api";
import { TASK_STATUS, TASK_STATUS_LABELS } from "../../utils/taskStatus";
import "./Calendar.css";

function Calendar() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getAllTasks(token);
        setTasks(data.tasks || []);
      } catch (err) {
        console.error("Failed to fetch calendar tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [token]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get month name
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Navigate month
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  if (loading) {
    return (
      <div className="calendar-page">
        <p style={{ color: "var(--color-text-muted)" }}>Loading calendar...</p>
      </div>
    );
  }
  // Handle API response
  const tasksList = Array.isArray(tasks) ? tasks : [];

  //Metrics Calculations
  // Get calendar days grid
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const startDayIndex = getFirstDayOfMonth(year, month); // Day of week (0-6)

  const calendarDays = [];

  // Empty cells at start
  for (let i = 0; i < startDayIndex; i++) {
    calendarDays.push({ key: `empty-${i}`, day: null, date: null });
  }

  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      key: `day-${d}`,
      day: d,
      date: new Date(year, month, d),
    });
  }

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    if (!date) return [];
    return tasksList.filter((t) => {
      if (!t.dueDate) return false;
      const dDate = new Date(t.dueDate);
      return (
        dDate.getDate() === date.getDate() &&
        dDate.getMonth() === date.getMonth() &&
        dDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <div className="calendar-title">
          <h1>Task Calendar</h1>
          <p>Visually plan and view your task milestones monthly.</p>
        </div>

        <div className="calendar-nav">
          <button onClick={prevMonth} className="cal-nav-btn" aria-label="Previous Month">◀</button>
          <h2>{monthNames[month]} {year}</h2>
          <button onClick={nextMonth} className="cal-nav-btn" aria-label="Next Month">▶</button>
        </div>
      </div>

      <div className="calendar-card">
        <div className="calendar-weekdays">
          {weekdays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays.map((cell) => {
            const dayTasks = getTasksForDate(cell.date);
            const todayClass = isToday(cell.date) ? "today" : "";
            const emptyClass = !cell.day ? "empty-day" : "";

            return (
              <div
                key={cell.key}
                className={`calendar-day ${todayClass} ${emptyClass}`}
              >
                {cell.day && (
                  <>
                    <span className="day-number">{cell.day}</span>
                    <div className="calendar-tasks">
                      {dayTasks.map((t) => (
                        <div
                          key={t._id}
                          className={`cal-task-item ${t.priority}-p ${t.status === TASK_STATUS.COMPLETED ? "completed-task" : ""
                            }`}
                          title={`${t.title} (${t.priority} priority — ${TASK_STATUS_LABELS[t.status] || t.status})`}
                        >
                          {t.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
