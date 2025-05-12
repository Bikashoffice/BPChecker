
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { InfoIcon, ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";

const BPInfo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-theme-purple-light/30 to-background">
      <Header />
      <main className="container px-4 py-6 md:py-8">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <InfoIcon className="h-5 w-5 text-primary" />
              Blood Pressure Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Understanding Blood Pressure</h2>
              <p className="text-muted-foreground mb-3">
                Blood pressure consists of two measurements:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <span className="font-medium">Systolic Pressure (Top Number)</span>: Measures the pressure in your arteries when your heart beats
                </li>
                <li>
                  <span className="font-medium">Diastolic Pressure (Bottom Number)</span>: Measures the pressure in your arteries when your heart rests between beats
                </li>
              </ul>
              <p>
                Blood pressure is expressed as <span className="font-medium">systolic/diastolic</span> (e.g., 120/80 mmHg)
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Blood Pressure Categories</h2>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="text-center font-semibold">Systolic (mmHg)</TableHead>
                      <TableHead className="text-center font-semibold">Diastolic (mmHg)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-health-normal">Normal</TableCell>
                      <TableCell className="text-center">≤ 120</TableCell>
                      <TableCell className="text-center">and ≤ 80</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-health-elevated">Elevated</TableCell>
                      <TableCell className="text-center">121-129</TableCell>
                      <TableCell className="text-center">and < 80</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-health-high">Hypertension Stage 1</TableCell>
                      <TableCell className="text-center">130-139</TableCell>
                      <TableCell className="text-center">or 80-89</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-health-high">Hypertension Stage 2</TableCell>
                      <TableCell className="text-center">≥ 140</TableCell>
                      <TableCell className="text-center">or ≥ 90</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-destructive">Hypertensive Crisis</TableCell>
                      <TableCell className="text-center">≥ 180</TableCell>
                      <TableCell className="text-center">or ≥ 120</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-health-low">Low (Hypotension)</TableCell>
                      <TableCell className="text-center">< 90</TableCell>
                      <TableCell className="text-center">or < 60</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Quick Reference</h2>
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-24 font-medium">Normal:</span> 
                    <span>≤ 120/80 mmHg</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-24 font-medium">Elevated:</span> 
                    <span>121-129/< 80 mmHg</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-24 font-medium">Stage 1:</span> 
                    <span>130-139/80-89 mmHg</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-24 font-medium">Stage 2:</span> 
                    <span>≥ 140/≥ 90 mmHg</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-24 font-medium text-destructive">Crisis:</span> 
                    <span>≥ 180/≥ 120 mmHg</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-24 font-medium">Low:</span> 
                    <span>< 90/< 60 mmHg</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Factors Affecting Blood Pressure</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Age</li>
                <li>Physical activity level</li>
                <li>Diet (especially sodium intake)</li>
                <li>Stress</li>
                <li>Medications</li>
                <li>Underlying health conditions (e.g., diabetes, kidney disease)</li>
              </ul>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Note:</strong> This information is for general education purposes only. 
                Always consult with a healthcare provider for personalized medical advice.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BPInfo;
