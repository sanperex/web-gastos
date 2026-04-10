import axios from 'axios';

export const expensesApi = axios.create({
  baseURL: import.meta.env.VITE_EXPENSES_API_URL || '/api/gastos',
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
