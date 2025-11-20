import axios from "axios";

const API = axios.create({
  baseURL: "http://172.17.12.165:8000", 
});

// ---------- AUTH ----------
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/createuser", data);
export const getUsers = () => API.get("/auth/listuser");
export const deleteUser = (id) => API.delete(`/auth/deleteuser/${id}`);
export const updateUser = (id, data) => API.put(`/auth/updateuser/${id}`, data);

// ---------- TASKS ----------
export const getAllTasks = () => API.get("/tasks/get");
export const getEmployeeTasks = (id) => API.get(`/tasks/user/${id}`);
export const createTask = (data) => API.post("/tasks/create", data);

// correct and consistent routes
export const updateTask = (id, data) => API.put(`/tasks/update/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/delete/${id}`);

export default API;