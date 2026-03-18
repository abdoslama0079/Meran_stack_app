import axios from "axios";

// 🔹 Base URL from environment or fallback
const apiUrl =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:3500/api/tasks";

// 🔹 Create Axios instance
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Interceptors for logging & error handling
api.interceptors.request.use(
  (config) => {
    console.log(`➡️ Request: ${config.method.toUpperCase()} ${config.url}`, config.data || "");
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response:`, response.status, response.data);
    return response;
  },
  (error) => {
    console.error("❌ Response error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// 🔹 Service functions
export function getTasks(params = {}) {
  return api.get("/", { params });
}

export function addTask(task) {
  return api.post("/", task);
}

export function updateTask(id, task) {
  return api.put(`/${id}`, task);
}

export function deleteTask(id) {
  return api.delete(`/${id}`);
}

export function markTaskCompleted(id) {
  return api.patch(`/${id}/complete`);
}

export function addTagToTask(id, tag) {
  return api.patch(`/${id}/add-tag`, { tag });
}

export function getOverdueTasks() {
  return api.get("/stats/overdue");
}

export function getTasksByTag(tag) {
  return api.get(`/stats/tag/${tag}`);
}
