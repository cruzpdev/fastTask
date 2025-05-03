import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ListaTarefas from './pages/ListaTarefas';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    // Pode-se adicionar um componente de loading aqui
    return <div className="auth-container">Carregando...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/recuperar-senha" element={<ForgotPassword />} />
        
        {/* Rotas privadas */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/listas/:listaId" element={<ListaTarefas />} />
        </Route>
        
        {/* Redirecionar para login ou dashboard dependendo do estado de autenticação */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
