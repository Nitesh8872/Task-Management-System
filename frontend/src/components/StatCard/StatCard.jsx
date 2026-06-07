import "./StatCard.css";

function StatCard({ title, value, icon, type, description }) {
  return (
    <div className={`stat-card stat-${type}`}>
      <div className="stat-card-content">
        <div className="stat-card-info">
          <h3>{title}</h3>
          <p className="stat-value">{value}</p>
          {description && <p className="stat-description">{description}</p>}
        </div>
        <div className="stat-card-icon">
          <span>{icon}</span>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
