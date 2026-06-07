/**
 * utils/activityLogger.js
 * Tracks recent activities per logged-in user in localStorage.
 */

export function logActivity(userId, actionText) {
  if (!userId) return;
  const key = `activities_${userId}`;
  const saved = localStorage.getItem(key);
  const activities = saved ? JSON.parse(saved) : [];

  const newActivity = {
    id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text: actionText,
    timestamp: new Date().toISOString(),
  };

  const updated = [newActivity, ...activities].slice(0, 15); // keep last 15
  localStorage.setItem(key, JSON.stringify(updated));
  
  // Dispatch a custom event to notify other parts of the app
  window.dispatchEvent(new Event("activity-updated"));
}

export function getActivities(userId) {
  if (!userId) return [];
  const key = `activities_${userId}`;
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : [];
}

export function clearActivities(userId) {
  if (!userId) return;
  localStorage.removeItem(`activities_${userId}`);
  window.dispatchEvent(new Event("activity-updated"));
}
