const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = {
    get: async (endpoint) => {
        try {
            const res = await fetch(`${API_BASE_URL}${endpoint}`);
            if (!res.ok) throw new Error(`API Error: ${res.status}`);
            return await res.json();
        } catch (error) {
            throw error;
        }
    },
    post: async (endpoint, body) => {
        try {
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error(`API Error: ${res.status}`);
            return await res.json();
        } catch (error) {
            throw error;
        }
    }
};

export default api;
