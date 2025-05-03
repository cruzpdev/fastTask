import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute: React.FC = () => {
  const { signed, loading } = useAuth();

  if (loading) {
    // Pode-se adicionar um componente de loading aqui
    return <div className="auth-container">Carregando...</div>;
  }

  return signed ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
