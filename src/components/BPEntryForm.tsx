
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBP } from "@/context/BPContext";
import { InfoIcon, UserIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Command,
  CommandEmpty, 
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function BPEntryForm() {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [isOpenUserDropdown, setIsOpenUserDropdown] = useState(false);
  const { addReading, readings } = useBP();
  const [existingUsers, setExistingUsers] = useState<{name: string, age: string, gender: string}[]>([]);

  // Extract unique users from readings
  useEffect(() => {
    const uniqueUsers = Array.from(
      new Map(
        readings
          .filter(reading => reading.name !== "Anonymous")
          .map(reading => [
            reading.name, 
            { 
              name: reading.name,
              age: reading.age || "",
              gender: reading.gender || ""
            }
          ])
      ).values()
    );
    setExistingUsers(uniqueUsers);
  }, [readings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const systolicNum = parseInt(systolic);
    const diastolicNum = parseInt(diastolic);
    const pulseNum = parseInt(pulse);
    const ageNum = age ? parseInt(age) : 0;
    
    if (isNaN(systolicNum) || isNaN(diastolicNum) || isNaN(pulseNum)) {
      return;
    }
    
    addReading({
      systolic: systolicNum,
      diastolic: diastolicNum,
      pulse: pulseNum,
      date: new Date(),
      notes,
      name: name || "Anonymous", 
      age: ageNum,
      gender
    });
    
    // Reset form
    setSystolic("");
    setDiastolic("");
    setPulse("");
    setNotes("");
    // Keep the name as is for convenience in entering multiple readings
  };

  const handleSelectUser = (selectedUser: {name: string, age: string, gender: string}) => {
    setName(selectedUser.name);
    setAge(selectedUser.age);
    setGender(selectedUser.gender);
    setIsOpenUserDropdown(false);
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
              <div className="flex items-center justify-between">
                <Label htmlFor="name">User</Label>
                {existingUsers.length > 0 && (
                  <Popover open={isOpenUserDropdown} onOpenChange={setIsOpenUserDropdown}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1 text-xs"
                      >
                        <UserIcon className="h-3.5 w-3.5" />
                        Select Existing
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="end">
                      <Command>
                        <CommandInput placeholder="Search users..." />
                        <CommandList>
                          <CommandEmpty>No users found</CommandEmpty>
                          <CommandGroup>
                            {existingUsers.map((user) => (
                              <CommandItem 
                                key={user.name}
                                onSelect={() => handleSelectUser(user)}
                                className="cursor-pointer"
                              >
                                {user.name} {user.age ? `(${user.age}${user.gender ? ', ' + user.gender : ''})` : ''}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <Input
                id="name"
                placeholder="Your name (or leave empty for Anonymous)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Years"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
