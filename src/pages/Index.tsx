
import { Header } from "@/components/Header";
import { BPEntryForm } from "@/components/BPEntryForm";
import { BPSummary } from "@/components/BPSummary";
import { HealthInsights } from "@/components/HealthInsights";
import { ReadingsTable } from "@/components/ReadingsTable";
import { TrendsChart } from "@/components/TrendsChart";
import { BPProvider } from "@/context/BPContext";

const Index = () => {
  return (
    <BPProvider>
      <div className="min-h-screen bg-gradient-to-b from-theme-purple-light/30 to-background">
        <Header />
        <main className="container px-4 py-6 md:py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <BPEntryForm />
            </div>
            <div>
              <BPSummary />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <HealthInsights />
            </div>
          </div>
          
          <div className="mt-6">
            <TrendsChart />
          </div>
          
          <div className="mt-6">
            <ReadingsTable />
          </div>
        </main>
      </div>
    </BPProvider>
  );
};

export default Index;
