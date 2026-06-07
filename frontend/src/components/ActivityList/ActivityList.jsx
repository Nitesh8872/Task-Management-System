import { useEffect, useState } from "react";
import { getActivities } from "../../utils/activityLogger";
import "./ActivityList.css";

function ActivityList({ userId }) {
  const [activities, setActivities] = useState([]);

  const loadActivities = () => {
    setActivities(getActivities(userId));
  };

  useEffect(() => {
    loadActivities();
    
    // Listen for activity-updated event
    window.addEventListener("activity-updated", loadActivities);
    return () => {
      window.removeEventListener("activity-updated", loadActivities);
    };
  }, [userId]);

  // Format activity timestamp
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  return (
    <div className="activity-card">
      <div className="activity-header">
        <h2>Recent Activity</h2>
      </div>
      {activities.length === 0 ? (
        <div className="activity-empty">
          <span className="empty-emoji">📜</span>
          <p>No activity recorded yet.</p>
        </div>
      ) : (
        <ul className="activity-timeline">
          {activities.map((activity) => (
            <li key={activity.id} className="activity-item">
              <div className="activity-marker"></div>
              <div className="activity-details">
                <p className="activity-text">{activity.text}</p>
                <span className="activity-time">{formatTime(activity.timestamp)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ActivityList;
