import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
  getProfile: () => api.get('/profile'),
  getUsers: () => api.get("/users"),
  updateUserRole: (userId, role) => api.put(`/users/${userId}/role`, { role }),
  getAdminDashboard: () => api.get("/admin/dashboard"),
  getUserDashboard: () => api.get('/user/dashboard'),


  
  // Tambah user (admin)
registerUser: (userData) =>
  axios.post("http://localhost:5000/api/register", userData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  }),

// Hapus user (admin)
deleteUser: (id) =>
  axios.delete(`http://localhost:5000/api/users/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  }),

};

export default api;