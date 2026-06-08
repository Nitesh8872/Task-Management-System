import "./PageErrorBanner.css";

function PageErrorBanner({ message, onRetry }) {
  return (
    <div className="page-error-banner" role="alert">
      <div className="page-error-content">
        <span className="page-error-icon" aria-hidden="true">⚠️</span>
        <p>{message}</p>
      </div>
      {onRetry && (
        <button type="button" className="page-error-retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default PageErrorBanner;
