import axios from "axios";

const API_TIMEOUT_MS = 15000;

/** Production Railway API — fallback when VITE_API_URL is missing at Netlify build time. */
const PRODUCTION_API_ROOT =
    "https://task-management-system-production-0d38.up.railway.app";

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

/**
 * Resolve API root URL.
 * Vite replaces import.meta.env.VITE_API_URL at build time only.
 * If Netlify builds without this variable, requests would otherwise hit localhost.
 */
function resolveApiRoot() {
    const envUrl = import.meta.env.VITE_API_URL?.trim();

    if (envUrl) {
        return envUrl.replace(/\/+$/, "");
    }

    if (import.meta.env.PROD) {
        console.warn(
            "[TaskHub] VITE_API_URL was not set at build time. Using production Railway fallback."
        );
        return PRODUCTION_API_ROOT;
    }

    return "http://localhost:5000";
}

/** Server root or API prefix — `/api` is appended only when missing. */
function resolveApiBase(rootUrl) {
    const root = rootUrl.replace(/\/+$/, "");
    return root.endsWith("/api") ? root : `${root}/api`;
}

const API_ROOT = resolveApiRoot();
const API_BASE = resolveApiBase(API_ROOT);
const USER_API = `${API_BASE}/users`;
const TASK_API = `${API_BASE}/tasks`;

/** Exposed for connectivity debugging (e.g. DevTools: import from services). */
export const API_CONFIG = {
    root: API_ROOT,
    base: API_BASE,
    login: `${USER_API}/login`,
    register: `${USER_API}/register`,
};

if (import.meta.env.DEV) {
    console.info("[TaskHub] API endpoints:", API_CONFIG);
}

// Register — POST /api/users/register
export const registerUser = async (userData) => {
    const response = await apiClient.post(
        `${USER_API}/register`,
        userData
    );

    return response.data;
};

// Login — POST /api/users/login
export const loginUser = async (userData) => {
    const response = await apiClient.post(
        `${USER_API}/login`,
        userData
    );

    return response.data;
};

// Get Current User — GET /api/users/me
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

// Get tasks — GET /api/tasks
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

// Create Task — POST /api/tasks
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

// Delete Task — DELETE /api/tasks/:id
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

// Update Task — PUT /api/tasks/:id
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

// Update User Profile — PUT /api/users/profile
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

// Delete User Account — DELETE /api/users/profile
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
