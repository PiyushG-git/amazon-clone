import api from '../../../app/app.api';

const authService = {
    login: async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        return res.data;
    },
    register: async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        return res.data;
    },
    getMe: async () => {
        const res = await api.get('/auth/me');
        return res.data;
    },
    logout: async () => {
        // Optional: call backend logout to blacklist token
        await api.post('/auth/logout');
    }
};

export default authService;
