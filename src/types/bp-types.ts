
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

export interface BPStatusResult {
  status: 'normal' | 'elevated' | 'high' | 'crisis' | 'low';
  color: string;
  message: string;
}

export interface PulseStatusResult {
  status: 'normal' | 'high' | 'low';
  color: string;
  message: string;
}

export interface BPContextType {
  readings: BPReading[];
  sharedReadings: BPReading[];
  addReading: (reading: Omit<BPReading, 'id'>) => void;
  deleteReading: (id: string) => void;
  getHealthStatus: (systolic: number, diastolic: number) => BPStatusResult;
  getPulseStatus: (pulse: number) => PulseStatusResult;
  isLoading: boolean;
  error?: string | null;
}
