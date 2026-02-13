import axios from 'axios';

// ✅ USE ENVIRONMENT VARIABLE FOR PRODUCTION, FALLBACK TO LOCALHOST FOR DEVELOPMENT
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Contact Form API
export const submitContact = async (formData: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) => {
  try {
    const response = await api.post('/contact', formData);
    return response.data;
  } catch (error) {
    console.error('Contact submission error:', error);
    throw error;
  }
};

// Health Check API
export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Backend not reachable:', error);
    throw error;
  }
};

export default api;