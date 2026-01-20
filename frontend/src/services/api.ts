import axios from 'axios';
import { AuthFacade } from '../facades/AuthFacade';

export const api = axios.create({
  baseURL: 'https://pet-manager-api.geia.vip/', // Sua URL base
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Interceptor de REQUEST (Injeta o token)
api.interceptors.request.use(
  (config) => {
    const token = AuthFacade.getAccessToken();
    if (token && !config.url?.includes('/login') && !config.url?.includes('/refresh')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Variável para evitar loop infinito de tentativas
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 2. Interceptor de RESPONSE (Trata o erro 401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (Não Autorizado) e NÃO for uma tentativa de login/refresh
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/login')) {
      
      if (isRefreshing) {
        // Se já tem alguém renovando o token, coloca essa requisição na fila de espera
        return new Promise(function(resolve, reject) {
          failedQueue.push({resolve, reject});
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Tenta renovar o token usando o Facade
        const newToken = await AuthFacade.refreshSession();

        if (newToken) {
          // Sucesso! Atualiza o header da requisição original e refaz ela
          api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
          processQueue(null, newToken);
          
          originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
          return api(originalRequest);
        } else {
          // Se não conseguiu renovar, rejeita
          processQueue(error, null);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);