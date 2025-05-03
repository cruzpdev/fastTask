import React from 'react';
import { Tarefa } from '../services/tarefasService';
import { FiEdit2, FiTrash2, FiCalendar, FiFlag } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Draggable } from 'react-beautiful-dnd';

interface TarefaItemProps {
  tarefa: Tarefa;
  index: number;
  onEditar: (tarefa: Tarefa) => void;
  onExcluir: (id: number) => void;
  onToggleConcluida: (id: number, concluida: boolean) => void;
}

const TarefaItem: React.FC<TarefaItemProps> = ({ 
  tarefa, 
  index,
  onEditar, 
  onExcluir, 
  onToggleConcluida 
}) => {
  const handleToggleConcluida = () => {
    onToggleConcluida(tarefa.id, !tarefa.concluida);
  };

  const handleEditar = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditar(tarefa);
  };

  const handleExcluir = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir a tarefa "${tarefa.titulo}"?`)) {
      onExcluir(tarefa.id);
    }
  };

  const getPrioridadeClasse = () => {
    switch (tarefa.prioridade) {
      case 'alta':
        return 'prioridade-alta';
      case 'media':
        return 'prioridade-media';
      case 'baixa':
        return 'prioridade-baixa';
      default:
        return '';
    }
  };

  const getPrioridadeTexto = () => {
    switch (tarefa.prioridade) {
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Média';
      case 'baixa':
        return 'Baixa';
      default:
        return 'Não definida';
    }
  };

  const formatarData = (data: string | null) => {
    if (!data) return 'Sem data';
    return format(new Date(data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <Draggable draggableId={tarefa.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          className={`tarefa-item ${tarefa.concluida ? 'tarefa-concluida' : ''} ${snapshot.isDragging ? 'tarefa-arrastando' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="tarefa-checkbox-container">
            <input
              type="checkbox"
              checked={tarefa.concluida}
              onChange={handleToggleConcluida}
              className="tarefa-checkbox"
              id={`tarefa-${tarefa.id}`}
            />
            <label 
              htmlFor={`tarefa-${tarefa.id}`}
              className="tarefa-checkbox-label"
            ></label>
          </div>
          
          <div className="tarefa-conteudo">
            <div className="tarefa-header">
              <h3 className={`tarefa-titulo ${tarefa.concluida ? 'tarefa-titulo-concluida' : ''}`}>
                {tarefa.titulo}
              </h3>
              <div className="tarefa-acoes">
                <button 
                  className="tarefa-botao" 
                  onClick={handleEditar}
                  aria-label="Editar tarefa"
                >
                  <FiEdit2 />
                </button>
                <button 
                  className="tarefa-botao" 
                  onClick={handleExcluir}
                  aria-label="Excluir tarefa"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
            
            {tarefa.descricao && (
              <p className="tarefa-descricao">{tarefa.descricao}</p>
            )}
            
            <div className="tarefa-footer">
              {tarefa.dataVencimento && (
                <div className="tarefa-data">
                  <FiCalendar className="tarefa-icone" />
                  <span>{formatarData(tarefa.dataVencimento)}</span>
                </div>
              )}
              
              <div className={`tarefa-prioridade ${getPrioridadeClasse()}`}>
                <FiFlag className="tarefa-icone" />
                <span>{getPrioridadeTexto()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TarefaItem;
