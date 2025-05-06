import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBP } from "@/context/BPContext";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function BPEntryForm() {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const { addReading } = useBP();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const systolicNum = parseInt(systolic);
    const diastolicNum = parseInt(diastolic);
    const pulseNum = parseInt(pulse);
    
    if (isNaN(systolicNum) || isNaN(diastolicNum) || isNaN(pulseNum)) {
      return;
    }
    
    addReading({
      systolic: systolicNum,
      diastolic: diastolicNum,
      pulse: pulseNum,
      date: new Date(),
      notes,
      name: name || "Anonymous" // Add the name field with a default value if not provided
    });
    
    // Reset form
    setSystolic("");
    setDiastolic("");
    setPulse("");
    setNotes("");
    // Keep the name as is for convenience in entering multiple readings
  };

  return (
    <Card className="bp-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Record New Reading</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                  <span className="sr-only">BP Info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Systolic (top number): The pressure when your heart beats.</p>
                <p>Diastolic (bottom number): The pressure when your heart rests.</p>
                <p>Pulse: Number of heartbeats per minute.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>Enter your blood pressure and pulse readings</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="bp-form">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name (or leave empty for Anonymous)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="systolic">Systolic</Label>
                <Input
                  id="systolic"
                  type="number"
                  placeholder="120"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diastolic">Diastolic</Label>
                <Input
                  id="diastolic"
                  type="number"
                  placeholder="80"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pulse">Pulse</Label>
                <Input
                  id="pulse"
                  type="number"
                  placeholder="75"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any details about your reading (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="bp-form" className="w-full">
          Save Reading
        </Button>
      </CardFooter>
    </Card>
  );
}
