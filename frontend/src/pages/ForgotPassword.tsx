import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

// Schema de validação
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty('O e-mail é obrigatório')
    .email('Formato de e-mail inválido')
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const { forgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      setApiError('');
      setSuccess(false);
      await forgotPassword(data.email);
      setSuccess(true);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError('Erro ao solicitar recuperação de senha. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">FAST TASK</h1>
        <h2 className="text-center mb-3">Recuperar Senha</h2>

        {apiError && (
          <div className="form-error text-center mb-3">{apiError}</div>
        )}

        {success ? (
          <div>
            <div className="text-center mb-3" style={{ color: 'var(--secondary-color)' }}>
              Um link para redefinição de senha foi enviado para o seu e-mail.
              Por favor, verifique sua caixa de entrada.
            </div>
            <div className="auth-links">
              <Link to="/login" className="auth-link">
                Voltar para o login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <p className="mb-3">
              Digite seu e-mail abaixo e enviaremos um link para redefinir sua senha.
            </p>
            
            <Input
              label="E-mail"
              type="email"
              placeholder="Seu e-mail cadastrado"
              error={errors.email?.message}
              {...register('email')}
            />

            <Button
              type="submit"
              fullWidth
              isLoading={loading}
            >
              Enviar Link de Recuperação
            </Button>
            
            <div className="auth-links">
              <p className="mt-3">
                <Link to="/login" className="auth-link">
                  Voltar para o login
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
