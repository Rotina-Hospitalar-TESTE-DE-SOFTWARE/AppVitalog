import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { HeartPulse, Mail, Lock, AlertTriangle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = (data) => {
    setLoginError('');
    const success = login(data.email, data.password);
    if (success) {
      navigate('/dashboard');
    } else {
      setLoginError('E-mail ou senha inválidos.');
    }
  };

  return (
    <div className="login-wrapper">
      <Card className="login-card animate-fade-in-up">
        <div className="login-header">
          <div className="login-brand-icon">
            <HeartPulse size={36} />
          </div>
          <h2 className="login-title">Vitalog</h2>
          <p className="login-subtitle">Monitore sua saúde com inteligência</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="E-mail"
            type="email"
            placeholder="Ex: admin@vitalog.com"
            icon={Mail}
            error={errors.email?.message}
            {...register('email', { 
              required: 'O e-mail é obrigatório',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Digite um e-mail válido'
              }
            })}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Digite vitalog123"
            icon={Lock}
            error={errors.password?.message}
            {...register('password', { 
              required: 'A senha é obrigatória',
              minLength: { value: 6, message: 'A senha deve ter no mínimo 6 caracteres' }
            })}
          />

          {loginError && (
            <div className="login-error-alert">
              <AlertTriangle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSubmitting}
            className="login-btn"
          >
            {isSubmitting ? 'Entrando...' : 'Acessar Vitalog'}
          </Button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '1rem', color: 'var(--text-secondary)' }}>
          Não tem uma conta? <Link to="/register" style={{ fontWeight: '700', color: 'var(--primary-color)' }}>Cadastre-se aqui</Link>
        </div>

        <div className="login-demo-helper">
          <p><strong>Acesso de Demonstração:</strong></p>
          <p>E-mail: <code>admin@vitalog.com</code> | Senha: <code>vitalog123</code></p>
        </div>
      </Card>

      <style dangerouslySetInnerHTML={{__html: `
        .login-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 24px;
        }
        .login-card {
          width: 100%;
          max-width: 420px;
          border-radius: var(--radius-lg);
          background: rgba(30, 41, 59, 0.55);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), var(--primary-glow);
          border-color: rgba(255, 255, 255, 0.05);
        }
        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .login-brand-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          background: var(--primary-glow);
          color: var(--primary-color);
          border-radius: var(--radius-md);
          margin-bottom: 16px;
          filter: drop-shadow(0 0 8px var(--primary-color));
        }
        .login-title {
          font-size: 2.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--text-primary) 30%, var(--primary-color) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .login-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-top: 6px;
        }
        .login-error-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--color-high-bg);
          border: 1px solid var(--color-high);
          color: var(--color-high);
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          margin-bottom: 20px;
          animation: shake 0.4s ease;
        }
        .login-btn {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          font-weight: 600;
        }
        .login-demo-helper {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid var(--surface-border);
          font-size: 0.8rem;
          color: var(--text-muted);
          text-align: center;
          line-height: 1.6;
        }
        .login-demo-helper code {
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--text-primary);
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
      `}} />
    </div>
  );
};

export default Login;
