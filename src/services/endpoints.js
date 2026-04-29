import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', 
});

// Interceptor to add token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const signup = async (email, password) => {
    return await API.post('/auth/signup', { email, password });
};

export const login = async (email, password) => {
    return await API.post('/auth/login', { email, password });
};

export const summarizePdf = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await API.post('/pdf/summarize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const getSummaries = async () => {
    return await API.get('/pdf/summaries');
};

export const getSummaryDetails = async (id) => {
    return await API.get(`/pdf/summaries/${id}`);
};

export const uploadDocument = async (files) => {
    const formData = new FormData();
    // Allow for single file or array of files
    const fileArray = Array.isArray(files) ? files : [files];
    fileArray.forEach(file => {
        formData.append('documents', file);
    });
    
    return await API.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const getDocuments = async () => {
    return await API.get('/documents');
};

export const getDocumentDetails = async (id) => {
    return await API.get(`/documents/${id}`);
};

export const reprocessDocument = async (id) => {
    return await API.post(`/documents/reprocess/${id}`);
};

// Required logic allowing for manual corrections of fields
export const updateInvoiceFields = async (id, updates) => {
    return await API.put(`/documents/${id}`, updates);
};
