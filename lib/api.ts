import axios from 'axios';

const API_BASE_URL =  'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hersafety_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },
  register: async (userData: { name: string; email: string; phone: string; password: string }) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },
};

export const incidentAPI = {
  reportIncident: async (incidentData: { description: string; location: string }) => {
    const response = await api.post('/incidents', incidentData);
    return response.data;
  },
  getIncidents: async () => {
    const response = await api.get('/incidents');
    return response.data;
  },
};

export const emergencyAPI = {
  sendSOS: async (location: string) => {
    const response = await api.post('/emergency-contacts/sos', { location });
    return response.data;
  },
  addEmergencyContact: async (contactData: { name: string; phone: string; relation: string }) => {
    const response = await api.post('/emergency-contacts', contactData);
    return response.data;
  },
};

export const caseAPI = {
  trackCase: async (caseId: string) => {
    const response = await api.get(`/cases/${caseId}`);
    return response.data;
  },
  updateCaseStatus: async (caseId: string, status: string) => {
    const response = await api.put(`/cases/${caseId}`, { status });
    return response.data;
  },
};

export default api; 