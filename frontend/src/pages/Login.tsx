import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

// Schema de validação
const loginSchema = z.object({
  email: z
    .string()
    .nonempty('O e-mail é obrigatório')
    .email('Formato de e-mail inválido'),
  password: z
    .string()
    .nonempty('A senha é obrigatória')
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setApiError('');
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">FAST TASK</h1>
        <h2 className="text-center mb-3">Entrar</h2>

        {apiError && (
          <div className="form-error text-center mb-3">{apiError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="E-mail"
            type="email"
            placeholder="Seu e-mail"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Sua senha"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            fullWidth
            isLoading={loading}
          >
            Entrar
          </Button>
        </form>

        <div className="auth-links">
          <p>
            <Link to="/recuperar-senha" className="auth-link">
              Esqueceu sua senha?
            </Link>
          </p>
          <p className="mt-3">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="auth-link">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
