/**
 * utils/activityLogger.js
 * Tracks recent activities per logged-in user in localStorage.
 */

function parseActivities(key) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    localStorage.removeItem(key);
    return [];
  }
}

export function logActivity(userId, actionText) {
  if (!userId) return;
  const key = `activities_${userId}`;
  const activities = parseActivities(key);

  const newActivity = {
    id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text: actionText,
    timestamp: new Date().toISOString(),
  };

  const updated = [newActivity, ...activities].slice(0, 15);
  localStorage.setItem(key, JSON.stringify(updated));

  window.dispatchEvent(new Event("activity-updated"));
}

export function getActivities(userId) {
  if (!userId) return [];
  return parseActivities(`activities_${userId}`);
}

export function clearActivities(userId) {
  if (!userId) return;
  localStorage.removeItem(`activities_${userId}`);
  window.dispatchEvent(new Event("activity-updated"));
}
