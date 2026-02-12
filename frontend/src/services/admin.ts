import api from './api';

// Store token in localStorage
const TOKEN_KEY = 'techspark_admin_token';

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  delete api.defaults.headers.common['Authorization'];
};

// Admin API calls
export const adminLogin = async (username: string, password: string) => {
  try {
    const response = await api.post('/admin/login', { username, password });
    const { access_token, admin } = response.data;
    setToken(access_token);
    return { success: true, admin };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || 'Login failed'
    };
  }
};

export const adminRegister = async (adminData: {
  username: string;
  email: string;
  full_name: string;
  password: string;
}) => {
  try {
    const response = await api.post('/admin/register', adminData);
    return { success: true, admin: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.detail || 'Registration failed'
    };
  }
};

export const getCurrentAdmin = async () => {
  try {
    const response = await api.get('/admin/me');
    return { success: true, admin: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.detail };
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard/stats');
    return { success: true, stats: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.detail };
  }
};

// ============ GALLERY API ============

export const getAllGalleryImages = async () => {
  try {
    const response = await api.get('/admin/gallery');
    return { success: true, images: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.detail };
  }
};

export const updateGalleryImage = async (
  imageId: string,
  data: {
    title?: string;
    description?: string;
    service_category?: string;
    service_subcategory?: string;
    featured?: boolean;
  }
) => {
  try {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.service_category) formData.append('service_category', data.service_category);
    if (data.service_subcategory !== undefined) formData.append('service_subcategory', data.service_subcategory);
    if (data.featured !== undefined) formData.append('featured', String(data.featured));

    const response = await api.put(`/admin/gallery/${imageId}`, formData);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.detail };
  }
};

export const deleteGalleryImage = async (imageId: string) => {
  try {
    const response = await api.delete(`/admin/gallery/${imageId}`);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.detail };
  }
};

// ============ CONTACTS API ============

export const getAllContacts = async (skip = 0, limit = 50) => {
  try {
    const response = await api.get(`/admin/contacts?skip=${skip}&limit=${limit}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.detail };
  }
};

export const getContactById = async (contactId: string) => {
  try {
    const response = await api.get(`/admin/contacts/${contactId}`);
    return { success: true, contact: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.detail };
  }
};

export const updateContactStatus = async (contactId: string, status: string) => {
  try {
    const formData = new FormData();
    formData.append('status', status);
    const response = await api.put(`/admin/contacts/${contactId}/status`, formData);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.detail };
  }
};

export const deleteContact = async (contactId: string) => {
  try {
    const response = await api.delete(`/admin/contacts/${contactId}`);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.detail };
  }
};

// ============ SERVICE REQUESTS API ============

export const getAllServiceRequests = async (
  status?: string,
  service_type?: string,
  skip: number = 0,
  limit: number = 50
) => {
  try {
    let url = `/admin/service-requests?skip=${skip}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    if (service_type) url += `&service_type=${service_type}`;
    
    const response = await api.get(url);
    return { success: true, requests: response.data.requests, total: response.data.total };
  } catch (error: any) {
    console.error('Failed to fetch service requests:', error);
    return { 
      success: false, 
      error: error.response?.data?.detail || 'Failed to fetch service requests',
      requests: [],
      total: 0
    };
  }
};

export const getServiceRequestById = async (requestId: string) => {
  try {
    const response = await api.get(`/admin/service-requests/${requestId}`);
    return { success: true, request: response.data };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.detail || 'Failed to fetch service request' 
    };
  }
};

export const updateServiceRequestStatus = async (
  requestId: string,
  status: string,
  estimated_cost?: number,
  estimated_days?: number
) => {
  try {
    const formData = new FormData();
    formData.append('status', status);
    if (estimated_cost !== undefined) formData.append('estimated_cost', estimated_cost.toString());
    if (estimated_days !== undefined) formData.append('estimated_days', estimated_days.toString());

    const response = await api.put(`/admin/service-requests/${requestId}/status`, formData);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.detail || 'Failed to update service request' 
    };
  }
};

export const deleteServiceRequest = async (requestId: string) => {
  try {
    const response = await api.delete(`/admin/service-requests/${requestId}`);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.detail || 'Failed to delete service request' 
    };
  }
};

// ============ QUOTES API ============

export const getAllQuotes = async (
  status?: string,
  skip: number = 0,
  limit: number = 50
) => {
  try {
    let url = `/admin/quotes?skip=${skip}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    
    const response = await api.get(url);
    return { success: true, quotes: response.data.quotes, total: response.data.total };
  } catch (error: any) {
    console.error('Failed to fetch quotes:', error);
    return { 
      success: false, 
      error: error.response?.data?.detail || 'Failed to fetch quotes',
      quotes: [],
      total: 0
    };
  }
};

export const getQuoteById = async (quoteId: string) => {
  try {
    const response = await api.get(`/admin/quotes/${quoteId}`);
    return { success: true, quote: response.data };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.detail || 'Failed to fetch quote' 
    };
  }
};

export const updateQuoteStatus = async (
  quoteId: string,
  status: string,
  quoted_amount?: number
) => {
  try {
    const formData = new FormData();
    formData.append('status', status);
    if (quoted_amount !== undefined) formData.append('quoted_amount', quoted_amount.toString());

    const response = await api.put(`/admin/quotes/${quoteId}/status`, formData);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.detail || 'Failed to update quote' 
    };
  }
};

export const deleteQuote = async (quoteId: string) => {
  try {
    const response = await api.delete(`/admin/quotes/${quoteId}`);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.detail || 'Failed to delete quote' 
    };
  }
};

// ============ ADMIN SETTINGS API ============

export const getAdminProfile = async () => {
  try {
    const response = await api.get('/admin/settings/profile');
    return { success: true, profile: response.data };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.detail || 'Failed to fetch profile' 
    };
  }
};

export const updateAdminProfile = async (full_name: string, email: string) => {
  try {
    const formData = new FormData();
    formData.append('full_name', full_name);
    formData.append('email', email);
    
    const response = await api.put('/admin/settings/profile', formData);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.detail || 'Failed to update profile' 
    };
  }
};

export const changeAdminPassword = async (current_password: string, new_password: string) => {
  try {
    const response = await api.post('/admin/settings/change-password', {
      current_password,
      new_password
    });
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.detail || 'Failed to change password' 
    };
  }
};

// Initialize auth header if token exists
const token = getToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}