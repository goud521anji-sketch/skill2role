import api from './api';

const MOCK_USER = {
    id: 'mock-user-123',
    name: 'Demo User',
    email: 'demo@example.com',
    role: 'guest'
};

const authService = {
    login: async (email, password) => {
        try {
            return await api.post('/auth/login', { email, password });
        } catch (error) {
            console.warn("Backend unavailable, using mock login.");
            return { user: { ...MOCK_USER, email }, token: 'mock-token' };
        }
    },
    register: async (fullName, email, password) => {
        try {
            return await api.post('/auth/register', { fullName, email, password });
        } catch (error) {
            console.warn("Backend unavailable, using mock register.");
            return { user: { ...MOCK_USER, name: fullName, email }, token: 'mock-token' };
        }
    },
    guest: async () => {
        try {
            return await api.post('/auth/guest', {});
        } catch (error) {
            console.warn("Backend unavailable, using mock guest.");
            return { user: MOCK_USER, token: 'mock-token' };
        }
    }
};

export default authService;
