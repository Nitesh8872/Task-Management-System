# 📋 TaskHub — MERN Stack Task Management System

> TaskHub is a modern full-stack Task Management System built with MongoDB, Express.js, React.js, and Node.js. It provides secure user authentication, task creation and management, advanced filtering, Kanban board drag-and-drop functionality, calendar scheduling, and real-time analytics dashboards. The application is fully responsive and deployed using Netlify, Railway, and MongoDB Atlas.

---

## 🖥️ Live Preview

> Frontend (Netlify):
https://tranquil-baklava-d4d3eb.netlify.app

> Backend API (Railway):
https://task-management-system-production-0d38.up.railway.app/


---

## ✨ Features

### 🔐 Core Features (from Assignment)

| Feature | Description |
|---|---|
| **User Registration & Login** | Secure sign-up and login with JWT-based authentication |
| **Create Tasks** | Add tasks with title, description, due date, priority & category |
| **Update Tasks** | Edit any task's details inline via a modal |
| **Delete Tasks** | Remove tasks permanently from the workspace |
| **Toggle Task Status** | Mark tasks as `Pending → In Progress → Completed` |
| **RESTful API** | Backend exposes clean REST endpoints for all CRUD operations |
| **JWT Auth Middleware** | All task routes are protected — only authenticated users can access |
| **Form Validation** | Frontend and API-level validation for all inputs |

---

### 🚀 Additional Features (Self-Added)

| Feature | Description |
|---|---|
| **📊 Analytics Dashboard** | Interactive charts (Recharts) showing task breakdown by status, priority, category, and completion trend |
| **📅 Task Calendar View** | Monthly calendar view with tasks pinned to their due dates, color-coded by priority |
| **🗂️ Kanban Board (Drag & Drop)** | Drag tasks between `Pending`, `In Progress`, and `Completed` columns using `@hello-pangea/dnd` |
| **📋 Task List View** | Filterable table view with search and status filters |
| **🔔 Notification System** | Toast-style notifications for every task action (create, update, delete, complete) |
| **⏰ Due-Date Alerts** | Auto-detects overdue tasks and tasks due today on the dashboard |
| **📈 Workspace Progress Bar** | Visual completion percentage meter on the dashboard |
| **🗓️ Upcoming Milestones Widget** | Dashboard widget listing the next 3 upcoming non-completed tasks sorted by due date |
| **📜 Activity Logger** | Tracks per-user activity history in `localStorage` (last 15 actions) with live updates |
| **👤 Account Center (Profile Page)** | Full profile management: update name, change avatar, change password with strength meter |
| **🗑️ Delete Account** | Danger zone — permanently deletes account with type-to-confirm modal |
| **🖼️ Avatar Upload** | Upload a profile photo stored in `localStorage` (< 1.5 MB) |
| **🎯 Productivity Stats** | Per-user stats: total tasks, completed, pending, completion rate % |
| **📐 Priority & Category Tags** | Tasks tagged with `Low / Medium / High` priority and `Work / Study / Personal` category |
| **🔒 Protected Routes** | React-side route guard redirects unauthenticated users to login |
| **📱 Responsive Design** | Mobile-friendly layout using CSS Grid and media queries |
| **🌙 Dark-themed UI** | Premium dark-mode design system with glassmorphism cards and smooth animations |
| **📊 Server-side Pagination** | Paginated task rendering (9 tasks/page) to handle high volumes of tasks efficiently |
| **🔍 Backend Search** | Case-insensitive keyword search on task titles performed directly in the database |
| **🎛️ Backend Filtering** | Database-level task filtering by status, priority level, and categories |
| **🔃 Backend Sorting** | Sorting options by newest first, oldest first, due dates, and status at the database layer |

---

## 🗂️ Project Structure

```
Task Management System/
├── backend/
│   ├── src/
│   │   ├── config/         # MongoDB connection
│   │   ├── constants/      # Shared constants
│   │   ├── controllers/    # Route logic (userController, taskController)
│   │   ├── middleware/      # JWT auth middleware
│   │   ├── models/         # Mongoose schemas (User, Task)
│   │   ├── routes/         # Express routers (userRoutes, taskRoutes)
│   │   └── server.js       # App entry point
│   ├── .env                # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI (Navbar, Sidebar, TaskCard, TaskModal, StatCard…)
    │   ├── context/        # React Contexts (AuthContext, NotificationContext)
    │   ├── layouts/        # App layout wrapper
    │   ├── pages/          # Page components
    │   │   ├── Login/
    │   │   ├── Register/
    │   │   ├── Dashboard/
    │   │   ├── TasksPage/
    │   │   ├── Analytics/
    │   │   ├── Calendar/
    │   │   └── Profile/
    │   ├── services/       # Axios API service layer (api.js)
    │   ├── styles/         # Global CSS design system
    │   └── utils/          # Helpers (activityLogger, formatters, taskStatus)
    ├── index.html
    └── package.json
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router v7, Vite 8 |
| **State Management** | React Context API (Auth + Notifications) |
| **Charts** | Recharts |
| **Drag & Drop** | @hello-pangea/dnd |
| **HTTP Client** | Axios |
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JWT (jsonwebtoken) + bcryptjs |
| **Dev Server** | Nodemon |

---

## 🔧 Engineering Improvements & Stability Enhancements

Beyond the assignment requirements, the application underwent several stability, security, and data-consistency improvements during development:

### Reliability Fixes

* Resolved runtime crashes in Dashboard, Analytics, Calendar, and Profile pages caused by incorrect handling of paginated API responses.
* Fixed data-loading issues to ensure analytics, calendar events, and productivity metrics always use complete task datasets rather than paginated subsets.
* Improved frontend defensive state handling to prevent invalid state access and rendering failures.

### Security Improvements

* Protected backend search functionality against malformed regular expression input and potential denial-of-service scenarios.
* Improved authentication middleware to safely handle deleted-user JWT sessions and prevent server-side failures from stale tokens.

### Data Integrity Improvements

* Fixed task update behavior to correctly support clearing optional fields such as descriptions and due dates.
* Corrected analytics calculations and dashboard metrics for users with more than nine tasks.
* Improved consistency between frontend state and backend task data across multiple views.

These improvements significantly increased application stability, security, and overall production readiness while preserving existing functionality.

---

## ⚙️ Setup & Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (local) **or** a MongoDB Atlas connection string
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Nitesh8872/Task-Management-System.git
cd "Task Management System"
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskmanagement
JWT_SECRET=your_super_secret_key_here
```

> 💡 Replace `MONGO_URI` with your MongoDB Atlas URI if you're not running MongoDB locally.
> 💡 Change `JWT_SECRET` to any long, random string for security.

Start the backend server:

```bash
# Development (auto-restarts on file changes)
npx nodemon src/server.js

# OR standard node
node src/server.js
```

The API will be running at: **http://localhost:5000**

---

### 3. Frontend Setup

Open a **new terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

The app will be running at: **http://localhost:5173**

---

## 🔌 API Endpoints

### Auth Routes — `/api/users`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/users/register` | Register a new user | ❌ |
| `POST` | `/api/users/login` | Login and receive JWT token | ❌ |
| `GET` | `/api/users/me` | Get current logged-in user | ✅ |
| `PUT` | `/api/users/profile` | Update profile (name / password) | ✅ |
| `DELETE` | `/api/users/profile` | Permanently delete account | ✅ |

### Task Routes — `/api/tasks`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/tasks` | Get all tasks for logged-in user | ✅ |
| `POST` | `/api/tasks` | Create a new task | ✅ |
| `PUT` | `/api/tasks/:id` | Update a task by ID | ✅ |
| `DELETE` | `/api/tasks/:id` | Delete a task by ID | ✅ |

**Query Parameters for `GET /api/tasks`:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | `Number` | `1` | Page number for server-side pagination |
| `limit` | `Number` | `9` | Number of tasks to return per page |
| `search` | `String` | `""` | Search term matched against task titles (case-insensitive) |
| `status` | `String` | `"all"` | Filter tasks by status (`pending`, `in-progress`, `completed`, or `all`) |
| `priority` | `String` | `"all"` | Filter tasks by priority (`low`, `medium`, `high`, or `all`) |
| `category` | `String` | `"all"` | Filter tasks by category (`work`, `study`, `personal`, or `all`) |
| `sort` | `String` | `"newest"` | Sort order (`newest`, `oldest`, `dueDate`, `status`) |

**Response Format for `GET /api/tasks`:**

```js
{
  "tasks": [
    {
      "_id": "60d0fe4f5311236168a109ca",
      "title": "Complete Project Proposal",
      "description": "Draft the final project scope and milestones",
      "status": "pending",
      "priority": "high",
      "category": "work",
      "dueDate": "2026-06-15T00:00:00.000Z",
      "user": "60d0fe4f5311236168a109c9",
      "createdAt": "2026-06-08T04:23:15.000Z",
      "updatedAt": "2026-06-08T04:23:15.000Z"
    }
  ],
  "page": 1,
  "limit": 9,
  "totalTasks": 1,
  "totalPages": 1
}
```

---

## 🗄️ Database Schema

### User Schema

```js
{
  name:      String  (required),
  email:     String  (required, unique),
  password:  String  (required, hashed with bcryptjs),
  createdAt: Date    (auto-generated)
}
```

### Task Schema

```js
{
  title:       String   (required),
  description: String   (default: ""),
  dueDate:     Date     (default: null),
  priority:    String   (enum: "low" | "medium" | "high", default: "medium"),
  category:    String   (enum: "work" | "study" | "personal", default: "personal"),
  status:      String   (enum: "pending" | "in-progress" | "completed", default: "pending"),
  user:        ObjectId (ref: User, required),
  createdAt:   Date     (auto-generated),
  updatedAt:   Date     (auto-generated)
}
```

---

## 📸 Pages Overview

| Page | Route | Description |
|---|---|---|
| Login | `/login` | JWT-based login form |
| Register | `/register` | User sign-up form |
| Dashboard | `/dashboard` | Stats, progress bar, upcoming milestones, activity log |
| Tasks | `/tasks` | List view + Kanban board with drag & drop |
| Analytics | `/analytics` | Charts: task status, priority, category breakdown |
| Calendar | `/calendar` | Monthly calendar with tasks pinned to due dates |
| Profile | `/profile` | Account management, avatar, password change |

**Tasks Page Workspace Capabilities:**
- **Layout Toggle:** Switch between a card grid list view and a Kanban board with drag-and-drop support (persisted via `localStorage`).
- **Interactive Modals:** Create new tasks or edit existing ones via inline modals with real-time updates.
- **Search & Filters:** Real-time query system allows filtering by title, status, priority, and category.
- **Sorting Options:** Sort tasks by newest first, oldest first, due date, or status.
- **Server-Side Pagination:** Quick navigation through paginated task sets (9 tasks per page).

---

## 🧪 Running in Production

### Build the frontend

```bash
cd frontend
npm run build
```

The optimized build will be in `frontend/dist/`.

### Serve with a static file server or reverse proxy (e.g., Nginx)

You can also serve the `dist/` folder directly from Express in production.

---

## 🛡️ Environment Variables Reference

| Variable | Location | Description |
|---|---|---|
| `PORT` | `backend/.env` | Port for Express server (default: 5000) |
| `MONGO_URI` | `backend/.env` | MongoDB connection string |
| `JWT_SECRET` | `backend/.env` | Secret key for signing JWT tokens |

---

## 👨‍💻 Author

**Nitesh Sukhwal**
- GitHub: [@Nitesh8872](https://github.com/Nitesh8872)

---

## 📄 License

This project was developed as a **MERN Stack Internship Assignment**.
Feel free to use it as a reference or learning resource.

---

> ⭐ If you found this project helpful, consider giving it a star on GitHub!
