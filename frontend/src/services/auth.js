// services/auth.js
import api from './api';

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  if (response.data.user) {
    localStorage.setItem('token', 'authenticated');
  }
  return response;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data.user) {
    localStorage.setItem('token', 'authenticated');
  }
  return response;
};

export const logout = async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('token');
};

export const getProfile = async () => {
  return await api.get('/auth/me');
};