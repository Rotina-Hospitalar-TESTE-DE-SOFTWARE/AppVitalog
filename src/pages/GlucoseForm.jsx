import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMedicalData } from '../context/MedicalDataContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { Droplet, Clock, FileText, CheckCircle2, ChevronLeft, Layers } from 'lucide-react';

const GlucoseForm = () => {
  const { addRecord, updateRecord } = useMedicalData();
  const navigate = useNavigate();
  const location = useLocation();
  const [success, setSuccess] = useState(false);
  const editRecord = location.state?.editRecord;

  const getCurrentDateTimeString = () => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      date: getCurrentDateTimeString(),
      measurementType: 'fasting'
    }
  });

  useEffect(() => {
    if (editRecord) {
      reset({
        glucose: editRecord.glucose,
        measurementType: editRecord.measurementType,
        date: editRecord.date,
        notes: editRecord.notes || ''
      });
    }
  }, [editRecord, reset]);

  const onSubmit = (data) => {
    const record = {
      type: 'glucose',
      glucose: Number(data.glucose),
      measurementType: data.measurementType,
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
          glucose: '',
          measurementType: 'fasting',
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
            {editRecord ? 'Editar Registro de Glicemia' : 'Glicemia'}
          </h1>
          <p className="header-subtitle">
            {editRecord ? 'Atualize as informações da taxa de glicose selecionada' : 'Cadastre uma nova medição de taxa de açúcar no sangue'}
          </p>
        </div>
      </div>

      <Card>
        {success ? (
          <div className="success-overlay">
            <CheckCircle2 size={48} color="var(--color-normal)" />
            <h2>{editRecord ? 'Registro Atualizado!' : 'Registro Salvo!'}</h2>
            <p>{editRecord ? 'Suas alterações foram gravadas com sucesso.' : 'Sua medição de glicemia foi adicionada ao histórico.'}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              label="Nível de Glicose (mg/dL)"
              type="number"
              placeholder="Ex: 95"
              icon={Droplet}
              error={errors.glucose?.message}
              {...register('glucose', { 
                required: 'O nível de glicose é obrigatório',
                min: { value: 20, message: 'Valor excessivamente baixo (mínimo 20)' },
                max: { value: 600, message: 'Valor excessivamente alto (máximo 600)' }
              })}
            />

            <div className="input-group">
              <label className="input-label">
                <Layers size={16} />
                Tipo de Medição / Momento
              </label>
              <select
                className="input-field"
                {...register('measurementType', { required: 'Selecione um momento' })}
              >
                <option value="fasting">Em Jejum (Fasting)</option>
                <option value="pre_prandial">Antes de comer (Pré-prandial)</option>
                <option value="post_prandial">2h após comer (Pós-prandial)</option>
                <option value="bedtime">Ao deitar (Bedtime)</option>
                <option value="other">Outros horários</option>
              </select>
              {errors.measurementType && <span className="input-error">{errors.measurementType.message}</span>}
            </div>

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
                placeholder="Ex: Tive um leve suor frio, comi doce de sobremesa, etc."
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
      `}} />
    </div>
  );
};

export default GlucoseForm;
