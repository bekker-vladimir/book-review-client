import apiClient from "./axiosClient";

export const authService = {
    async register(username, email, password) {
        const response = await apiClient.post('/auth/register', {username, email, password});
        const token = response.data;
        if (token) {
            localStorage.setItem('token', token);
        }
        return token;
    },

    async login(username, password) {
        const response = await apiClient.post('/auth/login', {username, password});
        const token = response.data;
        if (token) {
            localStorage.setItem('token', token);
        }
        return token;
    },

    async logout() {
        const response = await apiClient.post('/auth/logout');
        if (response.status >= 200 && response.status < 300) {
            localStorage.removeItem('token');
        }
        return response.data;
    }
};