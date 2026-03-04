import axios from 'axios';

// All requests now go through API Gateway on port 5001!
const API_URL = 'http://localhost:5001/api';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

// Auth
export const registerUser = (data) => axios.post(`${API_URL}/auth/register`, data);
export const loginUser = (data) => axios.post(`${API_URL}/auth/login`, data);
export const getProfile = () => axios.get(`${API_URL}/auth/profile`, authHeaders());

// Vacancies (ready for Member B)
export const getVacancies = () => axios.get(`${API_URL}/vacancies`, authHeaders());
export const applyVacancy = (id) => axios.post(`${API_URL}/vacancies/${id}/apply`, {}, authHeaders());
export const getMyApplications = () => axios.get(`${API_URL}/applications/my`, authHeaders());

// Study Materials (ready for Member C)
export const getMaterials = () => axios.get(`${API_URL}/materials`, authHeaders());

// Quizzes (ready for Member D)
export const getQuizzes = () => axios.get(`${API_URL}/quizzes`, authHeaders());
export const submitQuiz = (id, answers) => axios.post(`${API_URL}/quizzes/${id}/submit`, answers, authHeaders());
export const getMyProgress = () => axios.get(`${API_URL}/quizzes/progress/me`, authHeaders());
