import axios from 'axios';

const AUTH_URL = 'http://localhost:5001/api/auth';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const registerUser = (data) => axios.post(`${AUTH_URL}/register`, data);
export const loginUser = (data) => axios.post(`${AUTH_URL}/login`, data);
export const getProfile = () => axios.get(`${AUTH_URL}/profile`, authHeaders());