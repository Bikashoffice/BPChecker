import { useBP } from "@/context/BPContext";
import { BPReading } from "@/types/bp-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ChartBarIcon } from "lucide-react";

export function TrendsChart() {
  const { readings } = useBP();
  
  const getChartData = () => {
    if (readings.length === 0) return [];
    
    // Get last 10 readings in chronological order
    const sortedData = [...readings]
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(-10);
    
    return sortedData.map(reading => ({
      date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(reading.date),
      systolic: reading.systolic,
      diastolic: reading.diastolic,
      pulse: reading.pulse,
    }));
  };
  
  const chartData = getChartData();

  return (
    <Card className="bp-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartBarIcon className="h-5 w-5" />
          Blood Pressure Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        {readings.length < 2 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-muted-foreground mb-2">Not enough data to show trends</p>
            <p className="text-sm text-muted-foreground">Add at least two readings to see your trends over time</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="systolic" 
                  stroke="#EF4444" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  name="Systolic"
                />
                <Line 
                  type="monotone" 
                  dataKey="diastolic" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  name="Diastolic"
                />
                <Line 
                  type="monotone" 
                  dataKey="pulse" 
                  stroke="#8B5CF6" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  name="Pulse"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
