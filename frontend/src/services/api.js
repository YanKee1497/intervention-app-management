import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configuration d'axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateAvailability: async (isAvailable) => {
    const response = await api.put('/auth/availability', { is_available: isAvailable });
    return response.data;
  }
};

export const ticketService = {
  getTickets: async () => {
    const response = await api.get('/tickets');
    return response.data;
  },

  getAvailableTickets: async () => {
    const response = await api.get('/tickets/available');
    return response.data;
  },

  getTicketById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  createTicket: async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  takeTicket: async (id) => {
    const response = await api.put(`/tickets/${id}/take`);
    return response.data;
  },

  assignTicket: async (id, technicianId) => {
    const response = await api.put(`/tickets/${id}/assign`, { technician_id: technicianId });
    return response.data;
  },

  updateTicketStatus: async (id, status) => {
    const response = await api.put(`/tickets/${id}/status`, { status });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/tickets/stats');
    return response.data;
  }
};

export const serviceService = {
  getServices: async () => {
    const response = await api.get('/services');
    return response.data;
  },

  getServiceById: async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  createService: async (serviceData) => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },

  updateService: async (id, serviceData) => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },

  deleteService: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },

  getServiceStats: async (id) => {
    const response = await api.get(`/services/${id}/stats`);
    return response.data;
  }
};

export default api;
