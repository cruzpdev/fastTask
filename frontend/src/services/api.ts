import axios from 'axios';

const api = axios.create({
  baseURL: 'https://1222e81611-3001.preview.abacusai.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@FastTask:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se o erro for 401 (Unauthorized), pode ser que o token expirou
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('@FastTask:token');
      // Redirecionar para a página de login se necessário
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
