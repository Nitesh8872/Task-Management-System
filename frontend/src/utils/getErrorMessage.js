import { API_CONFIG } from "../services/api";

/**
 * Extract a user-facing message from an Axios / fetch error.
 */
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;

  const isBrowser = typeof window !== `undefined`;
  const onDeployedFrontend =
    isBrowser &&
    !window.location.hostname.includes(`localhost`) &&
    !window.location.hostname.includes(`127.0.0.1`);

  const apiPointsToLocalhost =
    API_CONFIG.root.includes(`localhost`) || API_CONFIG.root.includes(`127.0.0.1`);

  if (error.code === "ECONNABORTED") {
    return "Request timed out. The server may be starting up — please try again.";
  }

  if (error.code === "ERR_NETWORK" || !error.response) {
    if (onDeployedFrontend && apiPointsToLocalhost) {
      return "App is misconfigured: API URL points to localhost. Set VITE_API_URL in Netlify and redeploy.";
    }
    return `Cannot reach the API server (${API_CONFIG.base}). Check that the backend is running and try again.`;
  }

  const msg = error.response?.data?.message;
  if (msg) return msg;

  switch (error.response?.status) {
    case 400:
      return "Invalid request. Please check your input.";
    case 401:
      return "Invalid email or password.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "API endpoint not found. Verify VITE_API_URL is the server root (not /api/users).";
    case 500:
      return "Server error. Please try again later.";
    case 502:
    case 503:
    case 504:
      return "Backend is temporarily unavailable. Please try again in a moment.";
    default:
      return fallback;
  }
}
