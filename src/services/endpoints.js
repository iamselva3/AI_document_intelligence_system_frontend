import axios from 'axios';

const API = axios.create({
    // Fetch dynamically from Vite's local .env variables
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', 
});

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
