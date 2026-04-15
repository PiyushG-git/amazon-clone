import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true, // Required to send/receive HttpOnly cookies cross-origin
});

// Request interceptor — attach JWT from localStorage (header-based fallback)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor — handle global 401 (token expired / blacklisted)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear local token on 401 — the Zustand store should be reset
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default api;
