import apiClient from "./axiosClient";

export const complaintService = {
    async createComplaint(complaintData, reviewId) {
        const response = await apiClient.post(`/complaints/review/${reviewId}`, complaintData);
        return response.data;
    },

    async getComplaints() {
        const response = await apiClient.get('/complaints');
        return response.data;
    },

    async dismissComplaint(complaintId) {
        await apiClient.delete(`/complaints/${complaintId}`);
    }
};