# Task Management System

## Project Overview

A Task Management System built using the MERN Stack (MongoDB, Express.js, React.js, and Node.js). This application allows users to manage tasks efficiently with features such as authentication, task creation, task updates, and task tracking.

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* dotenv

### Frontend

* React.js (To be implemented)

---

## Project Structure

Task-Management-System/

├── frontend/

├── backend/

│ ├── config/

│ │ └── db.js

│ ├── server.js

│ ├── .env

│ └── package.json

├── README.md

└── .gitignore

---

## Backend Setup Completed

### Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
```

### Installed Packages

```bash
npm install express dotenv mongoose
npm install nodemon --save-dev
```

### Database Connection

MongoDB connection is configured using Mongoose in:

```text
backend/config/db.js
```

### Server Configuration

The Express server:

* Loads environment variables using dotenv
* Connects to MongoDB
* Parses JSON requests using `express.json()`
* Runs on the configured port

### Test Route

```http
GET /
```

Response:

```text
Task Management API
```

---

## Current Progress

* Project setup completed
* Express server configured
* Environment variables configured
* MongoDB connected successfully
* Basic API route created

---

## Next Steps

* Create User Model
* User Registration API
* Password Hashing using bcrypt
* Login API
* JWT Authentication
* Task CRUD Operations
* React Frontend Development
