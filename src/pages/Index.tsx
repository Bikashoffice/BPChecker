
import { Header } from "@/components/Header";
import { BPEntryForm } from "@/components/BPEntryForm";
import { BPSummary } from "@/components/BPSummary";
import { HealthInsights } from "@/components/HealthInsights";
import { ReadingsTable } from "@/components/ReadingsTable";
import { TrendsChart } from "@/components/TrendsChart";
import { SharedReadings } from "@/components/SharedReadings";
import { BPProvider } from "@/context/BPContext";
import { Button } from "@/components/ui/button";
import { InfoIcon, ShieldIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { isAdmin } = useAuth();
  
  return (
    <BPProvider>
      <div className="min-h-screen bg-gradient-to-b from-theme-purple-light/30 to-background">
        <Header />
        <main className="container px-4 py-6 md:py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <BPEntryForm />
              <div className="mt-4 flex flex-col gap-2">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/bp-info" className="flex items-center justify-center gap-2">
                    <InfoIcon className="h-4 w-4" />
                    <span>Learn About Blood Pressure Ranges</span>
                  </Link>
                </Button>
                
                {isAdmin && (
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/admin" className="flex items-center justify-center gap-2">
                      <ShieldIcon className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div>
              <BPSummary />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <HealthInsights />
            </div>
          </div>
          
          <div className="mt-6 space-y-6">
            <SharedReadings />
            
            <TrendsChart />
            
            <ReadingsTable />
          </div>
        </main>
      </div>
    </BPProvider>
  );
};

export default Index;
