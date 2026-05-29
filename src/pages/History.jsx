import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedicalData } from '../context/MedicalDataContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { exportToCSV } from '../services/csvExporter';
import { exportToPDF } from '../services/pdfExporter';
import { 
  FileSpreadsheet, 
  FileText, 
  Trash2, 
  Pencil,
  Filter, 
  Activity, 
  Droplet, 
  Calendar,
  ChevronDown
} from 'lucide-react';

const History = () => {
  const { records, deleteRecord, getBPStatus, getGlucoseStatus } = useMedicalData();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('all'); // 'all', 'bp', 'glucose'
  const [deleteTargetId, setDeleteTargetId] = useState(null); // Estado para confirmação de exclusão (HU06)

  // Filtrar registros
  const filteredRecords = records.filter(record => {
    if (filterType === 'all') return true;
    return record.type === filterType;
  });

  const handleExportCSV = () => {
    exportToCSV(records, getBPStatus, getGlucoseStatus);
  };

  const handleExportPDF = () => {
    exportToPDF(records, getBPStatus, getGlucoseStatus);
  };

  const getMeasurementLabel = (record) => {
    if (record.type === 'fasting') return 'Jejum';
    if (record.type === 'pre_prandial') return 'Pré-prandial';
    if (record.type === 'post_prandial') return 'Pós-prandial';
    if (record.type === 'bedtime') return 'Ao deitar';
    return 'Outros';
  };

  return (
    <div className="animate-fade-in">
      <div className="header">
        <div>
          <h1 className="header-title">Histórico de Medições</h1>
          <p className="header-subtitle">Visualize, filtre e exporte suas leituras de saúde</p>
        </div>
        
        {/* Botões de Exportação */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button 
            onClick={handleExportPDF} 
            variant="secondary" 
            icon={FileText}
            disabled={records.length === 0}
          >
            Exportar PDF
          </Button>
          <Button 
            onClick={handleExportCSV} 
            variant="primary" 
            icon={FileSpreadsheet}
            disabled={records.length === 0}
          >
            Exportar Planilha
          </Button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <Card className="filter-card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div className="filters-wrapper">
          <div className="filter-title">
            <Filter size={18} color="var(--primary-color)" />
            <span>Filtrar por tipo:</span>
          </div>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              Todos ({records.length})
            </button>
            <button 
              className={`filter-btn ${filterType === 'bp' ? 'active' : ''}`}
              onClick={() => setFilterType('bp')}
            >
              <Activity size={14} style={{ marginRight: '6px' }} />
              Pressão Arterial ({records.filter(r => r.type === 'bp').length})
            </button>
            <button 
              className={`filter-btn ${filterType === 'glucose' ? 'active' : ''}`}
              onClick={() => setFilterType('glucose')}
            >
              <Droplet size={14} style={{ marginRight: '6px' }} />
              Glicemia ({records.filter(r => r.type === 'glucose').length})
            </button>
          </div>
        </div>
      </Card>

      {/* Tabela de Dados */}
      <Card style={{ padding: '0px', overflow: 'hidden' }}>
        {filteredRecords.length > 0 ? (
          <div className="table-container" style={{ border: 'none', borderRadius: '0px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data e Hora</th>
                  <th>Tipo</th>
                  <th>Medição</th>
                  <th>Status / Alerta</th>
                  <th>Detalhes</th>
                  <th>Notas</th>
                  <th style={{ textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => {
                  const isBP = record.type === 'bp';
                  const date = new Date(record.date).toLocaleDateString('pt-BR');
                  const time = new Date(record.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                  
                  // Obter status para colorização de alerta
                  const status = isBP 
                    ? getBPStatus(record.systolic, record.diastolic)
                    : getGlucoseStatus(record.glucose, record.measurementType);

                  return (
                    <tr key={record.id} className="table-row animate-fade-in">
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Calendar size={16} color="var(--text-muted)" />
                          <div>
                            <strong>{date}</strong>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '2px' }}>{time}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-type">
                          {isBP ? 'Pressão' : 'Glicemia'}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                          {isBP 
                            ? `${record.systolic}/${record.diastolic}` 
                            : record.glucose
                          }
                          <span style={{ fontSize: '0.9rem', fontWeight: '400', color: 'var(--text-muted)', marginLeft: '4px' }}>
                            {isBP ? 'mmHg' : 'mg/dL'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${status.value}`} style={{ padding: '8px 12px', borderRadius: '6px', fontSize: '0.9rem' }}>
                          {status.label}
                        </span>
                      </td>
                      <td style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        {isBP 
                          ? `${record.heartRate} BPM (Pulso)` 
                          : getMeasurementLabel(record)
                        }
                      </td>
                      <td style={{ maxWidth: '240px', fontSize: '1rem', color: 'var(--text-secondary)', fontStyle: record.notes ? 'normal' : 'italic' }}>
                        {record.notes || 'Sem observações'}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            className="edit-row-btn" 
                            onClick={() => {
                              if (record.type === 'bp') {
                                navigate('/blood-pressure', { state: { editRecord: record } });
                              } else {
                                navigate('/glucose', { state: { editRecord: record } });
                              }
                            }}
                            title="Editar Medição"
                            style={{ padding: '10px', minHeight: '44px', minWidth: '44px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            className="delete-row-btn" 
                            onClick={() => setDeleteTargetId(record.id)}
                            title="Excluir Medição"
                            style={{ padding: '10px', minHeight: '44px', minWidth: '44px' }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>
              Nenhum registro corresponde ao filtro selecionado.
            </p>
          </div>
        )}
      </Card>

      {/* Modal de Confirmação de Exclusão (HU06) */}
      {deleteTargetId !== null && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in-up" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Confirmar Exclusão</h2>
              <button className="modal-close" onClick={() => setDeleteTargetId(null)}>&times;</button>
            </div>
            <div style={{ marginBottom: '28px', fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Tem certeza que deseja apagar este registro?
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Button 
                onClick={() => {
                  deleteRecord(deleteTargetId);
                  setDeleteTargetId(null);
                }} 
                variant="danger" 
                style={{ flexGrow: 1, minHeight: '52px', fontSize: '1.1rem', fontWeight: '700' }}
              >
                Sim, apagar
              </Button>
              <Button 
                onClick={() => setDeleteTargetId(null)} 
                variant="secondary" 
                style={{ flexGrow: 1, minHeight: '52px', fontSize: '1.1rem', fontWeight: '700' }}
              >
                Não, cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .filter-card {
          border-color: rgba(255, 255, 255, 0.05);
        }
        .filters-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .filter-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 1.1rem;
        }
        .filter-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .filter-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 2px solid var(--surface-border);
          color: var(--text-secondary);
          padding: 10px 18px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: 1.05rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          min-height: 48px;
          transition: all var(--transition-fast);
        }
        .filter-btn:hover {
          background: var(--surface-hover);
          color: var(--text-primary);
          border-color: rgba(255, 255, 255, 0.3);
        }
        .filter-btn.active {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        .table-row {
          animation: fadeIn var(--transition-fast) forwards;
        }
        .delete-row-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .delete-row-btn:hover {
          color: var(--color-high);
          background: var(--color-high-bg);
        }
        .edit-row-btn:hover {
          color: var(--primary-color) !important;
          background: var(--primary-glow) !important;
        }
        @media (max-width: 768px) {
          .filters-wrapper {
            flex-direction: column;
            align-items: flex-start;
          }
          .filter-buttons {
            width: 100%;
          }
          .filter-btn {
            flex-grow: 1;
            justify-content: center;
          }
        }
      `}} />
    </div>
  );
};

export default History;
