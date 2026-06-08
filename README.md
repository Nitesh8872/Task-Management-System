# TaskHub — Task Management System


> TaskHub is a modern full-stack Task Management System built with MongoDB, Express.js, React.js, and Node.js. It provides secure user authentication, task creation and management, advanced filtering, Kanban board drag-and-drop functionality, calendar scheduling, and real-time analytics dashboards. The application is fully responsive and deployed using Netlify, Railway, and MongoDB Atlas.

A full-stack task management web application built with the MERN stack. Users can register, authenticate securely, and manage personal tasks through a modern dashboard with list and Kanban views, analytics, calendar, and profile management.

**Live demo**

- Frontend: [tranquil-baklava-d4d3eb.netlify.app](https://tranquil-baklava-d4d3eb.netlify.app/login)
- Backend API: [task-management-system-production-0d38.up.railway.app](https://task-management-system-production-0d38.up.railway.app/)


---

## Technologies Used

| Layer | Stack |
|---|---|
| **Frontend** | React 19, React Router v7, Vite 8 |
| **UI & UX** | Custom CSS design system, CSS variables, responsive layouts |
| **State** | React Context API (Auth, Notifications, Theme) |
| **Charts** | Recharts |
| **Drag & Drop** | @hello-pangea/dnd |
| **HTTP** | Axios |
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT (`jsonwebtoken`), password hashing (`bcryptjs`) |
| **Dev tools** | Nodemon, ESLint |

---

## Features Implemented

### Authentication & Security

- User registration and login with JWT-based sessions
- Protected API routes and frontend route guards
- Session expiry handling with automatic redirect to login
- Profile updates (name, password) and account deletion

### Task Management

- Create, read, update, and delete tasks (full CRUD)
- Task fields: title, description, due date, priority, category, status
- Status workflow: `Pending` → `In Progress` → `Completed`
- Priority levels: Low, Medium, High
- Categories: Work, Study, Personal
- **Delete confirmation modal** — reusable, accessible dialog with loading state and toast feedback before permanent deletion

### Workspace & Views

- **Dashboard** — stats cards, completion progress bar, overdue/due-today alerts, upcoming milestones, activity log
- **Tasks page** — toggle between **List view** (card grid) and **Kanban board** (drag-and-drop columns)
- **Analytics** — charts for status, priority, category, and completion trends
- **Calendar** — monthly view with tasks on due dates, color-coded by priority
- **Profile** — avatar upload, password strength meter, account settings, delete-account flow

### Search, Filter & Pagination

- Server-side search on task titles
- Filter by status, priority, and category
- Sort by newest, oldest, due date, or status
- Paginated list view (9 tasks per page); board view loads full workspace set

### Notifications & Activity

- Toast notifications for create, update, delete, complete, and error states
- Due-date alerts for overdue and due-today tasks
- Per-user activity history (stored in `localStorage`)

### UI & Accessibility

- Light and dark theme toggle (persisted)
- Responsive layout for desktop and mobile
- Modal focus trap, keyboard navigation (Escape to close), and ARIA labels
- Smooth animations on modals and interactions

---

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- [Git](https://git-scm.com/)

### 1. Clone the repository

```bash
git clone https://github.com/Nitesh8872/Task-Management-System.git
cd "Task Management System"
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskmanagement
JWT_SECRET=your_super_secret_key_here
```

| Variable | Description |
|---|---|
| `PORT` | Express server port (default: `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |

Start the API:

```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

API runs at **http://localhost:5000**

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env` (optional — defaults to localhost):

```env
VITE_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

App runs at **http://localhost:5173**

### 4. Production build (frontend)

```bash
cd frontend
npm run build
```

Output is in `frontend/dist/`.

---

## Project Structure

```
Task Management System/
├── backend/
│   └── src/
│       ├── config/         # MongoDB connection
│       ├── constants/      # Shared constants
│       ├── controllers/    # User & task route handlers
│       ├── middleware/     # JWT auth middleware
│       ├── models/         # User & Task schemas
│       ├── routes/         # Express routers
│       └── server.js       # Entry point
└── frontend/
    └── src/
        ├── components/     # UI (Navbar, TaskCard, TaskModal, ConfirmationModal…)
        ├── context/        # Auth, Notifications, Theme
        ├── layouts/        # Dashboard layout wrapper
        ├── pages/          # Login, Register, Dashboard, Tasks, Analytics, Calendar, Profile
        ├── services/       # Axios API layer
        ├── styles/         # Global CSS & design tokens
        └── utils/          # Helpers (activity logger, formatters, task status)
```

---

## API Overview

### Auth — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | No | Register a new user |
| `POST` | `/login` | No | Login and receive JWT |
| `GET` | `/me` | Yes | Get current user |
| `PUT` | `/profile` | Yes | Update profile |
| `DELETE` | `/profile` | Yes | Delete account |

### Tasks — `/api/tasks`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Yes | List tasks (search, filter, sort, pagination) |
| `POST` | `/` | Yes | Create a task |
| `PUT` | `/:id` | Yes | Update a task |
| `DELETE` | `/:id` | Yes | Delete a task |

**Query parameters for `GET /api/tasks`:** `page`, `limit`, `search`, `status`, `priority`, `category`, `sort`

---

## Pages & Routes

| Page | Route | Description |
|---|---|---|
| Login | `/login` | Sign in |
| Register | `/register` | Create account |
| Dashboard | `/dashboard` | Overview, stats, quick actions |
| Tasks | `/tasks` | List view & Kanban board |
| Analytics | `/analytics` | Charts and insights |
| Calendar | `/calendar` | Due-date calendar |
| Profile | `/profile` | Account settings |

---

## Author

**Nitesh Sukhwal** — [GitHub @Nitesh8872](https://github.com/Nitesh8872)

## License

Developed as a MERN stack internship assignment. Free to use as a reference or learning resource.
