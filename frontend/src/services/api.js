import axios from "axios";

const API_TIMEOUT_MS = 15000;

const apiClient = axios.create({
    timeout: API_TIMEOUT_MS,
});

// Session expiry: only redirect on 401 from protected routes (not login/register)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || "";
        const isAuthEndpoint = /\/users\/(login|register)$/.test(url);

        if (status === 401 && !isAuthEndpoint) {
            localStorage.removeItem("token");
            localStorage.setItem("showSessionExpired", "true");
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

/** Server root or API prefix — `/api` is appended only when missing. */
function resolveApiBase(url) {
    const root = (url || "http://localhost:5000").replace(/\/+$/, "");
    return root.endsWith("/api") ? root : `${root}/api`;
}

const API_BASE = resolveApiBase(import.meta.env.VITE_API_URL);
const USER_API = `${API_BASE}/users`;
const TASK_API = `${API_BASE}/tasks`;

// Register
export const registerUser = async (userData) => {
    const response = await apiClient.post(
        `${USER_API}/register`,
        userData
    );

    return response.data;
};

// Login
export const loginUser = async (userData) => {
    const response = await apiClient.post(
        `${USER_API}/login`,
        userData
    );

    return response.data;
};

// Get Current User
export const getCurrentUser = async (token) => {

    const response = await apiClient.get(
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
    const response = await apiClient.get(
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
    const response = await apiClient.get(TASK_API, {
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
    const response = await apiClient.post(
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
    const response = await apiClient.delete(
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
    const response = await apiClient.put(
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
    const response = await apiClient.put(
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
    const response = await apiClient.delete(
        `${USER_API}/profile`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};
