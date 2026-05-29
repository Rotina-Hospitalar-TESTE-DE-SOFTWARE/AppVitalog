import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { HeartPulse, User, Mail, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = (data) => {
    setRegisterError('');
    const result = registerUser(data.name, data.email, data.password);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } else {
      setRegisterError(result.message || 'Erro ao realizar cadastro.');
    }
  };

  return (
    <div className="register-wrapper">
      <Card className="register-card animate-fade-in-up">
        <div className="register-header">
          <div className="register-brand-icon">
            <HeartPulse size={36} />
          </div>
          <h2 className="register-title">Vitalog</h2>
          <p className="register-subtitle">Crie sua conta para monitoramento</p>
        </div>

        {success ? (
          <div className="register-success-overlay">
            <CheckCircle2 size={48} color="var(--color-normal)" />
            <h2>Cadastro Realizado!</h2>
            <p>Sua conta foi criada com sucesso. Redirecionando para a tela de login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              label="Nome Completo"
              placeholder="Digite seu nome"
              icon={User}
              error={errors.name?.message}
              {...register('name', { 
                required: 'O nome é obrigatório',
                minLength: { value: 2, message: 'O nome deve ter no mínimo 2 caracteres' }
              })}
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="Ex: seuemail@provedor.com"
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
              placeholder="Crie uma senha de no mínimo 6 caracteres"
              icon={Lock}
              error={errors.password?.message}
              {...register('password', { 
                required: 'A senha é obrigatória',
                minLength: { value: 6, message: 'A senha deve ter no mínimo 6 caracteres' }
              })}
            />

            {registerError && (
              <div className="register-error-alert">
                <AlertTriangle size={16} />
                <span>{registerError}</span>
              </div>
            )}

            <Button 
              type="submit" 
              variant="primary" 
              disabled={isSubmitting}
              className="register-btn"
            >
              {isSubmitting ? 'Cadastrando...' : 'Criar Conta'}
            </Button>
          </form>
        )}

        {!success && (
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Já tem uma conta? <Link to="/login" style={{ fontWeight: '700', color: 'var(--primary-color)' }}>Entre aqui</Link>
          </div>
        )}
      </Card>

      <style dangerouslySetInnerHTML={{__html: `
        .register-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 24px;
        }
        .register-card {
          width: 100%;
          max-width: 420px;
          border-radius: var(--radius-lg);
          background: rgba(30, 41, 59, 0.55);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), var(--primary-glow);
          border-color: rgba(255, 255, 255, 0.05);
        }
        .register-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .register-brand-icon {
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
        .register-title {
          font-size: 2.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--text-primary) 30%, var(--primary-color) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .register-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-top: 6px;
        }
        .register-error-alert {
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
        }
        .register-btn {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          font-weight: 600;
        }
        .register-success-overlay {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px 0;
          gap: 16px;
        }
        .register-success-overlay h2 {
          color: var(--text-primary);
        }
        .register-success-overlay p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
      `}} />
    </div>
  );
};

export default Register;
