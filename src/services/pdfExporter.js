import { jsPDF } from 'jspdf';

/**
 * Serviço para gerar relatórios PDF profissionais a partir dos dados do Vitalog.
 */
export const exportToPDF = (records, getBPStatus, getGlucoseStatus) => {
  if (!records || records.length === 0) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Configurações de cores (estilo premium)
  const primaryColor = [16, 185, 129]; // Emerald
  const darkColor = [15, 23, 42];     // Deep slate
  const grayColor = [100, 116, 139];   // Muted slate
  const lightGray = [241, 245, 249];   // Table background

  // Margens e posições base
  const marginX = 15;
  let currentY = 15;

  // 1. Cabeçalho do PDF
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, 210, 40, 'F');

  // Ícone decorativo (Simulando o logotipo Vitalog)
  doc.setFillColor(...primaryColor);
  doc.rect(marginX, 12, 10, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Vitalog', marginX + 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(200, 220, 210);
  doc.text('Relatório de Saúde Pessoal', marginX + 14, 25);

  const dataAtual = new Date().toLocaleString('pt-BR');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`Gerado em: ${dataAtual}`, 210 - marginX - 50, 20);
  doc.text('Paciente: Usuário Administrador', 210 - marginX - 50, 25);

  currentY = 50;

  // 2. Resumo de Médias das Leituras
  doc.setTextColor(...darkColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumo do Período', marginX, currentY);
  currentY += 8;

  // Filtragem e cálculos para estatísticas
  const bpRecords = records.filter(r => r.type === 'bp');
  const glucRecords = records.filter(r => r.type === 'glucose');

  const avgSys = bpRecords.length ? Math.round(bpRecords.reduce((acc, curr) => acc + Number(curr.systolic), 0) / bpRecords.length) : '-';
  const avgDia = bpRecords.length ? Math.round(bpRecords.reduce((acc, curr) => acc + Number(curr.diastolic), 0) / bpRecords.length) : '-';
  const avgGluc = glucRecords.length ? Math.round(glucRecords.reduce((acc, curr) => acc + Number(curr.glucose), 0) / glucRecords.length) : '-';

  // Caixas de Resumo
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  
  // Caixa Pressão
  doc.roundedRect(marginX, currentY, 85, 25, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...grayColor);
  doc.text('MÉDIA PRESSÃO ARTERIAL', marginX + 5, currentY + 6);
  doc.setFontSize(16);
  doc.setTextColor(...darkColor);
  doc.text(`${avgSys}/${avgDia} mmHg`, marginX + 5, currentY + 16);
  
  // Caixa Glicose
  doc.roundedRect(marginX + 95, currentY, 85, 25, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...grayColor);
  doc.text('MÉDIA GLICEMIA', marginX + 100, currentY + 6);
  doc.setFontSize(16);
  doc.setTextColor(...darkColor);
  doc.text(`${avgGluc} mg/dL`, marginX + 100, currentY + 16);

  currentY += 35;

  // 3. Tabela de Histórico
  doc.setTextColor(...darkColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Histórico de Medições', marginX, currentY);
  currentY += 6;

  // Tabela Cabeçalhos
  const tableHeaders = ['Data/Hora', 'Tipo', 'Medição', 'Status', 'Notas'];
  doc.setFillColor(...darkColor);
  doc.rect(marginX, currentY, 180, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  
  doc.text(tableHeaders[0], marginX + 4, currentY + 5.5);
  doc.text(tableHeaders[1], marginX + 40, currentY + 5.5);
  doc.text(tableHeaders[2], marginX + 75, currentY + 5.5);
  doc.text(tableHeaders[3], marginX + 110, currentY + 5.5);
  doc.text(tableHeaders[4], marginX + 140, currentY + 5.5);

  currentY += 8;

  // Tabela Linhas
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  
  records.forEach((record, index) => {
    // Adicionar nova página se ultrapassar a margem inferior
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
      
      // Cabeçalho repetido da tabela na nova página
      doc.setFillColor(...darkColor);
      doc.rect(marginX, currentY, 180, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text(tableHeaders[0], marginX + 4, currentY + 5.5);
      doc.text(tableHeaders[1], marginX + 40, currentY + 5.5);
      doc.text(tableHeaders[2], marginX + 75, currentY + 5.5);
      doc.text(tableHeaders[3], marginX + 110, currentY + 5.5);
      doc.text(tableHeaders[4], marginX + 140, currentY + 5.5);
      doc.setFont('helvetica', 'normal');
      currentY += 8;
    }

    // Linha zebrada
    if (index % 2 === 0) {
      doc.setFillColor(...lightGray);
      doc.rect(marginX, currentY, 180, 8, 'F');
    }

    doc.setTextColor(...darkColor);
    const dateFormatted = new Date(record.date).toLocaleString('pt-BR');
    doc.text(dateFormatted, marginX + 4, currentY + 5.5);

    if (record.type === 'bp') {
      const status = getBPStatus(record.systolic, record.diastolic);
      doc.text('Pressão Arterial', marginX + 40, currentY + 5.5);
      doc.text(`${record.systolic}/${record.diastolic} mmHg`, marginX + 75, currentY + 5.5);
      
      // Cor baseada no status
      if (status.value === 'high') doc.setTextColor(239, 68, 68);
      else if (status.value === 'elevated') doc.setTextColor(245, 158, 11);
      else if (status.value === 'low') doc.setTextColor(59, 130, 246);
      else doc.setTextColor(16, 185, 129);
      
      doc.setFont('helvetica', 'bold');
      doc.text(status.label, marginX + 110, currentY + 5.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...darkColor);
      
      const noteTruncated = record.notes ? (record.notes.length > 25 ? record.notes.slice(0, 22) + '...' : record.notes) : '';
      doc.text(noteTruncated, marginX + 140, currentY + 5.5);
    } else {
      const status = getGlucoseStatus(record.glucose, record.measurementType);
      doc.text('Glicemia', marginX + 40, currentY + 5.5);
      doc.text(`${record.glucose} mg/dL`, marginX + 75, currentY + 5.5);

      // Cor baseada no status
      if (status.value === 'high') doc.setTextColor(239, 68, 68);
      else if (status.value === 'elevated') doc.setTextColor(245, 158, 11);
      else if (status.value === 'low') doc.setTextColor(59, 130, 246);
      else doc.setTextColor(16, 185, 129);

      doc.setFont('helvetica', 'bold');
      doc.text(status.label, marginX + 110, currentY + 5.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...darkColor);
      
      const noteTruncated = record.notes ? (record.notes.length > 25 ? record.notes.slice(0, 22) + '...' : record.notes) : '';
      doc.text(noteTruncated, marginX + 140, currentY + 5.5);
    }

    currentY += 8;
  });

  // Rodapé do documento
  const totalPaginas = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text(`Página ${i} de ${totalPaginas}`, 105, 287, { align: 'center' });
    doc.text('Vitalog - Sistema de Monitoramento Pessoal. Todos os direitos reservados.', marginX, 287);
  }

  // Salvar PDF
  doc.save(`vitalog_relatorio_saude_${new Date().toISOString().slice(0, 10)}.pdf`);
};
