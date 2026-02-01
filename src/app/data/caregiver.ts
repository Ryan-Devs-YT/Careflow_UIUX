export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'mom' | 'dad' | 'spouse' | 'child' | 'sibling' | 'other';
  avatar: string;
  adherenceRate: number;
  lastMedicationTaken?: string;
  lastMedicationSkipped?: string;
  weatherLocation?: string;
  prescriptionIds: string[];
  notifications: boolean;
}

export interface CareUpdate {
  id: string;
  memberId: string;
  type: 'taken' | 'skipped' | 'refill' | 'appointment';
  medication?: string;
  timestamp: Date;
  message: string;
}

export interface WeatherTip {
  condition: string;
  tip: string;
  medications: string[]; // Medications affected by this weather
}

export const WEATHER_TIPS: WeatherTip[] = [
  {
    condition: 'hot',
    tip: 'Stay hydrated! Some medications may increase dehydration risk in hot weather.',
    medications: ['Diuretics', 'Blood pressure medications']
  },
  {
    condition: 'cold',
    tip: 'Keep warm! Some medications may affect body temperature regulation.',
    medications: ['Beta blockers', 'Thyroid medications']
  },
  {
    condition: 'rainy',
    tip: 'Perfect day for indoor activities! Don\'t let weather disrupt your medication schedule.',
    medications: ['All medications']
  },
  {
    condition: 'humid',
    tip: 'High humidity can affect medication storage. Keep in cool, dry place.',
    medications: ['Insulin', 'Liquid medications']
  }
];

export const DEFAULT_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'mom',
    name: 'Mom',
    relationship: 'mom',
    avatar: '👩',
    adherenceRate: 85,
    lastMedicationTaken: '8:30 AM - Aspirin',
    weatherLocation: 'New York, NY',
    prescriptionIds: ['med1', 'med2'],
    notifications: true
  },
  {
    id: 'dad',
    name: 'Dad',
    relationship: 'dad',
    avatar: '👨',
    adherenceRate: 92,
    lastMedicationTaken: '9:00 AM - Metformin',
    lastMedicationSkipped: '6:00 PM - Lisinopril',
    weatherLocation: 'New York, NY',
    prescriptionIds: ['med3', 'med4'],
    notifications: true
  }
];