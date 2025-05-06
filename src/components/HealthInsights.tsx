
import { useBP } from "@/context/BPContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";

export function HealthInsights() {
  const { readings, getHealthStatus, getPulseStatus } = useBP();
  
  const getLastReading = () => {
    return readings.length > 0 ? readings[0] : null;
  };
  
  const lastReading = getLastReading();
  
  if (!lastReading) {
    return (
      <Card className="bp-card h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <InfoIcon className="h-5 w-5 text-primary" />
            Health Insights
          </CardTitle>
          <CardDescription>Add readings to get personalized insights</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Track your blood pressure regularly to receive personalized health recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const bpStatus = getHealthStatus(lastReading.systolic, lastReading.diastolic);
  const pulseStatus = getPulseStatus(lastReading.pulse);
  
  const getTips = () => {
    if (bpStatus.status === 'normal' && pulseStatus.status === 'normal') {
      return [
        "Keep maintaining a balanced diet with plenty of fruits and vegetables",
        "Continue your regular physical activity of at least 30 minutes daily",
        "Maintain healthy sleep habits with 7-9 hours of restful sleep",
        "Practice stress management techniques like meditation"
      ];
    }
    
    let tips = [];
    
    if (bpStatus.status === 'low') {
      tips = [
        "Stay hydrated by drinking plenty of water",
        "Eat smaller, more frequent meals",
        "Limit alcohol consumption",
        "Stand up slowly to avoid dizziness",
        "Consider adding more salt to your diet (consult doctor first)"
      ];
    }
    else if (bpStatus.status === 'elevated' || bpStatus.status === 'high') {
      tips = [
        "Reduce sodium intake to less than 1,500mg daily",
        "Increase physical activity to at least 150 minutes per week",
        "Adopt the DASH diet (rich in fruits, vegetables, whole grains)",
        "Limit alcohol consumption and avoid smoking",
        "Practice stress reduction techniques"
      ];
    }
    
    if (pulseStatus.status === 'low') {
      tips.push("Monitor for symptoms like fatigue or dizziness");
      tips.push("Discuss with your doctor if you're on heart medications");
    }
    else if (pulseStatus.status === 'high') {
      tips.push("Reduce caffeine and stimulant intake");
      tips.push("Practice deep breathing exercises");
      tips.push("Ensure you're staying hydrated");
    }
    
    return tips;
  };
  
  const tips = getTips();

  return (
    <Card className="bp-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <InfoIcon className="h-5 w-5 text-primary" />
          Health Insights
        </CardTitle>
        <CardDescription>Based on your recent measurements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className={`font-medium text-${bpStatus.color} mb-1`}>Blood Pressure: {bpStatus.status.toUpperCase()}</h3>
          <p className="text-sm">{bpStatus.message}</p>
        </div>
        
        <div>
          <h3 className={`font-medium text-${pulseStatus.color} mb-1`}>Pulse Rate: {pulseStatus.status.toUpperCase()}</h3>
          <p className="text-sm">{pulseStatus.message}</p>
        </div>
        
        <div>
          <h3 className="font-medium mb-1">Recommended Actions:</h3>
          <ul className="text-sm list-disc pl-5 space-y-1">
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
