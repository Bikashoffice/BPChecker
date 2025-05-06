
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from "sonner";

export interface BPReading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  date: Date;
  notes: string;
}

interface BPContextType {
  readings: BPReading[];
  addReading: (reading: Omit<BPReading, 'id'>) => void;
  deleteReading: (id: string) => void;
  getHealthStatus: (systolic: number, diastolic: number) => {
    status: 'normal' | 'elevated' | 'high' | 'low';
    color: string;
    message: string;
  };
  getPulseStatus: (pulse: number) => {
    status: 'normal' | 'high' | 'low';
    color: string;
    message: string;
  };
}

const BPContext = createContext<BPContextType | undefined>(undefined);

export const BPProvider = ({ children }: { children: ReactNode }) => {
  const [readings, setReadings] = useState<BPReading[]>(() => {
    try {
      const savedReadings = localStorage.getItem('bp-readings');
      if (savedReadings) {
        return JSON.parse(savedReadings).map((reading: any) => ({
          ...reading,
          date: new Date(reading.date)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading reading data:', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('bp-readings', JSON.stringify(readings));
  }, [readings]);

  const addReading = (reading: Omit<BPReading, 'id'>) => {
    const newReading = {
      ...reading,
      id: crypto.randomUUID()
    };
    setReadings(prev => [newReading, ...prev]);
    
    const status = getHealthStatus(reading.systolic, reading.diastolic);
    toast(`Reading added: ${status.status.toUpperCase()}`, {
      description: status.message,
    });
  };

  const deleteReading = (id: string) => {
    setReadings(prev => prev.filter(reading => reading.id !== id));
    toast("Reading deleted");
  };

  const getHealthStatus = (systolic: number, diastolic: number) => {
    // Low blood pressure
    if (systolic < 90 || diastolic < 60) {
      return {
        status: 'low',
        color: 'health-low',
        message: 'Your blood pressure is low. Stay hydrated, eat small meals frequently, and avoid standing up too quickly. Consult your doctor if you experience dizziness or fainting.'
      };
    }
    // Normal
    else if (systolic < 120 && diastolic < 80) {
      return {
        status: 'normal',
        color: 'health-normal',
        message: 'Your blood pressure is normal. Keep maintaining healthy habits like regular exercise, balanced diet, and proper sleep.'
      };
    }
    // Elevated
    else if ((systolic >= 120 && systolic <= 129) && diastolic < 80) {
      return {
        status: 'elevated',
        color: 'health-elevated',
        message: 'Your blood pressure is elevated. Focus on lifestyle changes: reduce sodium intake, exercise regularly, limit alcohol, and manage stress.'
      };
    }
    // High
    else {
      return {
        status: 'high',
        color: 'health-high',
        message: 'Your blood pressure is high. Reduce sodium intake, exercise regularly, limit alcohol, manage stress, and consult your doctor as medication may be needed.'
      };
    }
  };

  const getPulseStatus = (pulse: number) => {
    // Low pulse rate
    if (pulse < 60) {
      return {
        status: 'low',
        color: 'health-low',
        message: 'Your pulse rate is low. This may be normal for athletes, but consult your doctor if experiencing dizziness, fatigue, or shortness of breath.'
      };
    }
    // Normal pulse rate
    else if (pulse >= 60 && pulse <= 100) {
      return {
        status: 'normal',
        color: 'health-pulse',
        message: 'Your pulse rate is normal. Regular exercise and managing stress can help maintain a healthy heart rate.'
      };
    }
    // High pulse rate
    else {
      return {
        status: 'high',
        color: 'health-high',
        message: 'Your pulse rate is high. Reduce caffeine and alcohol intake, practice deep breathing, and consult your doctor if it persists.'
      };
    }
  };

  return (
    <BPContext.Provider value={{ 
      readings, 
      addReading, 
      deleteReading,
      getHealthStatus,
      getPulseStatus
    }}>
      {children}
    </BPContext.Provider>
  );
};

export const useBP = () => {
  const context = useContext(BPContext);
  if (context === undefined) {
    throw new Error('useBP must be used within a BPProvider');
  }
  return context;
};
