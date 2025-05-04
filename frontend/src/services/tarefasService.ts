import api from "./api";

export interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  concluida: boolean;
  dataVencimento: string | null;
  prioridade: "baixa" | "media" | "alta";
  posicao: number;
  listaId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CriarTarefaDTO {
  titulo: string;
  descricao?: string;
  dataVencimento?: string | null;
  prioridade?: "baixa" | "media" | "alta";
  listaId: number;
}

export interface AtualizarTarefaDTO {
  titulo?: string;
  descricao?: string;
  concluida?: boolean;
  dataVencimento?: string | null;
  prioridade?: "baixa" | "media" | "alta";
  posicao?: number;
}

export interface ReordenarTarefasDTO {
  tarefaId: number;
  novaPosicao: number;
}

// Buscar todas as tarefas de uma lista
export const buscarTarefas = async (listaId: number): Promise<Tarefa[]> => {
  const response = await api.get(`/listas/${listaId}/tarefas`);
  return response.data;
};

// Buscar uma tarefa específica
export const buscarTarefa = async (id: number): Promise<Tarefa> => {
  const response = await api.get(`/tarefas/${id}`);
  return response.data;
};

// Criar uma nova tarefa
export const criarTarefa = async (data: CriarTarefaDTO): Promise<Tarefa> => {
  const response = await api.post("/tarefas", data);
  return response.data;
};

// Atualizar uma tarefa existente
export const atualizarTarefa = async (
  id: number,
  data: AtualizarTarefaDTO
): Promise<Tarefa> => {
  const response = await api.put(`/tarefas/${id}`, data);
  return response.data;
};

// Excluir uma tarefa
export const excluirTarefa = async (id: number): Promise<void> => {
  await api.delete(`/tarefas/${id}`);
};

// Marcar tarefa como concluída ou não concluída
export const alterarStatusTarefa = async (
  id: number,
  concluida: boolean
): Promise<Tarefa> => {
  const response = await api.patch(`/tarefas/${id}/status`, {
    concluida,
  });
  return response.data;
};

// Reordenar tarefas
export const reordenarTarefas = async (
  listaId: number,
  data: ReordenarTarefasDTO
): Promise<void> => {
  await api.post(`/listas/${listaId}/tarefas/reordenar`, data);
};

// Buscar todas as tarefas do usuário (para o calendário)
export const buscarTodasTarefas = async (): Promise<Tarefa[]> => {
  const response = await api.get("/tarefas");
  return response.data;
};
