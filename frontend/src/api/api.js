import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000", // ⚠️ use your backend URL if needed
});

// ---------- AUTH ----------
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/createuser", data);
export const getUsers = () => API.get("/auth/listuser");
export const deleteUser = (id) => API.delete(`/auth/deleteuser/${id}`);
export const updateUser = (id, data) => API.put(`/auth/updateuser/${id}`, data);

// ---------- TASKS ----------
export const getAllTasks = () => API.get("/tasks/get");
export const getEmployeeTasks = (id) => API.get(`/tasks/get/${id}`);
export const createTask = (data) => API.post("/tasks/", data);

// ✅ fix: correct endpoint + consistent status updates
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);

export const deleteTask = (id) => API.delete(`/tasks/delete/${id}`);

export default API;
