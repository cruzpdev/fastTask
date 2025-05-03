import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from './Button';
import Input from './Input';
import { Tarefa, CriarTarefaDTO } from '../services/tarefasService';

const tarefaSchema = z.object({
  titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres').max(100, 'O título deve ter no máximo 100 caracteres'),
  descricao: z.string().max(500, 'A descrição deve ter no máximo 500 caracteres').optional(),
  dataVencimento: z.string().optional().nullable(),
  prioridade: z.enum(['baixa', 'media', 'alta']).default('media'),
});

type TarefaFormData = z.infer<typeof tarefaSchema> & { listaId?: number };

interface TarefaFormProps {
  tarefaAtual?: Tarefa;
  listaId: number;
  onSubmit: (data: CriarTarefaDTO) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const TarefaForm: React.FC<TarefaFormProps> = ({ 
  tarefaAtual, 
  listaId,
  onSubmit, 
  onCancel, 
  isLoading 
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<TarefaFormData>({
    resolver: zodResolver(tarefaSchema),
    defaultValues: {
      titulo: tarefaAtual?.titulo || '',
      descricao: tarefaAtual?.descricao || '',
      dataVencimento: tarefaAtual?.dataVencimento ? new Date(tarefaAtual.dataVencimento).toISOString().split('T')[0] : '',
      prioridade: tarefaAtual?.prioridade || 'media',
    }
  });

  const handleFormSubmit = (data: TarefaFormData) => {
    onSubmit({
      ...data,
      dataVencimento: data.dataVencimento || null,
      listaId: listaId,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="tarefa-form">
      <div className="form-group">
        <label htmlFor="titulo" className="form-label">Título</label>
        <Input
          id="titulo"
          type="text"
          placeholder="Digite o título da tarefa"
          label="Título"
          {...register('titulo')}
          error={errors.titulo?.message}
        />
      </div>

      <div className="form-group">
        <label htmlFor="descricao" className="form-label">Descrição (opcional)</label>
        <textarea
          id="descricao"
          placeholder="Digite uma descrição para a tarefa"
          className={`form-textarea ${errors.descricao ? 'form-textarea-error' : ''}`}
          {...register('descricao')}
        />
        {errors.descricao && (
          <span className="form-error">{errors.descricao.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="dataVencimento" className="form-label">Data de vencimento (opcional)</label>
        <Input
          id="dataVencimento"
          type="date"
          label="Data de vencimento (opcional)"
          {...register('dataVencimento')}
          error={errors.dataVencimento?.message}
        />
      </div>

      <div className="form-group">
        <label htmlFor="prioridade" className="form-label">Prioridade</label>
        <select
          id="prioridade"
          className="form-select"
          {...register('prioridade')}
        >
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
        {errors.prioridade && (
          <span className="form-error">{errors.prioridade.message}</span>
        )}
      </div>

      <div className="form-actions">
        <Button 
          type="button" 
          onClick={onCancel}
          className="botao-cancelar"
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          className="botao-salvar"
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : tarefaAtual ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
};

export default TarefaForm;
