import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token && config.headers) {
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
      sessionStorage.removeItem("token");
      // Redirecionar para a página de login se necessário
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
