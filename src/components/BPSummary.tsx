
import { useBP } from "@/context/BPContext";
import { BPReading } from "@/types/bp-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, HeartPulseIcon } from "lucide-react";

export function BPSummary() {
  const { readings, getHealthStatus, getPulseStatus } = useBP();
  
  // Get last reading or return null if no readings
  const getLastReading = (): BPReading | null => {
    return readings.length > 0 ? readings[0] : null;
  };
  
  const lastReading = getLastReading();
  
  // Calculate averages
  const calculateAverages = () => {
    if (readings.length === 0) return { systolic: 0, diastolic: 0, pulse: 0 };
    
    const sum = readings.reduce((acc, reading) => {
      return {
        systolic: acc.systolic + reading.systolic,
        diastolic: acc.diastolic + reading.diastolic,
        pulse: acc.pulse + reading.pulse
      };
    }, { systolic: 0, diastolic: 0, pulse: 0 });
    
    return {
      systolic: Math.round(sum.systolic / readings.length),
      diastolic: Math.round(sum.diastolic / readings.length),
      pulse: Math.round(sum.pulse / readings.length)
    };
  };
  
  const averages = calculateAverages();
  
  // Get health status
  const getStatus = () => {
    if (!lastReading) return { status: 'normal', color: 'health-normal' };
    return getHealthStatus(lastReading.systolic, lastReading.diastolic);
  };
  
  const status = getStatus();
  
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  if (!lastReading) {
    return (
      <Card className="bp-card">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>No readings yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Add your first reading to see stats</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bp-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your BP Summary</CardTitle>
            <CardDescription>
              Latest reading: {formatDate(lastReading.date)}
            </CardDescription>
          </div>
          <div className={`px-3 py-1 rounded-full bg-${status.color}/20 text-${status.color} text-sm font-medium`}>
            {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-health-high">
              <ArrowUpIcon className="h-5 w-5 mr-1" />
              <span className="text-2xl font-semibold">{lastReading.systolic}</span>
            </div>
            <span className="text-xs text-muted-foreground">Systolic</span>
            <span className="text-xs">(avg: {averages.systolic})</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center text-health-low">
              <ArrowDownIcon className="h-5 w-5 mr-1" />
              <span className="text-2xl font-semibold">{lastReading.diastolic}</span>
            </div>
            <span className="text-xs text-muted-foreground">Diastolic</span>
            <span className="text-xs">(avg: {averages.diastolic})</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center text-health-pulse">
              <HeartPulseIcon className="h-5 w-5 mr-1 animate-pulse" />
              <span className="text-2xl font-semibold">{lastReading.pulse}</span>
            </div>
            <span className="text-xs text-muted-foreground">Pulse</span>
            <span className="text-xs">(avg: {averages.pulse})</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
