# Task Management System

## Project Overview

A Task Management System built using the MERN Stack (MongoDB, Express.js, React.js, and Node.js).

The application allows users to:

* Register and Login securely using JWT Authentication
* Create personal tasks
* View their own tasks
* Update task details and status
* Delete tasks
* Manage tasks securely with protected routes

---

# Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* dotenv
* bcryptjs
* jsonwebtoken (JWT)

## Frontend

* React.js (To be implemented)

---

# Project Structure

```text
Task-Management-System/

├── frontend/

├── backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── userController.js
│   └── taskController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── user.js
│   └── task.js
│
├── routes/
│   ├── userRoutes.js
│   └── taskRoutes.js
│
├── .env
├── server.js
├── package.json
│
├── README.md
└── .gitignore
```

---

# Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=yourSecretKey
```

---

# Installed Packages

```bash
npm install express dotenv mongoose bcryptjs jsonwebtoken
```

Development Dependency:

```bash
npm install nodemon --save-dev
```

---

# Database Connection

Location:

```text
backend/config/db.js
```

Features:

* Connects to MongoDB using Mongoose
* Handles connection errors
* Loads connection string from environment variables

---

# Express Server Configuration

Location:

```text
backend/server.js
```

Features:

* Loads environment variables
* Connects MongoDB
* Parses JSON requests
* Registers user routes
* Registers task routes
* Starts Express server

---

# User Authentication System

## User Model

Location:

```text
backend/models/user.js
```

Fields:

```javascript
{
  name,
  email,
  password
}
```

Features:

* Unique email validation
* Password hashing using bcryptjs
* Automatic timestamps

---

# User Registration API

### Endpoint

```http
POST /api/users/register
```

### Request

```json
{
  "name": "Nitesh",
  "email": "nitesh@gmail.com",
  "password": "123456"
}
```

---

# User Login API

### Endpoint

```http
POST /api/users/login
```

### Request

```json
{
  "email": "nitesh@gmail.com",
  "password": "123456"
}
```

### Response

Returns a JWT token:

```json
{
  "_id": "...",
  "name": "Nitesh",
  "email": "nitesh@gmail.com",
  "token": "JWT_TOKEN"
}
```

---

# JWT Authentication

JWT is used for securing protected routes.

### Token Generation

```javascript
jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
```

### Authentication Flow

```text
User Login
    ↓
Generate JWT
    ↓
Send Token
    ↓
Store Token
    ↓
Protected Request
    ↓
Verify Token
    ↓
Access Granted
```

---

# Authentication Middleware

Location:

```text
backend/middleware/authMiddleware.js
```

Responsibilities:

* Read Authorization header
* Verify JWT token
* Extract user ID
* Find user in database
* Attach user to req.user
* Allow access to protected routes

---

# Task Management System

## Task Model

Location:

```text
backend/models/task.js
```

Schema:

```javascript
{
  title,
  description,
  status,
  user
}
```

### Fields

| Field       | Description         |
| ----------- | ------------------- |
| title       | Task title          |
| description | Task description    |
| status      | pending / completed |
| user        | Reference to User   |

### Status Values

```javascript
pending
completed
```

### Relationship

Each task belongs to one user.

```text
User
 ├── Task 1
 ├── Task 2
 └── Task 3
```

---

# Task CRUD APIs

All task routes are protected.

Authorization Header:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

## Create Task

### Endpoint

```http
POST /api/tasks
```

### Request

```json
{
  "title": "Learn JWT",
  "description": "Implement authentication",
  "status": "pending"
}
```

---

## Get All Tasks

### Endpoint

```http
GET /api/tasks
```

### Description

Returns all tasks belonging to the logged-in user.

---

## Update Task

### Endpoint

```http
PUT /api/tasks/:id
```

### Request

```json
{
  "status": "completed"
}
```

### Description

Updates an existing task.

---

## Delete Task

### Endpoint

```http
DELETE /api/tasks/:id
```

### Description

Deletes a task belonging to the logged-in user.

---

# API Summary

## Public Routes

### Register

```http
POST /api/users/register
```

### Login

```http
POST /api/users/login
```

---

## Protected Routes

### Create Task

```http
POST /api/tasks
```

### Get Tasks

```http
GET /api/tasks
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

# Current Progress

✅ Project Setup Completed

✅ MongoDB Connected

✅ Express Server Configured

✅ Environment Variables Configured

✅ User Model Created

✅ User Registration API Completed

✅ User Login API Completed

✅ Password Hashing Implemented

✅ JWT Authentication Implemented

✅ Authentication Middleware Implemented

✅ Task Model Created

✅ Create Task API Completed

✅ Get Tasks API Completed

✅ Update Task API Completed

✅ Delete Task API Completed

✅ User-Specific Task Access Implemented

✅ Protected Task Routes Implemented

---

# Next Steps

* Add Task Filtering
* Add Search Functionality
* Add Pagination
* Build React Frontend
* Connect Frontend to Backend APIs
* Add Dashboard UI
* Deploy Application

---

# Author

**Nitesh Sukhwal**

MERN Stack Internship Project
