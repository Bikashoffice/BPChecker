
import { useBP, BPReading } from "@/context/BPContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableIcon, Trash2Icon } from "lucide-react";

export function ReadingsTable() {
  const { readings, deleteReading, getHealthStatus } = useBP();
  
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TableIcon className="h-5 w-5" />
          Reading History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {readings.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No readings recorded yet</p>
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
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {readings.map((reading) => (
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
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteReading(reading.id)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2Icon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
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
