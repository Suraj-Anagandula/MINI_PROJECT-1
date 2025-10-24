 


import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  studentLogin: (credentials) => api.post('/auth/student/login', credentials),
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
  studentRegister: (userData) => api.post('/auth/student/register', userData),
  adminRegister: (userData) => api.post('/auth/admin/register', userData),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resendOTP: (data) => api.post('/auth/resend-otp', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  // FIXED: Use the correct endpoint name that matches your routes
  verifyPasswordResetOTP: (data) => api.post('/auth/verify-reset-otp', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyToken: () => api.get('/auth/me'),
};

// Complaints API
export const complaintsAPI = {
  createComplaint: (complaintData) => api.post('/complaints', complaintData),
  getStudentComplaints: (params) => api.get('/complaints/my-complaints', { params }),
  getAllComplaints: (params) => api.get('/complaints', { params }),
  getComplaint: (id) => api.get(`/complaints/${id}`),
  updateStatus: (id, data) => api.patch(`/complaints/${id}/status`, data),
  addRating: (id, data) => api.post(`/complaints/${id}/rating`, data),
  getStats: () => api.get('/complaints/stats/overview'),
  assignComplaint: (id, data) => api.patch(`/complaints/${id}/assign`, data),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/user/password', data),
  getDashboardStats: () => api.get('/users/dashboard-stats'),
  deleteAccount: (data) => api.delete('/users/account', { data }),
};

// Admin API
export const adminAPI = {
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  createAdmin: (data) => api.post('/admin/admins', data),
  getAllAdmins: () => api.get('/admin/'),
  updatePermissions: (id, data) => api.put(`/admin/${id}/permissions`, data),
  toggleAdminStatus: (id) => api.patch(`/admin/${id}/toggle-status`),
  getAdminDashboard: () => api.get('/admin/dashboard'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadMultipleImages: (formData) => api.post('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteImage: (data) => api.delete('/upload/image', { data }),
  getSignature: () => api.get('/upload/signature'),
};

export default api;