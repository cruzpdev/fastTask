import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lista } from '../services/listasService';
import { FiEdit2, FiTrash2, FiList } from 'react-icons/fi';

interface ListaCardProps {
  lista: Lista;
  onEditar: (lista: Lista) => void;
  onExcluir: (id: number) => void;
}

const ListaCard: React.FC<ListaCardProps> = ({ lista, onEditar, onExcluir }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/listas/${lista.id}`);
  };

  const handleEditar = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditar(lista);
  };

  const handleExcluir = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir a lista "${lista.titulo}"?`)) {
      onExcluir(lista.id);
    }
  };

  // Função para determinar a cor do texto baseada na cor de fundo
  const getTextColor = (backgroundColor: string) => {
    // Converte a cor para RGB
    let hex = backgroundColor.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(h => h + h).join('');
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calcula a luminosidade
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Retorna branco para cores escuras e preto para cores claras
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const cardStyle = {
    backgroundColor: lista.cor || '#f0f0f0',
    color: lista.cor ? getTextColor(lista.cor) : '#000000',
  };

  return (
    <div 
      className="lista-card" 
      style={cardStyle}
      onClick={handleClick}
    >
      <div className="lista-card-header">
        <h3 className="lista-card-titulo">{lista.titulo}</h3>
        <div className="lista-card-acoes">
          <button 
            className="lista-card-botao" 
            onClick={handleEditar}
            aria-label="Editar lista"
          >
            <FiEdit2 />
          </button>
          <button 
            className="lista-card-botao" 
            onClick={handleExcluir}
            aria-label="Excluir lista"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
      
      {lista.descricao && (
        <p className="lista-card-descricao">{lista.descricao}</p>
      )}
      
      <div className="lista-card-footer">
        <span className="lista-card-icon">
          <FiList />
        </span>
        <span className="lista-card-data">
          Criada em: {new Date(lista.createdAt).toLocaleDateString('pt-BR')}
        </span>
      </div>
    </div>
  );
};

export default ListaCard;
