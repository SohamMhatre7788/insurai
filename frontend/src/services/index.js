import api from './api';

export const authService = {
    signup: async (data) => {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },

    login: async (data) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
};

export const policyService = {
    getAllPolicies: async () => {
        const response = await api.get('/policies');
        return response.data;
    },

    getPolicyById: async (id) => {
        const response = await api.get(`/policies/${id}`);
        return response.data;
    },
};

export const clientPolicyService = {
    buyPolicy: async (data) => {
        const response = await api.post('/client-policies', data);
        return response.data;
    },

    getMyPolicies: async () => {
        const response = await api.get('/client-policies');
        return response.data;
    },

    getPolicyById: async (id) => {
        const response = await api.get(`/client-policies/${id}`);
        return response.data;
    },

    renewPolicy: async (id) => {
        const response = await api.post(`/client-policies/${id}/renew`);
        return response.data;
    },
};

export const claimService = {
    createClaim: async (data) => {
        const formData = new FormData();
        formData.append('clientPolicyId', data.clientPolicyId);
        formData.append('claimAmountRequested', data.claimAmountRequested);
        formData.append('description', data.description);

        if (data.documents && data.documents.length > 0) {
            data.documents.forEach((doc) => {
                formData.append('documents', doc);
            });
        }

        const response = await api.post('/claims', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getMyClaims: async () => {
        const response = await api.get('/claims/my');
        return response.data;
    },
};

export const userService = {
    getProfile: async (userId) => {
        const response = await api.get(`/client/me?userId=${userId}`);
        return response.data;
    },

    updateProfile: async (userId, data) => {
        const response = await api.put(`/client/me?userId=${userId}`, data);
        return response.data;
    },

    changePassword: async (userId, data) => {
        const response = await api.put(
            `/client/me/password?userId=${userId}`,
            data
        );
        return response.data;
    },
};


export const adminService = {
    // Policy Management
    createPolicy: async (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key !== 'document' && data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        if (data.document) {
            formData.append('document', data.document);
        }

        const response = await api.post('/admin/policies', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getAllPolicies: async () => {
        const response = await api.get('/admin/policies');
        return response.data;
    },

    getPolicyById: async (id) => {
        const response = await api.get(`/admin/policies/${id}`);
        return response.data;
    },

    updatePolicy: async (id, data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key !== 'document' && data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        if (data.document) {
            formData.append('document', data.document);
        }

        const response = await api.put(`/admin/policies/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deletePolicy: async (id) => {
        const response = await api.delete(`/admin/policies/${id}`);
        return response.data;
    },

    // Claim Management
    getAllClaims: async (status = null) => {
        const params = status ? { status } : {};
        const response = await api.get('/admin/claims', { params });
        return response.data;
    },

    getClaimById: async (id) => {
        const response = await api.get(`/admin/claims/${id}`);
        return response.data;
    },

    approveClaim: async (id, approvedCoverageAmount) => {
        const response = await api.put(`/admin/claims/${id}/approve`, {
            approvedCoverageAmount,
        });
        return response.data;
    },

    rejectClaim: async (id, rejectionReason) => {
        const response = await api.put(`/admin/claims/${id}/reject`, {
            rejectionReason,
        });
        return response.data;
    },

    // User Management
    getAllClients: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    getClientById: async (id) => {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    },

    updateClient: async (id, data) => {
        const response = await api.put(`/admin/users/${id}`, data);
        return response.data;
    },

    deleteClient: async (id) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },
};
