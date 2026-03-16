import apiClient from "./axiosClient";

export const bookService = {
    async getAllBooks(page = 0, size = 20) {
        const response = await apiClient.get('/books', { params: { page, size, sort: 'id,desc' } });
        return response.data;
    },

    async searchBooks(query, page = 0, size = 20) {
        const response = await apiClient.get('/books/search', { params: { query, page, size, sort: 'id,desc' } });
        return response.data;
    },

    async getPendingBooks() {
        const response = await apiClient.get('/books/pending');
        return response.data;
    },

    async getBookById(id) {
        const response = await apiClient.get(`/books/${id}`);
        return response.data;
    },

    async createBook(book) {
        const response = await apiClient.post('/books', book);
        return response.data;
    },

    async deleteBook(id) {
        const response = await apiClient.delete(`/books/${id}`);
        return response.data;
    },

    async uploadCover(bookId, file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post(`/books/${bookId}/cover`, formData);
        return response.data;
    },

    async changeStatus(bookId, status) {
        const response = await apiClient.patch(`/books/${bookId}/status`, { status });
        return response.data;
    },

    getCoverUrl(coverUrl) {
        if (!coverUrl) return null;
        return `http://localhost:8080${coverUrl}`;
    }
};