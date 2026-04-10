import axios from 'axios';

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL || '/api/auth',
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
