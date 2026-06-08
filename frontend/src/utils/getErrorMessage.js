/**
 * Extract a user-facing message from an Axios / fetch error.
 */
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;

  if (error.code === "ERR_NETWORK" || !error.response) {
    return "Cannot connect to server. Check your internet connection and try again.";
  }

  if (error.code === "ECONNABORTED") {
    return "Request timed out. Please try again.";
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
      return "The requested resource was not found.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return fallback;
  }
}
