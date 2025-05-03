import React from 'react';
import { FiFilter, FiChevronDown } from 'react-icons/fi';

export type FiltroStatus = 'todas' | 'pendentes' | 'concluidas';
export type FiltroOrdenacao = 'posicao' | 'data' | 'prioridade' | 'alfabetica';
export type FiltroPrioridade = 'todas' | 'baixa' | 'media' | 'alta';

interface FiltrosTarefasProps {
  filtroStatus: FiltroStatus;
  setFiltroStatus: (filtro: FiltroStatus) => void;
  filtroOrdenacao: FiltroOrdenacao;
  setFiltroOrdenacao: (ordenacao: FiltroOrdenacao) => void;
  filtroPrioridade: FiltroPrioridade;
  setFiltroPrioridade: (prioridade: FiltroPrioridade) => void;
  totalTarefas: number;
  totalConcluidas: number;
}

const FiltrosTarefas: React.FC<FiltrosTarefasProps> = ({
  filtroStatus,
  setFiltroStatus,
  filtroOrdenacao,
  setFiltroOrdenacao,
  filtroPrioridade,
  setFiltroPrioridade,
  totalTarefas,
  totalConcluidas,
}) => {
  return (
    <div className="filtros-container">
      <div className="filtros-info">
        <div className="filtros-contador">
          <span className="filtros-total">
            {totalTarefas} {totalTarefas === 1 ? 'tarefa' : 'tarefas'}
          </span>
          <span className="filtros-concluidas">
            {totalConcluidas} {totalConcluidas === 1 ? 'concluída' : 'concluídas'}
          </span>
        </div>
      </div>

      <div className="filtros-controles">
        <div className="filtro-grupo">
          <label htmlFor="filtroStatus" className="filtro-label">
            <FiFilter className="filtro-icone" />
            <span>Status:</span>
          </label>
          <div className="filtro-select-container">
            <select
              id="filtroStatus"
              className="filtro-select"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value as FiltroStatus)}
            >
              <option value="todas">Todas</option>
              <option value="pendentes">Pendentes</option>
              <option value="concluidas">Concluídas</option>
            </select>
            <FiChevronDown className="filtro-select-icone" />
          </div>
        </div>

        <div className="filtro-grupo">
          <label htmlFor="filtroPrioridade" className="filtro-label">
            <FiFilter className="filtro-icone" />
            <span>Prioridade:</span>
          </label>
          <div className="filtro-select-container">
            <select
              id="filtroPrioridade"
              className="filtro-select"
              value={filtroPrioridade}
              onChange={(e) => setFiltroPrioridade(e.target.value as FiltroPrioridade)}
            >
              <option value="todas">Todas</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
            <FiChevronDown className="filtro-select-icone" />
          </div>
        </div>

        <div className="filtro-grupo">
          <label htmlFor="filtroOrdenacao" className="filtro-label">
            <FiFilter className="filtro-icone" />
            <span>Ordenar por:</span>
          </label>
          <div className="filtro-select-container">
            <select
              id="filtroOrdenacao"
              className="filtro-select"
              value={filtroOrdenacao}
              onChange={(e) => setFiltroOrdenacao(e.target.value as FiltroOrdenacao)}
            >
              <option value="posicao">Posição</option>
              <option value="data">Data de vencimento</option>
              <option value="prioridade">Prioridade</option>
              <option value="alfabetica">Alfabética</option>
            </select>
            <FiChevronDown className="filtro-select-icone" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltrosTarefas;
