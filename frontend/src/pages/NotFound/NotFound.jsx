import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <span className="not-found-code">404</span>
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist or has been moved.</p>
        <div className="not-found-actions">
          <Link to="/dashboard" className="not-found-btn primary">
            Go to Dashboard
          </Link>
          <Link to="/login" className="not-found-btn secondary">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
