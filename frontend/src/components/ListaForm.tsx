import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from './Button';
import Input from './Input';
import { Lista } from '../services/listasService';

const coresDisponiveis = [
  '#FF6B6B', // Vermelho
  '#FFD166', // Amarelo
  '#06D6A0', // Verde
  '#118AB2', // Azul
  '#073B4C', // Azul escuro
  '#7209B7', // Roxo
  '#F72585', // Rosa
  '#3A86FF', // Azul claro
  '#8D99AE', // Cinza azulado
  '#EF476F', // Rosa escuro
];

const listaSchema = z.object({
  titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres').max(100, 'O título deve ter no máximo 100 caracteres'),
  descricao: z.string().max(500, 'A descrição deve ter no máximo 500 caracteres').optional(),
});

type ListaFormData = z.infer<typeof listaSchema>;

interface ListaFormProps {
  listaAtual?: Lista;
  onSubmit: (data: ListaFormData & { cor: string }) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ListaForm: React.FC<ListaFormProps> = ({ 
  listaAtual, 
  onSubmit, 
  onCancel, 
  isLoading 
}) => {
  const [corSelecionada, setCorSelecionada] = useState<string>(
    listaAtual?.cor || coresDisponiveis[0]
  );

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<ListaFormData>({
    resolver: zodResolver(listaSchema),
    defaultValues: {
      titulo: listaAtual?.titulo || '',
      descricao: listaAtual?.descricao || '',
    }
  });

  useEffect(() => {
    if (listaAtual) {
      reset({
        titulo: listaAtual.titulo,
        descricao: listaAtual.descricao,
      });
      setCorSelecionada(listaAtual.cor);
    }
  }, [listaAtual, reset]);

  const handleFormSubmit = (data: ListaFormData) => {
    onSubmit({
      ...data,
      cor: corSelecionada,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="lista-form">
      <div className="form-group">
        <label htmlFor="titulo" className="form-label">Título</label>
        <Input
          id="titulo"
          type="text"
          placeholder="Digite o título da lista"
          label="Título"
          {...register('titulo')}
          error={errors.titulo?.message}
        />
      </div>

      <div className="form-group">
        <label htmlFor="descricao" className="form-label">Descrição (opcional)</label>
        <textarea
          id="descricao"
          placeholder="Digite uma descrição para a lista"
          className={`form-textarea ${errors.descricao ? 'form-textarea-error' : ''}`}
          {...register('descricao')}
        />
        {errors.descricao && (
          <span className="form-error">{errors.descricao.message}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Cor</label>
        <div className="cores-container">
          {coresDisponiveis.map((cor) => (
            <button
              key={cor}
              type="button"
              className={`cor-opcao ${corSelecionada === cor ? 'cor-selecionada' : ''}`}
              style={{ backgroundColor: cor }}
              onClick={() => setCorSelecionada(cor)}
              aria-label={`Selecionar cor ${cor}`}
            />
          ))}
        </div>
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
          {isLoading ? 'Salvando...' : listaAtual ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
};

export default ListaForm;
