import React, { createContext, useContext, useState, useEffect } from 'react';

const MedicalDataContext = createContext();

// Dados de simulação inicial para que a aplicação não inicie vazia e demonstre o potencial do dashboard
const mockRecords = [
  {
    id: 'mock-1',
    type: 'bp',
    systolic: 118,
    diastolic: 78,
    heartRate: 72,
    date: '2026-05-28T08:00',
    notes: 'Medição matinal, em repouso.'
  },
  {
    id: 'mock-2',
    type: 'glucose',
    glucose: 95,
    measurementType: 'fasting',
    date: '2026-05-28T08:15',
    notes: 'Jejum de 10 horas.'
  },
  {
    id: 'mock-3',
    type: 'bp',
    systolic: 135,
    diastolic: 88,
    heartRate: 78,
    date: '2026-05-28T14:30',
    notes: 'Após almoço de trabalho estressante.'
  },
  {
    id: 'mock-4',
    type: 'glucose',
    glucose: 155,
    measurementType: 'post_prandial',
    date: '2026-05-28T16:30',
    notes: '2 horas após o almoço.'
  }
];

export const MedicalDataProvider = ({ children }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const savedRecords = localStorage.getItem('vitalog_records');
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords));
      } catch (e) {
        setRecords(mockRecords);
        localStorage.setItem('vitalog_records', JSON.stringify(mockRecords));
      }
    } else {
      setRecords(mockRecords);
      localStorage.setItem('vitalog_records', JSON.stringify(mockRecords));
    }
  }, []);

  const saveRecords = (newRecords) => {
    setRecords(newRecords);
    localStorage.setItem('vitalog_records', JSON.stringify(newRecords));
  };

  const addRecord = (record) => {
    const newRecord = {
      ...record,
      id: Date.now().toString(),
    };
    const updated = [newRecord, ...records];
    saveRecords(updated);
  };

  const deleteRecord = (id) => {
    const updated = records.filter(r => r.id !== id);
    saveRecords(updated);
  };

  const updateRecord = (id, updatedRecord) => {
    const updated = records.map(r => r.id === id ? { ...updatedRecord, id } : r);
    saveRecords(updated);
  };

  // Classificação de Pressão Arterial
  const getBPStatus = (systolic, diastolic) => {
    const sys = Number(systolic);
    const dia = Number(diastolic);
    
    if (sys >= 140 || dia >= 90) return { label: 'Hipertensão G2', value: 'high' };
    if (sys >= 130 || dia >= 85) return { label: 'Hipertensão G1', value: 'high' };
    if (sys < 90 || dia < 60) return { label: 'Hipotensão', value: 'low' };
    if ((sys >= 120 && sys < 130) || (dia >= 80 && dia < 85)) return { label: 'Elevada', value: 'elevated' };
    return { label: 'Normal', value: 'normal' };
  };

  // Classificação de Glicemia
  const getGlucoseStatus = (glucoseVal, type) => {
    const glu = Number(glucoseVal);
    
    if (type === 'fasting') { // Jejum
      if (glu < 70) return { label: 'Hipoglicemia', value: 'low' };
      if (glu >= 126) return { label: 'Diabetes', value: 'high' };
      if (glu >= 100) return { label: 'Pré-Diabetes', value: 'elevated' };
      return { label: 'Normal', value: 'normal' };
    } 
    
    if (type === 'post_prandial') { // Pós-prandial (2h após)
      if (glu < 70) return { label: 'Hipoglicemia', value: 'low' };
      if (glu >= 200) return { label: 'Hiperglicemia', value: 'high' };
      if (glu >= 140) return { label: 'Tolerância Diminuída', value: 'elevated' };
      return { label: 'Normal', value: 'normal' };
    }
    
    // Default / Outros (Ao deitar, etc.)
    if (glu < 80) return { label: 'Hipoglicemia', value: 'low' };
    if (glu >= 180) return { label: 'Hiperglicemia', value: 'high' };
    if (glu >= 140) return { label: 'Elevado', value: 'elevated' };
    return { label: 'Normal', value: 'normal' };
  };

  return (
    <MedicalDataContext.Provider value={{ 
      records, 
      addRecord, 
      deleteRecord, 
      updateRecord,
      getBPStatus, 
      getGlucoseStatus 
    }}>
      {children}
    </MedicalDataContext.Provider>
  );
};

export const useMedicalData = () => {
  const context = useContext(MedicalDataContext);
  if (!context) {
    throw new Error('useMedicalData deve ser utilizado dentro de um MedicalDataProvider');
  }
  return context;
};
