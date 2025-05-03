import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import Header from '../components/Header';
import TarefaItem from '../components/TarefaItem';
import Modal from '../components/Modal';
import TarefaForm from '../components/TarefaForm';
import FiltrosTarefas, { 
  FiltroStatus, 
  FiltroOrdenacao, 
  FiltroPrioridade 
} from '../components/FiltrosTarefas';
import { buscarLista } from '../services/listasService';
import { 
  buscarTarefas, 
  criarTarefa, 
  atualizarTarefa, 
  excluirTarefa, 
  alterarStatusTarefa, 
  reordenarTarefas,
  Tarefa, 
  CriarTarefaDTO, 
  AtualizarTarefaDTO 
} from '../services/tarefasService';
import { FiPlus, FiCheck, FiX } from 'react-icons/fi';

const ListaTarefas: React.FC = () => {
  const { listaId } = useParams<{ listaId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaAtual, setTarefaAtual] = useState<Tarefa | undefined>(undefined);
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('todas');
  const [filtroOrdenacao, setFiltroOrdenacao] = useState<FiltroOrdenacao>('posicao');
  const [filtroPrioridade, setFiltroPrioridade] = useState<FiltroPrioridade>('todas');
  const [todasSelecionadas, setTodasSelecionadas] = useState(false);
  const [tarefasSelecionadas, setTarefasSelecionadas] = useState<number[]>([]);

  // Validar listaId
  const idLista = listaId ? parseInt(listaId) : 0;
  
  if (isNaN(idLista) || idLista <= 0) {
    navigate('/dashboard');
  }

  // Consulta para buscar detalhes da lista
  const { 
    data: lista, 
    isLoading: carregandoLista, 
    error: erroLista 
  } = useQuery(['lista', idLista], () => buscarLista(idLista), {
    enabled: !!idLista,
    onError: () => {
      toast.error('Erro ao carregar detalhes da lista');
      navigate('/dashboard');
    }
  });

  // Consulta para buscar tarefas da lista
  const { 
    data: tarefas, 
    isLoading: carregandoTarefas, 
    error: erroTarefas 
  } = useQuery(['tarefas', idLista], () => buscarTarefas(idLista), {
    enabled: !!idLista,
    onError: () => {
      toast.error('Erro ao carregar tarefas');
    }
  });

  // Mutação para criar tarefa
  const criarTarefaMutation = useMutation(
    (data: CriarTarefaDTO) => criarTarefa(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tarefas', idLista]);
        queryClient.invalidateQueries('todasTarefas');
        setModalAberto(false);
        toast.success('Tarefa criada com sucesso!');
      },
      onError: (error: any) => {
        toast.error(`Erro ao criar tarefa: ${error.response?.data?.message || 'Erro desconhecido'}`);
      }
    }
  );

  // Mutação para atualizar tarefa
  const atualizarTarefaMutation = useMutation(
    ({ id, data }: { id: number; data: AtualizarTarefaDTO }) => atualizarTarefa(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tarefas', idLista]);
        queryClient.invalidateQueries('todasTarefas');
        setModalAberto(false);
        setTarefaAtual(undefined);
        toast.success('Tarefa atualizada com sucesso!');
      },
      onError: (error: any) => {
        toast.error(`Erro ao atualizar tarefa: ${error.response?.data?.message || 'Erro desconhecido'}`);
      }
    }
  );

  // Mutação para excluir tarefa
  const excluirTarefaMutation = useMutation(
    (id: number) => excluirTarefa(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tarefas', idLista]);
        queryClient.invalidateQueries('todasTarefas');
        toast.success('Tarefa excluída com sucesso!');
      },
      onError: (error: any) => {
        toast.error(`Erro ao excluir tarefa: ${error.response?.data?.message || 'Erro desconhecido'}`);
      }
    }
  );

  // Mutação para alterar status da tarefa
  const alterarStatusTarefaMutation = useMutation(
    ({ id, concluida }: { id: number; concluida: boolean }) => alterarStatusTarefa(id, concluida),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tarefas', idLista]);
        queryClient.invalidateQueries('todasTarefas');
      },
      onError: (error: any) => {
        toast.error(`Erro ao alterar status da tarefa: ${error.response?.data?.message || 'Erro desconhecido'}`);
      }
    }
  );

  // Mutação para reordenar tarefas
  const reordenarTarefasMutation = useMutation(
    ({ tarefaId, novaPosicao }: { tarefaId: number; novaPosicao: number }) => 
      reordenarTarefas(idLista, { tarefaId, novaPosicao }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tarefas', idLista]);
      },
      onError: (error: any) => {
        toast.error(`Erro ao reordenar tarefas: ${error.response?.data?.message || 'Erro desconhecido'}`);
        // Recarregar as tarefas para restaurar a ordem original
        queryClient.invalidateQueries(['tarefas', idLista]);
      }
    }
  );

  // Mutação para alterar status de múltiplas tarefas
  const alterarStatusMultiplasTarefasMutation = useMutation(
    ({ ids, concluida }: { ids: number[]; concluida: boolean }) => 
      Promise.all(ids.map(id => alterarStatusTarefa(id, concluida))),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tarefas', idLista]);
        queryClient.invalidateQueries('todasTarefas');
        setTarefasSelecionadas([]);
        toast.success('Status das tarefas alterado com sucesso!');
      },
      onError: (error: any) => {
        toast.error(`Erro ao alterar status das tarefas: ${error.response?.data?.message || 'Erro desconhecido'}`);
      }
    }
  );

  // Resetar seleção quando as tarefas mudarem
  useEffect(() => {
    setTarefasSelecionadas([]);
    setTodasSelecionadas(false);
  }, [tarefas]);

  const handleAbrirModal = () => {
    setTarefaAtual(undefined);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setTarefaAtual(undefined);
  };

  const handleEditarTarefa = (tarefa: Tarefa) => {
    setTarefaAtual(tarefa);
    setModalAberto(true);
  };

  const handleExcluirTarefa = (id: number) => {
    excluirTarefaMutation.mutate(id);
  };

  const handleToggleConcluida = (id: number, concluida: boolean) => {
    alterarStatusTarefaMutation.mutate({ id, concluida });
  };

  const handleSubmitTarefa = (data: CriarTarefaDTO) => {
    if (tarefaAtual) {
      atualizarTarefaMutation.mutate({ 
        id: tarefaAtual.id, 
        data: {
          titulo: data.titulo,
          descricao: data.descricao,
          dataVencimento: data.dataVencimento,
          prioridade: data.prioridade,
        } 
      });
    } else {
      criarTarefaMutation.mutate({
        ...data,
        listaId: idLista,
      });
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Se não houver destino ou se o item for solto na mesma posição
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const tarefaId = parseInt(draggableId);
    
    // Atualizar a posição da tarefa
    reordenarTarefasMutation.mutate({
      tarefaId,
      novaPosicao: destination.index,
    });
  };

  const handleSelecionarTarefa = (id: number, selecionada: boolean) => {
    if (selecionada) {
      setTarefasSelecionadas(prev => [...prev, id]);
    } else {
      setTarefasSelecionadas(prev => prev.filter(tarefaId => tarefaId !== id));
    }
  };

  const handleSelecionarTodas = () => {
    if (!tarefas) return;
    
    const novoEstado = !todasSelecionadas;
    setTodasSelecionadas(novoEstado);
    
    if (novoEstado) {
      const tarefasFiltradas = filtrarTarefas(tarefas);
      setTarefasSelecionadas(tarefasFiltradas.map(t => t.id));
    } else {
      setTarefasSelecionadas([]);
    }
  };

  const handleMarcarSelecionadasConcluidas = () => {
    if (tarefasSelecionadas.length === 0) return;
    
    alterarStatusMultiplasTarefasMutation.mutate({
      ids: tarefasSelecionadas,
      concluida: true,
    });
  };

  const handleMarcarSelecionadasPendentes = () => {
    if (tarefasSelecionadas.length === 0) return;
    
    alterarStatusMultiplasTarefasMutation.mutate({
      ids: tarefasSelecionadas,
      concluida: false,
    });
  };

  // Função para filtrar tarefas com base nos filtros selecionados
  const filtrarTarefas = (tarefas: Tarefa[]): Tarefa[] => {
    let tarefasFiltradas = [...tarefas];
    
    // Filtrar por status
    if (filtroStatus === 'pendentes') {
      tarefasFiltradas = tarefasFiltradas.filter(t => !t.concluida);
    } else if (filtroStatus === 'concluidas') {
      tarefasFiltradas = tarefasFiltradas.filter(t => t.concluida);
    }
    
    // Filtrar por prioridade
    if (filtroPrioridade !== 'todas') {
      tarefasFiltradas = tarefasFiltradas.filter(t => t.prioridade === filtroPrioridade);
    }
    
    // Ordenar tarefas
    tarefasFiltradas.sort((a, b) => {
      switch (filtroOrdenacao) {
        case 'posicao':
          return a.posicao - b.posicao;
        case 'data':
          // Tarefas sem data vão para o final
          if (!a.dataVencimento && !b.dataVencimento) return 0;
          if (!a.dataVencimento) return 1;
          if (!b.dataVencimento) return -1;
          return new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime();
        case 'prioridade':
          const prioridadeValor = { alta: 0, media: 1, baixa: 2 };
          return prioridadeValor[a.prioridade] - prioridadeValor[b.prioridade];
        case 'alfabetica':
          return a.titulo.localeCompare(b.titulo, 'pt-BR');
        default:
          return 0;
      }
    });
    
    return tarefasFiltradas;
  };

  // Calcular estatísticas
  const totalTarefas = tarefas?.length || 0;
  const totalConcluidas = tarefas?.filter(t => t.concluida).length || 0;

  // Filtrar tarefas para exibição
  const tarefasFiltradas = tarefas ? filtrarTarefas(tarefas) : [];

  if (carregandoLista && !lista) {
    return (
      <div className="container">
        <Header mostrarBotaoVoltar={true} />
        <div className="carregando-container">
          <div className="carregando-spinner"></div>
          <p>Carregando detalhes da lista...</p>
        </div>
      </div>
    );
  }

  if (erroLista) {
    return (
      <div className="container">
        <Header mostrarBotaoVoltar={true} />
        <div className="erro-container">
          <p>Erro ao carregar detalhes da lista. Por favor, tente novamente.</p>
          <button 
            onClick={() => queryClient.invalidateQueries(['lista', idLista])}
            className="botao-tentar-novamente"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Header 
        titulo={lista?.titulo || 'Lista de Tarefas'} 
        mostrarBotaoVoltar={true} 
      />
      
      <div className="lista-tarefas-container">
        <div className="lista-tarefas-header">
          <div className="lista-tarefas-info">
            <h1 className="lista-tarefas-titulo">{lista?.titulo}</h1>
            {lista?.descricao && (
              <p className="lista-tarefas-descricao">{lista.descricao}</p>
            )}
          </div>
          
          <div className="lista-tarefas-acoes">
            <button 
              className="botao-adicionar"
              onClick={handleAbrirModal}
              aria-label="Adicionar nova tarefa"
            >
              <FiPlus />
              <span>Nova Tarefa</span>
            </button>
          </div>
        </div>
        
        <FiltrosTarefas
          filtroStatus={filtroStatus}
          setFiltroStatus={setFiltroStatus}
          filtroOrdenacao={filtroOrdenacao}
          setFiltroOrdenacao={setFiltroOrdenacao}
          filtroPrioridade={filtroPrioridade}
          setFiltroPrioridade={setFiltroPrioridade}
          totalTarefas={totalTarefas}
          totalConcluidas={totalConcluidas}
        />
        
        {tarefasSelecionadas.length > 0 && (
          <div className="tarefas-selecao-acoes">
            <span className="tarefas-selecao-contador">
              {tarefasSelecionadas.length} {tarefasSelecionadas.length === 1 ? 'tarefa selecionada' : 'tarefas selecionadas'}
            </span>
            <div className="tarefas-selecao-botoes">
              <button 
                className="botao-marcar-concluidas"
                onClick={handleMarcarSelecionadasConcluidas}
                aria-label="Marcar selecionadas como concluídas"
              >
                <FiCheck />
                <span>Marcar como concluídas</span>
              </button>
              <button 
                className="botao-marcar-pendentes"
                onClick={handleMarcarSelecionadasPendentes}
                aria-label="Marcar selecionadas como pendentes"
              >
                <FiX />
                <span>Marcar como pendentes</span>
              </button>
            </div>
          </div>
        )}
        
        {carregandoTarefas && !tarefas ? (
          <div className="carregando-container">
            <div className="carregando-spinner"></div>
            <p>Carregando tarefas...</p>
          </div>
        ) : erroTarefas ? (
          <div className="erro-container">
            <p>Erro ao carregar tarefas. Por favor, tente novamente.</p>
            <button 
              onClick={() => queryClient.invalidateQueries(['tarefas', idLista])}
              className="botao-tentar-novamente"
            >
              Tentar novamente
            </button>
          </div>
        ) : tarefasFiltradas.length > 0 ? (
          <div className="tarefas-lista">
            <div className="tarefas-selecionar-todas">
              <input
                type="checkbox"
                id="selecionar-todas"
                checked={todasSelecionadas}
                onChange={handleSelecionarTodas}
                className="checkbox-selecionar-todas"
              />
              <label htmlFor="selecionar-todas" className="label-selecionar-todas">
                Selecionar todas
              </label>
            </div>
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="tarefas">
                {(provided) => (
                  <div
                    className="tarefas-droppable"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {tarefasFiltradas.map((tarefa, index) => (
                      <div key={tarefa.id} className="tarefa-container">
                        <input
                          type="checkbox"
                          checked={tarefasSelecionadas.includes(tarefa.id)}
                          onChange={(e) => handleSelecionarTarefa(tarefa.id, e.target.checked)}
                          className="tarefa-checkbox-selecao"
                          id={`selecao-tarefa-${tarefa.id}`}
                        />
                        <TarefaItem
                          tarefa={tarefa}
                          index={index}
                          onEditar={handleEditarTarefa}
                          onExcluir={handleExcluirTarefa}
                          onToggleConcluida={handleToggleConcluida}
                        />
                      </div>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        ) : (
          <div className="tarefas-vazio">
            <p>
              {filtroStatus !== 'todas' || filtroPrioridade !== 'todas'
                ? 'Nenhuma tarefa encontrada com os filtros selecionados.'
                : 'Você ainda não tem nenhuma tarefa nesta lista.'}
            </p>
            {filtroStatus === 'todas' && filtroPrioridade === 'todas' && (
              <button 
                onClick={handleAbrirModal}
                className="botao-criar-primeira-tarefa"
              >
                Criar minha primeira tarefa
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Modal para criar/editar tarefa */}
      <Modal
        isOpen={modalAberto}
        onClose={handleFecharModal}
        titulo={tarefaAtual ? 'Editar Tarefa' : 'Nova Tarefa'}
      >
        <TarefaForm
          tarefaAtual={tarefaAtual}
          listaId={idLista}
          onSubmit={handleSubmitTarefa}
          onCancel={handleFecharModal}
          isLoading={criarTarefaMutation.isLoading || atualizarTarefaMutation.isLoading}
        />
      </Modal>
    </div>
  );
};

export default ListaTarefas;
