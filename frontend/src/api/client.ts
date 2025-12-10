// client/src/api/client.ts
import axios from 'axios';
import { auth } from '../firebase/config';
import type { InternalAxiosRequestConfig } from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Instancja Axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor do automatycznego dołączania Firebase ID Token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const user = auth.currentUser;

    if (user) {
      try {
        const token = await user.getIdToken();
        
        // headers może być undefined → trzeba zapewnić obiekt
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Błąd podczas pobierania tokena Firebase:", error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;