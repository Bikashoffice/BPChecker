
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { BPReading } from '@/types/bp-types';
import { toast } from "sonner";

export const useSupabaseRealtime = () => {
  const [sharedReadings, setSharedReadings] = useState<BPReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSharedReadings() {
      setIsLoading(true);
      try {
        console.log('Fetching shared readings...');
        const { data, error } = await supabase
          .from('shared_bp_readings')
          .select('*')
          .order('shared_at', { ascending: false });
          
        if (error) {
          console.error('Supabase error:', error);
          toast.error('Failed to load shared readings: ' + error.message);
          throw error;
        }
        
        if (data) {
          console.log('Received shared readings:', data.length);
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

  return { sharedReadings, isLoading };
};
