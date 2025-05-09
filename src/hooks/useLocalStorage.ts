
import { useState, useEffect } from 'react';
import { BPReading } from '@/types/bp-types';
import { toast } from "sonner";

export const useLocalStorage = () => {
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

  // Save readings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('bp-readings', JSON.stringify(readings));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toast.error('Failed to save your readings locally');
    }
  }, [readings]);

  return { readings, setReadings };
};
