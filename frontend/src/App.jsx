import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";

import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import TasksPage from "./pages/TasksPage/TasksPage";
import Analytics from "./pages/Analytics/Analytics";
import Calendar from "./pages/Calendar/Calendar";
import Profile from "./pages/Profile/Profile";
import NotFound from "./pages/NotFound/NotFound";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/app.css";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              <Route
                path="/register"
                element={<Register />}
              />

              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <TasksPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Analytics />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Calendar />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Profile />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />

            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;