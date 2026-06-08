import { Component } from "react";
import "./ErrorBoundary.css";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled render error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-card">
            <span className="error-boundary-icon" aria-hidden="true">⚠️</span>
            <h1>Something went wrong</h1>
            <p>
              An unexpected error occurred. Please refresh the page or return to
              your dashboard.
            </p>
            <div className="error-boundary-actions">
              <button type="button" className="error-boundary-btn primary" onClick={this.handleReload}>
                Refresh Page
              </button>
              <button type="button" className="error-boundary-btn secondary" onClick={this.handleGoHome}>
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
