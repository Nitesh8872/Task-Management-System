import axios from "axios";

// Add Axios response interceptor for 401 errors
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.setItem("showSessionExpired", "true");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const USER_API = `${BASE_URL}/api/users`;
const TASK_API = `${BASE_URL}/api/tasks`;

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

// Get tasks
export const getTasks = async (
    token,
    {
        page = 1,
        limit = 9,
        search = "",
        status = "all",
        priority = "all",
        category = "all",
        sort = "newest",
    } = {}
) => {
    const response = await axios.get(
        TASK_API,
        {
            params: {
                page,
                limit,
                search,
                status,
                priority,
                category,
                sort,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// Get all tasks (no pagination, for analytics & calendar)
export const getAllTasks = async (token) => {
    const response = await axios.get(TASK_API, {
        params: {
            page: 1,
            limit: 1000,
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

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

// Delete User Account
export const deleteUserAccount = async (token) => {
    const response = await axios.delete(
        `${USER_API}/profile`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};