import axios from "axios";

const USER_API = "http://localhost:5000/api/users";
const TASK_API = "http://localhost:5000/api/tasks";

// Register
export const registerUser = async (userData) => {
    const response = await axios.post(
        `${USER_API}/register`,
        userData
    );

    return response.data;
};

// Login
export const loginUser = async (userData) => {
    const response = await axios.post(
        `${USER_API}/login`,
        userData
    );

    return response.data;
};

// Get Current User
export const getCurrentUser = async (token) => {

    const response = await axios.get(
        `${USER_API}/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// Get all tasks
export const getTasks = async (token) => {
    const response = await axios.get(
        TASK_API,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// Create Task
export const createTask = async (taskData, token) => {
    const response = await axios.post(
        TASK_API,
        taskData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// Delete Task
export const deleteTask = async (taskId, token) => {
    const response = await axios.delete(
        `${TASK_API}/${taskId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// Update Task
export const updateTask = async (
    taskId,
    updatedData,
    token
) => {
    const response = await axios.put(
        `${TASK_API}/${taskId}`,
        updatedData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// Update User Profile
export const updateUserProfile = async (userData, token) => {
    const response = await axios.put(
        `${USER_API}/profile`,
        userData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};