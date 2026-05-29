import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMedicalData } from '../context/MedicalDataContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { Activity, Clock, FileText, CheckCircle2, ChevronLeft } from 'lucide-react';

const BloodPressureForm = () => {
  const { addRecord, updateRecord } = useMedicalData();
  const navigate = useNavigate();
  const location = useLocation();
  const [success, setSuccess] = useState(false);
  const editRecord = location.state?.editRecord;

  // Data atual no formato local adequado para input datetime-local (YYYY-MM-DDTHH:MM)
  const getCurrentDateTimeString = () => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset em milissegundos
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      date: getCurrentDateTimeString()
    }
  });

  useEffect(() => {
    if (editRecord) {
      reset({
        systolic: editRecord.systolic,
        diastolic: editRecord.diastolic,
        heartRate: editRecord.heartRate,
        date: editRecord.date,
        notes: editRecord.notes || ''
      });
    }
  }, [editRecord, reset]);

  const onSubmit = (data) => {
    const record = {
      type: 'bp',
      systolic: Number(data.systolic),
      diastolic: Number(data.diastolic),
      heartRate: Number(data.heartRate),
      date: data.date,
      notes: data.notes
    };
    
    if (editRecord) {
      updateRecord(editRecord.id, record);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/history');
      }, 2000);
    } else {
      addRecord(record);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        reset({
          systolic: '',
          diastolic: '',
          heartRate: '',
          date: getCurrentDateTimeString(),
          notes: ''
        });
      }, 2500);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <div className="header" style={{ marginBottom: '20px' }}>
        <div>
          <Link to="/dashboard" className="back-link">
            <ChevronLeft size={16} />
            <span>Voltar ao Painel</span>
          </Link>
          <h1 className="header-title" style={{ marginTop: '8px' }}>
            {editRecord ? 'Editar Registro de Pressão' : 'Pressão Arterial'}
          </h1>
          <p className="header-subtitle">
            {editRecord ? 'Atualize as informações da medição selecionada' : 'Cadastre uma nova medição para acompanhamento'}
          </p>
        </div>
      </div>

      <Card>
        {success ? (
          <div className="success-overlay">
            <CheckCircle2 size={48} color="var(--color-normal)" />
            <h2>{editRecord ? 'Registro Atualizado!' : 'Registro Salvo!'}</h2>
            <p>{editRecord ? 'Suas alterações foram gravadas com sucesso.' : 'Sua medição de pressão arterial foi adicionada ao histórico.'}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="Pressão Sistólica (Sist.)"
                type="number"
                placeholder="Ex: 120"
                icon={Activity}
                error={errors.systolic?.message}
                {...register('systolic', { 
                  required: 'Pressão Sistólica é obrigatória',
                  min: { value: 60, message: 'Deve ser de 60 a 300 mmHg' },
                  max: { value: 300, message: 'Deve ser de 60 a 300 mmHg' }
                })}
              />

              <Input
                label="Pressão Diastólica (Diast.)"
                type="number"
                placeholder="Ex: 80"
                icon={Activity}
                error={errors.diastolic?.message}
                {...register('diastolic', { 
                  required: 'Pressão Diastólica é obrigatória',
                  min: { value: 40, message: 'Deve ser de 40 a 200 mmHg' },
                  max: { value: 200, message: 'Deve ser de 40 a 200 mmHg' }
                })}
              />
            </div>

            <Input
              label="Frequência Cardíaca (BPM)"
              type="number"
              placeholder="Ex: 70"
              icon={Activity}
              error={errors.heartRate?.message}
              {...register('heartRate', { 
                required: 'Frequência cardíaca é obrigatória',
                min: { value: 30, message: 'Mínimo 30' },
                max: { value: 200, message: 'Máximo 200' }
              })}
            />

            <Input
              label="Data e Hora da Medição"
              type="datetime-local"
              icon={Clock}
              error={errors.date?.message}
              {...register('date', { 
                required: 'Data e hora são obrigatórias'
              })}
            />
            <div className="input-group">
              <label className="input-label">
                <FileText size={16} />
                Notas / Observações
              </label>
              <textarea
                placeholder="Ex: Medido após caminhar, em jejum, sentindo dor de cabeça, etc."
                className="input-field"
                rows={3}
                style={{ resize: 'vertical' }}
                {...register('notes')}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <Button 
                type="submit" 
                variant="primary" 
                disabled={isSubmitting}
                style={{ flexGrow: 1 }}
              >
                {isSubmitting ? 'Salvando...' : (editRecord ? 'Salvar Alterações' : 'Salvar Registro')}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </Card>

      <style dangerouslySetInnerHTML={{__html: `
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
        }
        .back-link:hover {
          color: var(--text-primary);
        }
        .success-overlay {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 10px;
          gap: 16px;
          animation: scaleIn 0.3s ease-out;
        }
        .success-overlay h2 {
          color: var(--text-primary);
        }
        .success-overlay p {
          color: var(--text-secondary);
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}} />
    </div>
  );
};

export default BloodPressureForm;
