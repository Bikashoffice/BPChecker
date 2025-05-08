
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext';

export interface BPReading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  date: Date;
  notes: string;
  name: string;
  age?: number;
  gender?: string;
  status?: string;
}

interface BPContextType {
  readings: BPReading[];
  sharedReadings: BPReading[];
  addReading: (reading: Omit<BPReading, 'id'>) => void;
  deleteReading: (id: string) => void;
  getHealthStatus: (systolic: number, diastolic: number) => {
    status: 'normal' | 'elevated' | 'high' | 'crisis' | 'low';
    color: string;
    message: string;
  };
  getPulseStatus: (pulse: number) => {
    status: 'normal' | 'high' | 'low';
    color: string;
    message: string;
  };
  isLoading: boolean;
}

const BPContext = createContext<BPContextType | undefined>(undefined);

export const BPProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [readings, setReadings] = useState<BPReading[]>(() => {
    try {
      const savedReadings = localStorage.getItem('bp-readings');
      if (savedReadings) {
        return JSON.parse(savedReadings).map((reading: any) => ({
          ...reading,
          date: new Date(reading.date),
          name: reading.name || 'Anonymous',
          age: reading.age || undefined,
          gender: reading.gender || undefined
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading reading data:', error);
      return [];
    }
  });
  
  const [sharedReadings, setSharedReadings] = useState<BPReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('bp-readings', JSON.stringify(readings));
  }, [readings]);
  
  // Fetch shared readings from Supabase
  useEffect(() => {
    async function fetchSharedReadings() {
      setIsLoading(true);
      try {
        // Even if user is not logged in, we can still fetch public shared readings
        const { data, error } = await supabase
          .from('shared_bp_readings')
          .select('*')
          .order('shared_at', { ascending: false });
          
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        if (data) {
          const formattedData = data.map(item => ({
            id: item.id,
            systolic: item.systolic,
            diastolic: item.diastolic,
            pulse: item.pulse,
            date: new Date(item.date),
            notes: item.notes || '',
            name: item.name || 'Anonymous',
            age: item.age,
            gender: item.gender,
            status: item.status
          }));
          setSharedReadings(formattedData);
        }
      } catch (error) {
        console.error('Error fetching shared readings:', error);
        toast.error('Failed to load shared readings');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchSharedReadings();
    
    // Set up real-time subscription to get updates
    const channel = supabase
      .channel('shared_bp_readings_changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'shared_bp_readings' 
      }, payload => {
        console.log('Received real-time update:', payload);
        const newReading = {
          id: payload.new.id,
          systolic: payload.new.systolic,
          diastolic: payload.new.diastolic,
          pulse: payload.new.pulse,
          date: new Date(payload.new.date),
          notes: payload.new.notes || '',
          name: payload.new.name || 'Anonymous',
          age: payload.new.age,
          gender: payload.new.gender,
          status: payload.new.status
        };
        setSharedReadings(prev => [newReading, ...prev]);
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });
      
    return () => {
      console.log('Cleaning up channel subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const addReading = async (reading: Omit<BPReading, 'id'>) => {
    const status = getHealthStatus(reading.systolic, reading.diastolic);
    const newReading = {
      ...reading,
      id: uuidv4(),
      status: status.status,
      name: user?.email || reading.name || 'Anonymous', // Use user email if authenticated
    };
    
    // Add to local state
    setReadings(prev => [newReading, ...prev]);
    
    try {
      console.log('Saving reading to Supabase:', {
        systolic: reading.systolic,
        diastolic: reading.diastolic,
        pulse: reading.pulse,
        date: reading.date.toISOString(),
        notes: reading.notes,
        name: user?.email || reading.name || 'Anonymous',
        age: reading.age,
        gender: reading.gender,
        status: status.status
      });
      
      // Save to Supabase
      const { error } = await supabase
        .from('shared_bp_readings')
        .insert({
          systolic: reading.systolic,
          diastolic: reading.diastolic,
          pulse: reading.pulse,
          date: reading.date.toISOString(),
          notes: reading.notes,
          name: user?.email || reading.name || 'Anonymous',
          age: reading.age,
          gender: reading.gender,
          status: status.status
        });
        
      if (error) {
        console.error('Supabase insertion error:', error);
        throw error;
      }
      
      toast(`Reading added: ${status.status.toUpperCase()}`, {
        description: status.message,
      });
    } catch (error) {
      console.error('Error saving reading to Supabase:', error);
      toast.error('Failed to share reading online');
    }
  };

  const deleteReading = (id: string) => {
    setReadings(prev => prev.filter(reading => reading.id !== id));
    toast("Reading deleted");
  };

  const getHealthStatus = (systolic: number, diastolic: number): {
    status: 'normal' | 'elevated' | 'high' | 'crisis' | 'low';
    color: string;
    message: string;
  } => {
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
    else if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
      return {
        status: 'elevated',
        color: 'health-elevated',
        message: 'Your blood pressure is elevated. Focus on lifestyle changes: reduce sodium intake, exercise regularly, limit alcohol, and manage stress.'
      };
    }
    // Hypertension Stage 1
    else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
      return {
        status: 'high',
        color: 'health-high',
        message: 'Your blood pressure is high (Stage 1 Hypertension). Reduce sodium intake, exercise regularly, limit alcohol, manage stress, and consult your doctor as medication may be needed.'
      };
    }
    // Hypertension Stage 2
    else if (systolic >= 140 || diastolic >= 90) {
      return {
        status: 'high',
        color: 'health-high',
        message: 'Your blood pressure is high (Stage 2 Hypertension). Urgent lifestyle changes are needed, and medication is likely necessary. Consult your doctor promptly.'
      };
    }
    // Hypertensive Crisis
    else if (systolic > 180 || diastolic > 120) {
      return {
        status: 'crisis',
        color: 'destructive',
        message: 'You may be experiencing a hypertensive crisis. Seek immediate medical attention if accompanied by symptoms such as chest pain, shortness of breath, back pain, numbness/weakness, vision changes, or difficulty speaking.'
      };
    }
    // Default case (should not reach here)
    else {
      return {
        status: 'elevated',
        color: 'health-elevated',
        message: 'Your blood pressure requires attention. Please consult with your healthcare provider for proper assessment.'
      };
    }
  };

  const getPulseStatus = (pulse: number): {
    status: 'normal' | 'high' | 'low';
    color: string;
    message: string;
  } => {
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
      sharedReadings,
      addReading, 
      deleteReading,
      getHealthStatus,
      getPulseStatus,
      isLoading
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
