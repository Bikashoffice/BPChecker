
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext';
import { BPReading, BPContextType } from '@/types/bp-types';
import { getHealthStatus, getPulseStatus } from '@/utils/bp-utils';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const BPContext = createContext<BPContextType | undefined>(undefined);

export const BPProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { readings, setReadings } = useLocalStorage();
  const { sharedReadings, isLoading, error } = useSupabaseRealtime();

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
      
      // Save to Supabase with retry logic
      const saveToSupabase = async (retries = 3) => {
        try {
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
          
          console.log('Reading saved to Supabase successfully');
          toast(`Reading added: ${status.status.toUpperCase()}`, {
            description: status.message,
          });
        } catch (error) {
          console.error(`Error saving reading to Supabase (attempt ${4 - retries}/3):`, error);
          if (retries > 0) {
            console.log(`Retrying in 1 second... (${retries} attempts left)`);
            setTimeout(() => saveToSupabase(retries - 1), 1000);
          } else {
            toast.error('Failed to share reading online. Your data is saved locally.');
          }
        }
      };
      
      await saveToSupabase();
    } catch (error) {
      console.error('Error in addReading function:', error);
      toast.error('Failed to save reading. Please try again.');
    }
  };

  const deleteReading = (id: string) => {
    setReadings(prev => prev.filter(reading => reading.id !== id));
    toast("Reading deleted");
  };

  return (
    <BPContext.Provider value={{ 
      readings, 
      sharedReadings,
      addReading, 
      deleteReading,
      getHealthStatus,
      getPulseStatus,
      isLoading,
      error
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

// Fix the re-export by using 'export type' instead of just 'export'
export type { BPReading };
