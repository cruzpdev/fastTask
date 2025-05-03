import api from './api';

export interface Lista {
  id: number;
  titulo: string;
  descricao: string;
  cor: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CriarListaDTO {
  titulo: string;
  descricao?: string;
  cor?: string;
}

export interface AtualizarListaDTO {
  titulo?: string;
  descricao?: string;
  cor?: string;
}

// Buscar todas as listas do usuário
export const buscarListas = async (): Promise<Lista[]> => {
  const response = await api.get('/api/v1/listas');
  return response.data;
};

// Buscar uma lista específica
export const buscarLista = async (id: number): Promise<Lista> => {
  const response = await api.get(`/api/v1/listas/${id}`);
  return response.data;
};

// Criar uma nova lista
export const criarLista = async (data: CriarListaDTO): Promise<Lista> => {
  const response = await api.post('/api/v1/listas', data);
  return response.data;
};

// Atualizar uma lista existente
export const atualizarLista = async (id: number, data: AtualizarListaDTO): Promise<Lista> => {
  const response = await api.put(`/api/v1/listas/${id}`, data);
  return response.data;
};

// Excluir uma lista
export const excluirLista = async (id: number): Promise<void> => {
  await api.delete(`/api/v1/listas/${id}`);
};
