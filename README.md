# 🚀 TaskHub - Advanced Task Management System

TaskHub is a modern full-stack task management application built using the MERN Stack (MongoDB, Express.js, React.js, and Node.js).

Built a full-stack productivity management platform with authentication, task tracking, analytics dashboard, calendar visualization, Kanban board, dark mode, notifications, and activity monitoring using the MERN stack

The application helps users organize tasks, track productivity, manage deadlines, visualize progress, and monitor work through an intuitive dashboard experience.

---

# ✨ Features

# 🎯 Core Features

These features form the foundation of the TaskHub platform.

## Authentication & Security

✅ User Registration

✅ User Login

✅ JWT Authentication

✅ Protected Routes

✅ User-Specific Data Access

✅ Secure Password Hashing using bcryptjs

---

## Task Management

✅ Create Tasks

✅ View Tasks

✅ Update Tasks

✅ Delete Tasks

✅ Mark Tasks as Completed

✅ Task Status Management

✅ Due Date Management

---

## Search & Filtering

✅ Search Tasks

✅ Filter by Status

✅ Filter by Category

✅ Filter by Priority

✅ Sort Tasks

---

## Task Organization

✅ Priority Levels (Low / Medium / High)

✅ Categories (Work / Study / Personal)

✅ Task Status Tracking

✅ Responsive Task Interface

---

# 🌟 Additional Features

These features were implemented to improve productivity, usability, and user experience.

## Dashboard Module

✅ Productivity Overview

✅ Total Tasks Statistics

✅ Due Today Statistics

✅ Overdue Tasks Statistics

✅ Completed Tasks Statistics

✅ Productivity Progress Tracking

✅ Quick Add Task

✅ Upcoming Milestones

✅ Recent Activity Feed

---

## Advanced Task Workspace

### List View

✅ Modern Task Cards

✅ Priority Badges

✅ Category Badges

✅ Due Date Indicators

### Board View

✅ Kanban Workflow

✅ Todo Column

✅ In Progress Column

✅ Completed Column

---

## Analytics Dashboard

✅ Productivity Score

✅ Task Status Breakdown

✅ Priority Distribution

✅ Category Distribution

✅ Completion Metrics

✅ Interactive Charts using Recharts

---

## Calendar Module

✅ Monthly Calendar View

✅ Due Date Visualization

✅ Upcoming Deadline Tracking

✅ Month Navigation

---

## Profile Management

✅ User Profile Overview

✅ Account Information

✅ Password Management Interface

✅ Account Status Display

---

## User Experience Enhancements

✅ Dark Mode

✅ Notification System

✅ Activity Logging

✅ Responsive Design

✅ Modern Dashboard UI

✅ Reusable React Components

✅ Context API State Management

---

# 🛠 Tech Stack

## Frontend

* React.js
* React Router DOM
* Axios
* Context API
* Recharts
* CSS3

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* dotenv

---

# 📁 Project Structure

```text
TaskHub/

├── backend/
│
│   ├── src/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── userController.js
│   │   └── taskController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── user.js
│   │   └── task.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│
│   ├── public/
│   │
│   ├── src/
│   │
│   ├── components/
│   │   ├── ActivityList/
│   │   ├── Navbar/
│   │   ├── Sidebar/
│   │   ├── StatCard/
│   │   ├── TaskBoard/
│   │   ├── TaskCard/
│   │   ├── TaskForm/
│   │   ├── TaskList/
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── NotificationContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── layouts/
│   │   └── DashboardLayout.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── TasksPage/
│   │   ├── Analytics/
│   │   ├── Calendar/
│   │   ├── Profile/
│   │   ├── Login/
│   │   └── Register/
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── styles/
│   │   ├── variables.css
│   │   ├── app.css
│   │   └── index.css
│   │
│   ├── utils/
│   │   ├── activityLogger.js
│   │   └── formatters.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .gitignore
├── README.md
└── package.json
```

---

# ⚙ Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

# 📦 Installation

## Backend

```bash
cd backend

npm install

npm run dev
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🔐 Authentication Flow

```text
Register User
      ↓
Login
      ↓
Generate JWT
      ↓
Store Token
      ↓
Protected Routes
      ↓
Authorized Access
```

---

# 📡 API Endpoints

## Authentication

### Register

```http
POST /api/users/register
```

### Login

```http
POST /api/users/login
```

---

## Tasks

### Get Tasks

```http
GET /api/tasks
```

### Create Task

```http
POST /api/tasks
```

### Update Task

```http
PUT /api/tasks/:id
```

### Delete Task

```http
DELETE /api/tasks/:id
```

---

# 📈 Current Project Status

### Backend

✅ MongoDB Integration

✅ REST APIs

✅ JWT Authentication

✅ Protected Routes

✅ CRUD Operations

✅ User-Specific Task Access

### Frontend

✅ Authentication Pages

✅ Dashboard

✅ Task Management Workspace

✅ Kanban Board View

✅ Analytics Dashboard

✅ Calendar Module

✅ Profile Page

✅ Dark Mode

✅ Responsive Design

✅ Notification System

✅ Activity Tracking

---

# 🚀 Future Roadmap

* Drag & Drop Kanban Board
* Email Notifications
* Team Collaboration
* Task Comments
* File Attachments
* Reminder Scheduling
* Export Reports (PDF / Excel)
* Pagination
* Cloud Deployment
* Mobile Application

---

# 📸 Application Modules

### Dashboard

* Productivity Overview
* Quick Task Creation
* Upcoming Milestones
* Activity Feed

### Task Workspace

* List View
* Board View
* Search & Filters

### Analytics

* Charts & Productivity Insights

### Calendar

* Monthly Planning Interface

### Profile

* Account Settings & User Information

---

# 👨‍💻 Author

**Nitesh Sukhwal**

MERN Stack Developer

GitHub: https://github.com/your-github-username

---

⭐ If you found this project useful, consider giving it a star.
