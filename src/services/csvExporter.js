/**
 * Serviço para exportar registros médicos para arquivo CSV compatível com Excel e Google Sheets.
 */
export const exportToCSV = (records, getBPStatus, getGlucoseStatus) => {
  if (!records || records.length === 0) return;

  const headers = ['Data e Hora', 'Tipo', 'Leitura / Valor', 'Indicador / Status', 'Detalhes Adicionais', 'Notas'];
  
  const rows = records.map(record => {
    const formattedDate = new Date(record.date).toLocaleString('pt-BR');
    
    if (record.type === 'bp') {
      const status = getBPStatus(record.systolic, record.diastolic);
      return [
        formattedDate,
        'Pressão Arterial',
        `${record.systolic}/${record.diastolic} mmHg`,
        status.label,
        `Freq. Cardíaca: ${record.heartRate} BPM`,
        record.notes || ''
      ];
    } else {
      const status = getGlucoseStatus(record.glucose, record.measurementType);
      const typeLabel = 
        record.measurementType === 'fasting' ? 'Em Jejum' :
        record.measurementType === 'pre_prandial' ? 'Pré-prandial' :
        record.measurementType === 'post_prandial' ? 'Pós-prandial' : 'Ao deitar';
        
      return [
        formattedDate,
        'Glicemia',
        `${record.glucose} mg/dL`,
        status.label,
        `Tipo: ${typeLabel}`,
        record.notes || ''
      ];
    }
  });

  // UTF-8 BOM para garantir acentuação correta no Excel em português, e separador ponto-e-vírgula (;)
  const csvContent = '\uFEFF' + [headers, ...rows]
    .map(row => row.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(';'))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `vitalog_historico_${new Date().toISOString().slice(0,10)}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
