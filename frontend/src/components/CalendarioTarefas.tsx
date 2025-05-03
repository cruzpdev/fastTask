import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Tarefa } from '../services/tarefasService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface CalendarioTarefasProps {
  tarefas: Tarefa[];
  onDiaClick: (data: Date, tarefasDoDia: Tarefa[]) => void;
}

const CalendarioTarefas: React.FC<CalendarioTarefasProps> = ({ tarefas, onDiaClick }) => {
  const [dataAtual, setDataAtual] = useState<Date>(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState<boolean>(false);

  // Agrupa tarefas por data
  const tarefasPorData = tarefas.reduce((acc, tarefa) => {
    if (tarefa.dataVencimento) {
      const data = tarefa.dataVencimento.split('T')[0];
      if (!acc[data]) {
        acc[data] = [];
      }
      acc[data].push(tarefa);
    }
    return acc;
  }, {} as Record<string, Tarefa[]>);

  // Função removida pois não estava sendo utilizada

  // Retorna as tarefas de uma data específica
  const getTarefasDaData = (data: Date): Tarefa[] => {
    const dataFormatada = format(data, 'yyyy-MM-dd');
    return tarefasPorData[dataFormatada] || [];
  };

  // Personaliza a aparência dos dias no calendário
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const tarefasDoDia = getTarefasDaData(date);
    if (tarefasDoDia.length === 0) return null;

    return (
      <div className="calendario-tarefa-indicador">
        <span className="calendario-tarefa-contador">{tarefasDoDia.length}</span>
      </div>
    );
  };

  // Personaliza a classe dos dias no calendário
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';

    const tarefasDoDia = getTarefasDaData(date);
    const temTarefasConcluidas = tarefasDoDia.some(t => t.concluida);
    const temTarefasPendentes = tarefasDoDia.some(t => !t.concluida);

    if (temTarefasPendentes && temTarefasConcluidas) {
      return 'calendario-dia-misto';
    } else if (temTarefasPendentes) {
      return 'calendario-dia-pendente';
    } else if (temTarefasConcluidas) {
      return 'calendario-dia-concluido';
    }

    return '';
  };

  const handleDiaClick = (data: Date) => {
    const tarefasDoDia = getTarefasDaData(data);
    onDiaClick(data, tarefasDoDia);
  };

  const toggleCalendario = () => {
    setMostrarCalendario(!mostrarCalendario);
  };

  return (
    <div className="calendario-container">
      <div className="calendario-header">
        <h2 className="calendario-titulo">
          <FiCalendar className="calendario-icone" />
          Calendário de Tarefas
        </h2>
        <button 
          className="calendario-toggle"
          onClick={toggleCalendario}
          aria-label={mostrarCalendario ? 'Esconder calendário' : 'Mostrar calendário'}
        >
          {mostrarCalendario ? 'Esconder' : 'Mostrar'}
        </button>
      </div>

      {mostrarCalendario && (
        <div className="calendario-wrapper">
          <Calendar
            onChange={(value) => {
              if (value instanceof Date) {
                setDataAtual(value);
              }
            }}
            value={dataAtual}
            onClickDay={handleDiaClick}
            tileContent={tileContent}
            tileClassName={tileClassName}
            locale="pt-BR"
            prevLabel={<FiChevronLeft />}
            nextLabel={<FiChevronRight />}
            prev2Label={null}
            next2Label={null}
            formatDay={(_, date) => format(date, 'd')}
            formatMonthYear={(_, date) => 
              format(date, "MMMM 'de' yyyy", { locale: ptBR })
            }
          />
        </div>
      )}
    </div>
  );
};

export default CalendarioTarefas;
