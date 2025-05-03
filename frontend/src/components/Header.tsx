import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

interface HeaderProps {
  titulo?: string;
  mostrarBotaoVoltar?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  titulo = 'FAST TASK', 
  mostrarBotaoVoltar = false 
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleVoltar = () => {
    navigate(-1);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          {mostrarBotaoVoltar && (
            <button 
              className="botao-voltar" 
              onClick={handleVoltar}
              aria-label="Voltar"
            >
              ← Voltar
            </button>
          )}
          <h1 className="header-titulo">{titulo}</h1>
        </div>
        
        <div className="header-right">
          {user && (
            <div className="user-info">
              <span className="user-name">Olá, {user.name}</span>
              <Button onClick={handleLogout} className="botao-sair">
                Sair
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
