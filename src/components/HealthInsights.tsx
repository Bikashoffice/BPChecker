
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
    const isElderlyUser = lastReading.age && lastReading.age > 65;
    const isFemaleUser = lastReading.gender === "female";
    const isMaleUser = lastReading.gender === "male";
    const isYoungUser = lastReading.age && lastReading.age < 30;
    
    if (bpStatus.status === 'normal' && pulseStatus.status === 'normal') {
      const tips = [
        "Keep maintaining a balanced diet with plenty of fruits and vegetables",
        "Continue your regular physical activity of at least 30 minutes daily",
        "Maintain healthy sleep habits with 7-9 hours of restful sleep",
        "Practice stress management techniques like meditation"
      ];
      
      if (isElderlyUser) {
        tips.push("Annual health checkups are especially important at your age");
      }
      
      return tips;
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
      
      if (isFemaleUser) {
        tips.push("Low blood pressure can sometimes be related to hormonal changes - consider discussing with your doctor");
      }
      
      if (isElderlyUser) {
        tips.push("At your age, low blood pressure requires careful monitoring - consult your doctor");
      }
    }
    else if (bpStatus.status === 'elevated') {
      tips = [
        "Reduce sodium intake to less than 1,500mg daily",
        "Increase physical activity to at least 150 minutes per week",
        "Adopt the DASH diet (rich in fruits, vegetables, whole grains)",
        "Limit alcohol consumption and avoid smoking",
        "Practice stress reduction techniques"
      ];
      
      if (isMaleUser && !isYoungUser) {
        tips.push("Men over 30 have a higher risk of hypertension - consider more frequent monitoring");
      }
      
      if (isElderlyUser) {
        tips.push("Consider speaking with your doctor about lifestyle changes suitable for your age");
      }
    }
    else if (bpStatus.status === 'high') {
      tips = [
        "Reduce sodium intake to less than 1,500mg daily",
        "Increase physical activity to at least 150 minutes per week",
        "Adopt the DASH diet (rich in fruits, vegetables, whole grains)",
        "Limit alcohol consumption and avoid smoking",
        "Consult your doctor about medication options",
        "Monitor your blood pressure regularly"
      ];
      
      if (isMaleUser && !isYoungUser) {
        tips.push("Men over 30 have a higher risk of serious hypertension - consult your doctor");
      }
      
      if (isElderlyUser) {
        tips.push("Consider speaking with your doctor about medication options suitable for elderly patients");
      }
    }
    else if (bpStatus.status === 'crisis') {
      return [
        "Seek immediate medical attention if experiencing symptoms like severe headache, chest pain, vision problems, or difficulty breathing",
        "Sit down and try to remain calm while waiting for help",
        "Do not attempt to drive yourself to the hospital",
        "If you have emergency blood pressure medication prescribed by your doctor, take it as directed",
        "This is a medical emergency that requires immediate professional treatment"
      ];
    }
    
    if (pulseStatus.status === 'low') {
      tips.push("Monitor for symptoms like fatigue or dizziness");
      tips.push("Discuss with your doctor if you're on heart medications");
      
      if (isElderlyUser) {
        tips.push("Low pulse in elderly people may require special attention - consult your doctor");
      }
    }
    else if (pulseStatus.status === 'high') {
      tips.push("Reduce caffeine and stimulant intake");
      tips.push("Practice deep breathing exercises");
      tips.push("Ensure you're staying hydrated");
      
      if (isYoungUser) {
        tips.push("For young adults, elevated heart rate may be related to stress or anxiety - consider relaxation techniques");
      }
    }
    
    return tips;
  };
  
  const tips = getTips();

  // Create user information display
  const getUserDescription = () => {
    let description = `For ${lastReading.name || 'Anonymous'}`;
    if (lastReading.age) {
      description += `, ${lastReading.age} years old`;
    }
    if (lastReading.gender) {
      description += `, ${lastReading.gender}`;
    }
    return description;
  };

  return (
    <Card className="bp-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <InfoIcon className="h-5 w-5 text-primary" />
          Health Insights
        </CardTitle>
        <CardDescription>{getUserDescription()}</CardDescription>
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
