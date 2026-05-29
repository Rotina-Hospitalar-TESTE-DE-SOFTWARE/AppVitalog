import React from 'react';
import { useMedicalData } from '../context/MedicalDataContext';
import Card from '../components/Card';
import { 
  Activity, 
  Droplet, 
  TrendingUp, 
  Calendar, 
  PlusCircle,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { records, getBPStatus, getGlucoseStatus } = useMedicalData();

  // Filtrar tipos
  const bpRecords = records.filter(r => r.type === 'bp');
  const glucoseRecords = records.filter(r => r.type === 'glucose');

  // Médias de Pressão
  const avgSystolic = bpRecords.length 
    ? Math.round(bpRecords.reduce((acc, r) => acc + Number(r.systolic), 0) / bpRecords.length) 
    : 0;
  const avgDiastolic = bpRecords.length 
    ? Math.round(bpRecords.reduce((acc, r) => acc + Number(r.diastolic), 0) / bpRecords.length) 
    : 0;
  
  // Média de Glicose
  const avgGlucose = glucoseRecords.length 
    ? Math.round(glucoseRecords.reduce((acc, r) => acc + Number(r.glucose), 0) / glucoseRecords.length) 
    : 0;

  // Status das Médias
  const bpStatus = bpRecords.length ? getBPStatus(avgSystolic, avgDiastolic) : null;
  // Para a glicose média global, assumimos jejum para fins de indicador geral ou pós-prandial dependendo do valor
  const glucoseStatus = glucoseRecords.length ? getGlucoseStatus(avgGlucose, 'fasting') : null;

  // Pegar últimos 3 registros
  const recentRecords = records.slice(0, 3);

  // Alertas dinâmicos com base nos dados do usuário
  const getHealthAlerts = () => {
    const alerts = [];
    if (bpStatus && bpStatus.value === 'high') {
      alerts.push({
        id: 'bp-high',
        type: 'high',
        text: `Sua média de Pressão Arterial (${avgSystolic}/${avgDiastolic}) está classificada como ${bpStatus.label}. Recomendamos monitorar diariamente e conversar com seu cardiologista.`
      });
    }
    if (glucoseStatus && glucoseStatus.value === 'high') {
      alerts.push({
        id: 'gl-high',
        type: 'high',
        text: `Sua média de Glicemia em jejum (${avgGlucose} mg/dL) está acima do recomendado (${glucoseStatus.label}). Evite carboidratos de alto índice glicêmico e marque uma consulta médica.`
      });
    }
    if (glucoseStatus && glucoseStatus.value === 'low') {
      alerts.push({
        id: 'gl-low',
        type: 'low',
        text: `Detectamos ocorrência de Hipoglicemia (${avgGlucose} mg/dL). Certifique-se de realizar refeições regulares e carregar consigo carboidratos rápidos.`
      });
    }
    return alerts;
  };

  const healthAlerts = getHealthAlerts();

  return (
    <div className="animate-fade-in">
      <div className="header">
        <div>
          <h1 className="header-title">Bem-vindo ao Vitalog</h1>
          <p className="header-subtitle">Resumo e monitoramento do seu status de saúde</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/blood-pressure" className="btn btn-primary btn-sm">
            <PlusCircle size={16} />
            <span>Registrar Pressão</span>
          </Link>
          <Link to="/glucose" className="btn btn-secondary btn-sm">
            <PlusCircle size={16} />
            <span>Registrar Glicemia</span>
          </Link>
        </div>
      </div>

      {/* Grid de Estatísticas Rápidas */}
      <div className="stats-grid">
        {/* Card Pressão Arterial */}
        <Card className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Média Pressão Arterial</span>
            <span className="stat-value">
              {bpRecords.length ? `${avgSystolic}/${avgDiastolic}` : '--/--'}
              <span className="stat-unit"> mmHg</span>
            </span>
            <div className="stat-footer">
              {bpRecords.length ? (
                <span className={`badge badge-${bpStatus.value}`}>
                  {bpStatus.label}
                </span>
              ) : (
                <span className="text-muted">Nenhum registro ainda</span>
              )}
            </div>
          </div>
          <div className="stat-icon primary">
            <Activity size={24} />
          </div>
        </Card>

        {/* Card Glicemia */}
        <Card className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Média Glicemia (Geral)</span>
            <span className="stat-value">
              {glucoseRecords.length ? avgGlucose : '---'}
              <span className="stat-unit"> mg/dL</span>
            </span>
            <div className="stat-footer">
              {glucoseRecords.length ? (
                <span className={`badge badge-${glucoseStatus.value}`}>
                  {glucoseStatus.label}
                </span>
              ) : (
                <span className="text-muted">Nenhum registro ainda</span>
              )}
            </div>
          </div>
          <div className="stat-icon secondary">
            <Droplet size={24} />
          </div>
        </Card>

        {/* Card Total de Medições */}
        <Card className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total de Registros</span>
            <span className="stat-value">{records.length}</span>
            <div className="stat-footer" style={{ color: 'var(--text-secondary)' }}>
              <TrendingUp size={14} />
              <span>{bpRecords.length} Pressão | {glucoseRecords.length} Glicemia</span>
            </div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)' }}>
            <Calendar size={24} />
          </div>
        </Card>
      </div>

      <div className="grid-2col">
        {/* Painel de Recomendações e Alertas */}
        <Card title="Alertas & Recomendações" icon={AlertCircle}>
          {healthAlerts.length > 0 ? (
            <div className="alerts-container">
              {healthAlerts.map(alert => (
                <div key={alert.id} className={`alert-box alert-${alert.type}`}>
                  <AlertCircle size={20} className="alert-box-icon" />
                  <p className="alert-box-text">{alert.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-alerts">
              <CheckCircle size={36} color="var(--color-normal)" />
              <h3>Tudo sob controle!</h3>
              <p>Suas médias de pressão arterial e glicose estão dentro dos padrões normais de referência.</p>
            </div>
          )}
        </Card>

        {/* Últimas Atividades */}
        <Card title="Atividades Recentes" icon={Clock}>
          {recentRecords.length > 0 ? (
            <div className="recent-list">
              {recentRecords.map(record => {
                const isBP = record.type === 'bp';
                const Icon = isBP ? Activity : Droplet;
                const date = new Date(record.date).toLocaleDateString('pt-BR');
                const time = new Date(record.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const status = isBP 
                  ? getBPStatus(record.systolic, record.diastolic)
                  : getGlucoseStatus(record.glucose, record.measurementType);

                return (
                  <div key={record.id} className="recent-item">
                    <div className={`recent-item-icon ${isBP ? 'bp' : 'gluc'}`}>
                      <Icon size={18} />
                    </div>
                    <div className="recent-item-details">
                      <div className="recent-item-title">
                        {isBP 
                          ? `Pressão Arterial: ${record.systolic}/${record.diastolic} mmHg`
                          : `Glicemia: ${record.glucose} mg/dL`
                        }
                      </div>
                      <div className="recent-item-time">
                        {date} às {time} {record.notes && `• "${record.notes}"`}
                      </div>
                    </div>
                    <span className={`badge badge-${status.value} recent-item-badge`}>
                      {status.label}
                    </span>
                  </div>
                );
              })}
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <Link to="/history" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  Ver Histórico Completo
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-muted" style={{ textAlign: 'center', padding: '24px 0' }}>
              Nenhum registro encontrado. Use as ações rápidas no topo para cadastrar!
            </p>
          )}
        </Card>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .alerts-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .alert-box {
          display: flex;
          gap: 12px;
          padding: 16px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .alert-high {
          background: var(--color-high-bg);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }
        .alert-low {
          background: var(--color-low-bg);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #93c5fd;
        }
        .alert-box-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }
        .no-alerts {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px 10px;
          gap: 12px;
        }
        .no-alerts p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          max-width: 320px;
        }
        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .recent-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(15, 23, 42, 0.3);
          border-radius: var(--radius-sm);
          border: 1px solid var(--surface-border);
        }
        .recent-item-icon {
          padding: 8px;
          border-radius: 8px;
          display: flex;
        }
        .recent-item-icon.bp {
          background: var(--primary-glow);
          color: var(--primary-color);
        }
        .recent-item-icon.gluc {
          background: var(--secondary-glow);
          color: var(--secondary-color);
        }
        .recent-item-details {
          flex-grow: 1;
        }
        .recent-item-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .recent-item-time {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .recent-item-badge {
          flex-shrink: 0;
        }
      `}} />
    </div>
  );
};

export default Dashboard;
