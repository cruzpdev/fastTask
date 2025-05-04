import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface TokenPayload {
  id: number;
  name: string;
  email: string;
  exp: number;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoredData() {
      const storedToken = sessionStorage.getItem('token');
      
      if (storedToken) {
        try {
          const decoded = jwtDecode<TokenPayload>(storedToken);
          
          // Verificar se o token expirou
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            sessionStorage.removeItem('token');
            setUser(null);
          } else {
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            setUser({
              id: decoded.id,
              name: decoded.name,
              email: decoded.email
            });
          }
        } catch (error) {
          // Token inválido
          sessionStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    }
    
    loadStoredData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, senha: password });
      const { token } = response.data;
      
      sessionStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log("Token recebido e salvo:", token)
      
      const decoded = jwtDecode<TokenPayload>(token);
      setUser({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email
      });
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await api.post('/auth/register', { nome: name, email, senha: password });
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await api.post('/api/auth/solicitar-recuperacao', { email });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    api.defaults.headers.common['Authorization'] = '';
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        login,
        register,
        forgotPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}
