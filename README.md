# Task Management System

## Project Overview

A Task Management System built using the MERN Stack (MongoDB, Express.js, React.js, and Node.js).

The application allows users to manage tasks efficiently with secure authentication, task creation, task updates, and task tracking.

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
│   └── userController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   └── User.js
│
├── routes/
│   └── userRoutes.js
│
├── .env
├── server.js
├── package.json
│
├── README.md
└── .gitignore
```

---

# Backend Setup

## Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
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

MongoDB connection is configured using Mongoose.

Location:

```text
backend/config/db.js
```

Features:

* Connects to MongoDB
* Handles connection errors
* Loads database URI from environment variables

---

# Express Server Configuration

The Express server:

* Loads environment variables using dotenv
* Connects to MongoDB
* Parses JSON requests using express.json()
* Registers application routes
* Runs on the configured port

Location:

```text
backend/server.js
```

---

# User Authentication System

## User Model

Location:

```text
backend/models/User.js
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

* Email uniqueness
* Required field validation
* Automatic timestamps

---

## User Registration API

### Endpoint

```http
POST /api/users/register
```

### Features

* Accepts user information
* Validates required fields
* Checks existing email
* Hashes password using bcrypt
* Saves user to MongoDB

### Sample Request

```json
{
  "name": "Nitesh",
  "email": "nitesh@gmail.com",
  "password": "123456"
}
```

---

## User Login API

### Endpoint

```http
POST /api/users/login
```

### Features

* Verifies user email
* Compares password using bcrypt.compare()
* Generates JWT token on successful login

### Sample Request

```json
{
  "email": "nitesh@gmail.com",
  "password": "123456"
}
```

---

# JWT Authentication

JWT is used for secure user authentication.

### Token Generation

On successful login:

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
Generate JWT Token
    ↓
Send Token to Frontend
    ↓
Frontend Stores Token
    ↓
Send Token in Future Requests
    ↓
Backend Verifies Token
```

---

# Authentication Middleware

Location:

```text
backend/middleware/authMiddleware.js
```

Responsibilities:

* Read JWT token from request headers
* Verify token validity
* Extract user ID
* Fetch user from database
* Attach user to req.user
* Allow access to protected routes

### Protected Route Flow

```text
Request
   ↓
JWT Middleware
   ↓
Verify Token
   ↓
Attach User
   ↓
Controller
   ↓
Response
```

---

# Available API Endpoints

## Test Route

```http
GET /
```

Response:

```text
Task Management API
```

---

## Register User

```http
POST /api/users/register
```

---

## Login User

```http
POST /api/users/login
```

---

# Current Progress

✅ Project Setup Completed

✅ Express Server Configured

✅ Environment Variables Configured

✅ MongoDB Connected Successfully

✅ User Model Created

✅ User Registration API Implemented

✅ Password Hashing Using bcryptjs

✅ User Login API Implemented

✅ JWT Token Generation Implemented

✅ JWT Authentication Middleware Implemented

✅ Protected Route Architecture Ready

---

# Next Steps

* Create Task Model
* Create Task CRUD APIs
* Associate Tasks with Logged-in Users
* Protect Task Routes Using JWT Middleware
* Task Filtering and Status Updates
* React Frontend Development
* Connect Frontend with Backend APIs

---

# Author

Nitesh Sukhwal

MERN Stack Internship Project
