
import { BPStatusResult, PulseStatusResult } from "@/types/bp-types";

/**
 * Determines the blood pressure status based on systolic and diastolic values
 */
export const getHealthStatus = (systolic: number, diastolic: number): BPStatusResult => {
  // Hypertensive Crisis - highest priority check
  if (systolic >= 180 || diastolic >= 120) {
    return {
      status: 'crisis',
      color: 'destructive',
      message: 'You may be experiencing a hypertensive crisis. Seek immediate medical attention if accompanied by symptoms such as chest pain, shortness of breath, back pain, numbness/weakness, vision changes, or difficulty speaking.'
    };
  }
  // Hypertension Stage 2
  else if (systolic >= 140 || diastolic >= 90) {
    return {
      status: 'high',
      color: 'health-high',
      message: 'Your blood pressure is high (Stage 2 Hypertension). Urgent lifestyle changes are needed, and medication is likely necessary. Consult your doctor promptly.'
    };
  }
  // Hypertension Stage 1
  else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return {
      status: 'high',
      color: 'health-high',
      message: 'Your blood pressure is high (Stage 1 Hypertension). Reduce sodium intake, exercise regularly, limit alcohol, manage stress, and consult your doctor as medication may be needed.'
    };
  }
  // Elevated
  else if (systolic > 120 && systolic < 130 && diastolic < 80) {
    return {
      status: 'elevated',
      color: 'health-elevated',
      message: 'Your blood pressure is elevated. Focus on lifestyle changes: reduce sodium intake, exercise regularly, limit alcohol, and manage stress.'
    };
  }
  // Normal
  else if (systolic <= 120 && diastolic <= 80) {
    return {
      status: 'normal',
      color: 'health-normal',
      message: 'Your blood pressure is normal. Keep maintaining healthy habits like regular exercise, balanced diet, and proper sleep.'
    };
  }
  // Low blood pressure
  else if (systolic < 90 || diastolic < 60) {
    return {
      status: 'low',
      color: 'health-low',
      message: 'Your blood pressure is low. Stay hydrated, eat small meals frequently, and avoid standing up too quickly. Consult your doctor if you experience dizziness or fainting.'
    };
  }
  // Default case (should not reach here)
  else {
    return {
      status: 'elevated',
      color: 'health-elevated',
      message: 'Your blood pressure requires attention. Please consult with your healthcare provider for proper assessment.'
    };
  }
};

/**
 * Determines the pulse status based on pulse rate
 */
export const getPulseStatus = (pulse: number): PulseStatusResult => {
  // Low pulse rate
  if (pulse < 60) {
    return {
      status: 'low',
      color: 'health-low',
      message: 'Your pulse rate is low. This may be normal for athletes, but consult your doctor if experiencing dizziness, fatigue, or shortness of breath.'
    };
  }
  // Normal pulse rate
  else if (pulse >= 60 && pulse <= 100) {
    return {
      status: 'normal',
      color: 'health-pulse',
      message: 'Your pulse rate is normal. Regular exercise and managing stress can help maintain a healthy heart rate.'
    };
  }
  // High pulse rate
  else {
    return {
      status: 'high',
      color: 'health-high',
      message: 'Your pulse rate is high. Reduce caffeine and alcohol intake, practice deep breathing, and consult your doctor if it persists.'
    };
  }
};
