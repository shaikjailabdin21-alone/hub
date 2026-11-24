import api from './api';

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data && response.data.token) {
      localStorage.setItem('hub_auth_token', response.data.token);
      localStorage.setItem('hub_user_profile', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    // Distinguish network errors from server responses
    if (!error.response) {
      throw new Error('Cannot connect to server. Please ensure the backend is running and try again.');
    }
    const errorMessage = error.response?.data?.message || error.message || 'Registration failed.';
    throw new Error(errorMessage);
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data && response.data.token) {
      localStorage.setItem('hub_auth_token', response.data.token);
      localStorage.setItem('hub_user_profile', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    // Distinguish network errors from server responses
    if (!error.response) {
      throw new Error('Cannot connect to server. Please ensure the backend is running and try again.');
    }
    const errorMessage = error.response?.data?.message || error.message || 'Login failed.';
    throw new Error(errorMessage);
  }
};

export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    if (response.data && response.data.user) {
      localStorage.setItem('hub_user_profile', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('hub_auth_token');
  localStorage.removeItem('hub_user_profile');
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('hub_user_profile');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return Boolean(user && user.role === 'admin');
};

export const getToken = () => {
  return localStorage.getItem('hub_auth_token');
};

export default {
  register,
  login,
  getMe,
  logout,
  getCurrentUser,
  isAdmin,
  getToken,
};
