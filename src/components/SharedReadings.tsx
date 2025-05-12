
import { useBP } from "@/context/BPContext";
import { BPReading } from "@/types/bp-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableIcon, AlertCircle, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
import { toast } from "sonner";

export function SharedReadings() {
  const { getHealthStatus } = useBP();
  const { sharedReadings, isLoading, error, refetchReadings } = useSupabaseRealtime();
  
  const handleRefresh = async () => {
    toast.info("Refreshing shared readings...");
    await refetchReadings();
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };
  
  const getStatusBadge = (reading: BPReading) => {
    const { status, color } = getHealthStatus(reading.systolic, reading.diastolic);
    
    // Use specific colors for different status types
    if (status === 'crisis') {
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-destructive/20 text-destructive`}>
          CRISIS
        </span>
      );
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${color}/20 text-${color}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  // Create a function to display user info including age and gender
  const getUserInfo = (reading: BPReading) => {
    let info = reading.name || 'Anonymous';
    
    // Add age if available
    if (reading.age) {
      info += ` (${reading.age}`;
      
      // Add gender if available
      if (reading.gender) {
        info += `, ${reading.gender}`;
      }
      
      info += ')';
    } else if (reading.gender) {
      // Only add gender in parentheses if no age is available
      info += ` (${reading.gender})`;
    }
    
    return info;
  };
  
  return (
    <Card className="bp-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TableIcon className="h-5 w-5" />
          Shared Community Readings
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
          className="h-8 gap-1"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : sharedReadings.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No shared readings found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add a reading to see it here
            </p>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-center">Systolic</TableHead>
                  <TableHead className="text-center">Diastolic</TableHead>
                  <TableHead className="text-center">Pulse</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sharedReadings.map((reading) => (
                  <TableRow key={reading.id}>
                    <TableCell>{formatDate(reading.date)}</TableCell>
                    <TableCell>{getUserInfo(reading)}</TableCell>
                    <TableCell className="text-center font-medium text-health-high">
                      {reading.systolic}
                    </TableCell>
                    <TableCell className="text-center font-medium text-health-low">
                      {reading.diastolic}
                    </TableCell>
                    <TableCell className="text-center font-medium text-health-pulse">
                      {reading.pulse}
                    </TableCell>
                    <TableCell>{getStatusBadge(reading)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {reading.notes || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
