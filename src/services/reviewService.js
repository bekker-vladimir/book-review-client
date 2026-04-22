import apiClient from "./axiosClient";

export const reviewService = {
    async createReview(review, bookId) {
        const response = await apiClient.post(`/books/${bookId}/reviews`, review);
        return response.data;
    },

    async getReviewsByBookId(bookId, page, size) {
        const response = await apiClient.get(`/books/${bookId}/reviews`, {
            params: {page, size, sort: 'createdAt,desc'}
        });
        return response.data;
    },

    async getRecentReviews(count = 3) {
        const response = await apiClient.get('/reviews/recent', {params: {count}})
        return response.data;
    },

    async deleteReview(reviewId) {
        const response = await apiClient.delete(`/reviews/${reviewId}`);
        return response.data;
    }
};