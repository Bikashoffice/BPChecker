
import React from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { Shield, UserCheck, Activity, AlertCircle } from "lucide-react";
import { useBP } from "@/context/BPContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface UserProfile {
  id: string;
  role: string;
  email: string;
}

const Admin = () => {
  const { isAdmin, user } = useAuth();
  const { sharedReadings } = useBP();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, role');

        if (profilesError) throw profilesError;

        // Get user emails from auth.users through the admin API endpoint
        // In a real app, this would be done through a secure server function
        // For this demo, we'll mock the emails based on the test accounts we created
        const usersWithEmails = profiles.map(profile => {
          let email = "unknown@example.com";
          if (profile.role === "admin") {
            email = "admin@example.com";
          } else if (profile.id === user?.id) {
            email = user.email || "unknown@example.com";
          } else {
            email = "nischit@example.com"; // Assume other user is nischit
          }
          return {
            ...profile,
            email
          };
        });

        setUsers(usersWithEmails);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, user]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-theme-purple-light/30 to-background">
        <Header />
        <main className="container px-4 py-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access the admin area.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-theme-purple-light/30 to-background">
      <Header />
      <main className="container px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>Manage system users and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                          }`}>
                            {user.role.toUpperCase()}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                BP Reading Overview
              </CardTitle>
              <CardDescription>Summary of all user blood pressure readings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-primary">
                      {sharedReadings.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Readings</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-health-high">
                      {sharedReadings.filter(r => r.status === 'high').length}
                    </div>
                    <div className="text-sm text-muted-foreground">High BP Readings</div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm font-medium mb-2">Recent Activity</div>
                  <div className="space-y-2">
                    {sharedReadings.slice(0, 3).map((reading) => (
                      <div key={reading.id} className="text-sm flex justify-between">
                        <span>{reading.name}</span>
                        <span className={`${
                          reading.status === 'high' ? 'text-health-high' : 
                          reading.status === 'normal' ? 'text-health-normal' : 
                          reading.status === 'elevated' ? 'text-health-elevated' : 
                          'text-health-low'
                        }`}>
                          {reading.systolic}/{reading.diastolic}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;
