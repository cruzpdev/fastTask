import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import ListaCard from '../components/ListaCard';
import Modal from '../components/Modal';
import ListaForm from '../components/ListaForm';
import CalendarioTarefas from '../components/CalendarioTarefas';
import { 
  buscarListas, 
  criarLista, 
  atualizarLista, 
  excluirLista, 
  Lista, 
  CriarListaDTO, 
  AtualizarListaDTO 
} from '../services/listasService';
import { buscarTodasTarefas, Tarefa } from '../services/tarefasService';
import { FiPlus, FiList, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [modalAberto, setModalAberto] = useState(false);
  const [listaAtual, setListaAtual] = useState<Lista | undefined>(undefined);
  const [modalTarefasDoDia, setModalTarefasDoDia] = useState(false);
  const [tarefasSelecionadas, setTarefasSelecionadas] = useState<Tarefa[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [visualizacao, setVisualizacao] = useState<'listas' | 'calendario'>('listas');

  // Consulta para buscar listas
  const {
    data: listas = [], // <-- valor padrão definido aqui
    isLoading: carregandoListas,
    error: erroListas,
  } = useQuery('listas', buscarListas);  

  // Consulta para buscar todas as tarefas (para o calendário)
  const {
    data: tarefas,
    isLoading: carregandoTarefas,
    error: erroTarefas,
    refetch: refetchTarefas
  } = useQuery('todasTarefas', buscarTodasTarefas, {
    retry: false
  });
  
  // Mutação para criar lista
  const criarListaMutation = useMutation(
    (data: CriarListaDTO) => criarLista(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('listas');
        setModalAberto(false);
        toast.success('Lista criada com sucesso!');
      },
      onError: (error: any) => {
        toast.error(`Erro ao criar lista: ${error.response?.data?.message || 'Erro desconhecido'}`);
      }
    }
  );

  // Mutação para atualizar lista
  const atualizarListaMutation = useMutation(
    ({ id, data }: { id: number; data: AtualizarListaDTO }) => atualizarLista(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('listas');
        setModalAberto(false);
        setListaAtual(undefined);
        toast.success('Lista atualizada com sucesso!');
      },
      onError: (error: any) => {
        toast.error(`Erro ao atualizar lista: ${error.response?.data?.message || 'Erro desconhecido'}`);
      }
    }
  );

  // Mutação para excluir lista
  const excluirListaMutation = useMutation(
    (id: number) => excluirLista(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('listas');
        toast.success('Lista excluída com sucesso!');
      },
      onError: (error: any) => {
        toast.error(`Erro ao excluir lista: ${error.response?.data?.message || 'Erro desconhecido'}`);
      }
    }
  );

  const handleAbrirModal = () => {
    setListaAtual(undefined);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setListaAtual(undefined);
  };

  const handleEditarLista = (lista: Lista) => {
    setListaAtual(lista);
    setModalAberto(true);
  };

  const handleExcluirLista = (id: number) => {
    excluirListaMutation.mutate(id);
  };

  const handleSubmitLista = (data: CriarListaDTO & { cor: string }) => {
    if (listaAtual) {
      atualizarListaMutation.mutate({ 
        id: listaAtual.id, 
        data 
      });
    } else {
      criarListaMutation.mutate(data);
    }
  };

  const handleDiaClick = (data: Date, tarefasDoDia: Tarefa[]) => {
    setDataSelecionada(data);
    setTarefasSelecionadas(tarefasDoDia);
    setModalTarefasDoDia(true);
  };

  const formatarData = (data: Date): string => {
    return format(data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  React.useEffect(() => {
    refetchTarefas();
  }, []);  

  if (carregandoListas) {
    return (
      <div className="container">
        <Header titulo="FAST TASK" />
        <div className="carregando-container">
          <div className="carregando-spinner" />
          <p>Carregando listas...</p>
        </div>
      </div>
    );
  }
  
  if (erroListas) {
    return (
      <div className="container">
        <Header titulo="FAST TASK" />
        <div className="erro-container">
          <p>Erro ao carregar listas. Por favor, tente novamente.</p>
          <button
            onClick={() => queryClient.invalidateQueries('listas')}
            className="botao-tentar-novamente"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }
  
  if (!carregandoListas && listas.length === 0) {
    return (
      <div className="container">
        <Header titulo="FAST TASK" />
        <div className="lista-vazia-container">
          <p>Você ainda não tem nenhuma lista criada.</p>
          <p>Clique no botão "+" para começar!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container">
      <Header titulo="FAST TASK" />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="dashboard-titulo-container">
            <h1 className="dashboard-titulo">Meu Dashboard</h1>
          </div>
          
          <div className="dashboard-acoes">
            <div className="dashboard-visualizacao">
              <button 
                className={`botao-visualizacao ${visualizacao === 'listas' ? 'ativo' : ''}`}
                onClick={() => setVisualizacao('listas')}
                aria-label="Visualizar listas"
              >
                <FiList />
                <span>Listas</span>
              </button>
              <button 
                className={`botao-visualizacao ${visualizacao === 'calendario' ? 'ativo' : ''}`}
                onClick={() => setVisualizacao('calendario')}
                aria-label="Visualizar calendário"
              >
                <FiCalendar />
                <span>Calendário</span>
              </button>
            </div>
            
            <button 
              className="botao-adicionar"
              onClick={handleAbrirModal}
              aria-label="Adicionar nova lista"
            >
              <FiPlus />
              <span>Nova Lista</span>
            </button>
          </div>
        </div>
        
        {visualizacao === 'listas' ? (
          <div className="listas-container">
            {listas && listas.length > 0 ? (
              <div className="listas-grid">
                {listas.map((lista) => (
                  <ListaCard
                    key={lista.id}
                    lista={lista}
                    onEditar={handleEditarLista}
                    onExcluir={handleExcluirLista}
                  />
                ))}
              </div>
            ) : (
              <div className="listas-vazio">
                <p>Você ainda não tem nenhuma lista de tarefas.</p>
                <button 
                  onClick={handleAbrirModal}
                  className="botao-criar-primeira-lista">
                  Criar minha primeira lista
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="calendario-view">
            {carregandoTarefas ? (
              <div className="carregando-container">
                <div className="carregando-spinner"></div>
                <p>Carregando tarefas...</p>
              </div>
            ) : erroTarefas ? (
              <div className="erro-container">
                <p>Erro ao carregar tarefas. Por favor, tente novamente.</p>
                <button 
                  onClick={() => queryClient.invalidateQueries('todasTarefas')}
                  className="botao-tentar-novamente"
                >
                  Tentar novamente
                </button>
              </div>
            ) : (
              <CalendarioTarefas 
                tarefas={tarefas || []} 
                onDiaClick={handleDiaClick} 
              />
            )}
          </div>
        )}
      </div>
      
      {/* Modal para criar/editar lista */}
      <Modal
        isOpen={modalAberto}
        onClose={handleFecharModal}
        titulo={listaAtual ? 'Editar Lista' : 'Nova Lista'}
      >
        <ListaForm
          listaAtual={listaAtual}
          onSubmit={handleSubmitLista}
          onCancel={handleFecharModal}
          isLoading={criarListaMutation.isLoading || atualizarListaMutation.isLoading}
        />
      </Modal>
      
      {/* Modal para exibir tarefas do dia */}
      <Modal
        isOpen={modalTarefasDoDia}
        onClose={() => setModalTarefasDoDia(false)}
        titulo={dataSelecionada ? `Tarefas para ${formatarData(dataSelecionada)}` : 'Tarefas do Dia'}
        tamanho="medio"
      >
        <div className="tarefas-do-dia">
          {tarefasSelecionadas.length > 0 ? (
            <ul className="tarefas-do-dia-lista">
              {tarefasSelecionadas.map((tarefa) => (
                <li 
                  key={tarefa.id} 
                  className={`tarefa-do-dia-item ${tarefa.concluida ? 'concluida' : ''}`}
                >
                  <div className="tarefa-do-dia-status">
                    <span className={`tarefa-do-dia-indicador prioridade-${tarefa.prioridade}`}></span>
                  </div>
                  <div className="tarefa-do-dia-conteudo">
                    <h3 className="tarefa-do-dia-titulo">{tarefa.titulo}</h3>
                    {tarefa.descricao && (
                      <p className="tarefa-do-dia-descricao">{tarefa.descricao}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="tarefas-do-dia-vazio">
              Não há tarefas para este dia.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
