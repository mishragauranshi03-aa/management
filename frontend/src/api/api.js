import axios from "axios";

const API = axios.create({
<<<<<<< HEAD
  baseURL: "http://172.17.12.165:8002", 
=======
  baseURL: "http://127.0.0.1:8000", 
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
});

// ---------- AUTH ----------
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/createuser", data);
export const getUsers = () => API.get("/auth/listuser");
export const deleteUser = (id) => API.delete(`/auth/deleteuser/${id}`);
export const updateUser = (id, data) => API.put(`/auth/updateuser/${id}`, data);

// ---------- TASKS ----------
export const getAllTasks = () => API.get("/tasks/get");
<<<<<<< HEAD
export const getEmployeeTasks = (username) => API.get(`/tasks/user/${username}`);
export const createTask = (data) => API.post("/tasks/create", data);
=======
export const getEmployeeTasks = (id) => API.get(`/tasks/user/${id}`);
//export const getEmployeeTasks = (id) => API.get(`/tasks/get/${id}`);
export const createTask = (data) => API.post("/tasks/create", data);
//export const createTask = (data) => API.post("/tasks/", data); // <-- corrected

>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105

// correct and consistent routes
export const updateTask = (id, data) => API.put(`/tasks/update/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/delete/${id}`);
<<<<<<< HEAD

export default API;
=======
//export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
//export const deleteTask = (id) => API.delete(`/tasks/delete/${id}`);

export default API;
>>>>>>> 8926bb94bd63ac3fb0a05b4eab035e48520af105
