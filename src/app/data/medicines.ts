export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  timing: 'pre' | 'post' | 'at' | null;
  description: string;
  usage: string;
  stock?: number;
  interactions?: string[];
  schedule?: string[];
  refillDate?: Date;
  color?: string;
  size?: string; // 'small', 'medium', 'large'
  shape?: string; // 'round', 'oval', 'capsule'
}

export const MEDICINE_DATABASE: Medicine[] = [
  { 
    id: 'db1', 
    name: 'Aspirin', 
    dosage: '75mg', 
    description: 'Keeps your blood moving easily', 
    usage: 'Heart health', 
    interactions: ['Ibuprofen', 'Warfarin'], 
    color: 'white',
    size: 'small',
    shape: 'round'
  },
  { 
    id: 'db2', 
    name: 'Paracetamol', 
    dosage: '500mg', 
    description: 'Good for pain and fever', 
    usage: 'General pain', 
    interactions: [], 
    color: 'white',
    size: 'medium',
    shape: 'oval'
  },
  { 
    id: 'db3', 
    name: 'Ibuprofen', 
    dosage: '200mg', 
    description: 'Reduces swelling and pain', 
    usage: 'Muscle pain', 
    interactions: ['Aspirin', 'Warfarin'], 
    color: 'pink',
    size: 'medium',
    shape: 'oval'
  },
  { 
    id: 'db4', 
    name: 'Amoxicillin', 
    dosage: '500mg', 
    description: 'Fights off bacteria', 
    usage: 'Infection', 
    interactions: [], 
    color: 'white',
    size: 'medium',
    shape: 'capsule'
  },
  { 
    id: 'db5', 
    name: 'Lisinopril', 
    dosage: '10mg', 
    description: 'Helps lower your blood pressure', 
    usage: 'Blood pressure', 
    interactions: ['Ibuprofen'], 
    color: 'blue',
    size: 'small',
    shape: 'round'
  },
  { 
    id: 'db6', 
    name: 'Atorvastatin', 
    dosage: '20mg', 
    description: 'Lowers bad cholesterol', 
    usage: 'Cholesterol', 
    interactions: [], 
    color: 'white',
    size: 'medium',
    shape: 'oval'
  },
  { 
    id: 'db7', 
    name: 'Metformin', 
    dosage: '500mg', 
    description: 'Helps control blood sugar', 
    usage: 'Diabetes', 
    interactions: ['Alcohol'], 
    color: 'white',
    size: 'large',
    shape: 'oval'
  },
  { 
    id: 'db8', 
    name: 'Warfarin', 
    dosage: '5mg', 
    description: 'Prevents blood clots', 
    usage: 'Blood thinner', 
    interactions: ['Aspirin', 'Ibuprofen'], 
    color: 'blue',
    size: 'small',
    shape: 'round'
  },
  { 
    id: 'db9', 
    name: 'Omeprazole', 
    dosage: '20mg', 
    description: 'Reduces stomach acid', 
    usage: 'Acid reflux', 
    interactions: [], 
    color: 'purple',
    size: 'small',
    shape: 'capsule'
  },
  { 
    id: 'db10', 
    name: 'Simvastatin', 
    dosage: '40mg', 
    description: 'Lowers cholesterol levels', 
    usage: 'Cholesterol', 
    interactions: [], 
    color: 'tan',
    size: 'medium',
    shape: 'oval'
  }
].map(m => ({ 
  ...m, 
  timing: 'at' as const, 
  stock: 30,
  schedule: []
}));

export function checkInteractions(currentMeds: Medicine[]): { risk: 'high' | 'medium' | 'low'; interactions: string[] } {
  const interactions: string[] = [];
  const medNames = currentMeds.map(m => m.name);
  
  currentMeds.forEach(med => {
    if (med.interactions) {
      med.interactions.forEach(interaction => {
        if (medNames.includes(interaction)) {
          interactions.push(`${med.name} + ${interaction}`);
        }
      });
    }
  });
  
  let risk: 'high' | 'medium' | 'low' = 'low';
  if (interactions.length >= 3) risk = 'high';
  else if (interactions.length >= 1) risk = 'medium';
  
  return { risk, interactions };
}

export function getRefillAlerts(medicines: Medicine[]): Medicine[] {
  return medicines.filter(med => (med.stock || 0) <= 2);
}

export function generateVoiceDescription(medicine: Medicine): string {
  const sizeDesc = medicine.size === 'small' ? 'small' : medicine.size === 'large' ? 'large' : '';
  const colorDesc = medicine.color || 'white';
  const shapeDesc = medicine.shape === 'round' ? 'round' : medicine.shape === 'capsule' ? 'capsule' : 'oval';
  
  return `Take the ${sizeDesc} ${colorDesc} ${shapeDesc} pill - ${medicine.name}`;
}