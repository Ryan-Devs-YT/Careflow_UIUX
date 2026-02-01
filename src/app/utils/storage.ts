import { Medicine } from '@/app/data/medicines';

export interface StorageData {
  currentPrescription: Medicine[];
  todayMedications: any[];
  appointments: any[];
  caregivers: any[];
  userData: { name: string; profilePic: string | null };
  appSettings: { fontSize: number };
  adherenceHistory: Array<{ date: string; taken: number; total: number }>;
}

const STORAGE_KEY = 'careflow_data';

export const storage = {
  get: (): StorageData | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        // Convert date strings back to Date objects
        if (parsed.currentPrescription) {
          parsed.currentPrescription = parsed.currentPrescription.map((med: any) => ({
            ...med,
            refillDate: med.refillDate ? new Date(med.refillDate) : undefined
          }));
        }
        if (parsed.appointments) {
          parsed.appointments = parsed.appointments.map((apt: any) => ({
            ...apt,
            date: new Date(apt.date)
          }));
        }
        return parsed;
      }
    } catch (error) {
      console.error('Error reading from storage:', error);
    }
    return null;
  },

  set: (data: Partial<StorageData>) => {
    try {
      const existing = storage.get() || {};
      const merged = { ...existing, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (error) {
      console.error('Error writing to storage:', error);
    }
  },

  updatePrescription: (prescription: Medicine[]) => {
    storage.set({ currentPrescription: prescription });
  },

  updateTodayMedications: (medications: any[]) => {
    storage.set({ todayMedications: medications });
  },

  updateAppointments: (appointments: any[]) => {
    storage.set({ appointments: appointments });
  },

  updateCaregivers: (caregivers: any[]) => {
    storage.set({ caregivers: caregivers });
  },

  updateUserData: (userData: { name: string; profilePic: string | null }) => {
    storage.set({ userData });
  },

  updateAppSettings: (appSettings: { fontSize: number }) => {
    storage.set({ appSettings });
  },

  addAdherenceRecord: (date: string, taken: number, total: number) => {
    const existing = storage.get() || { adherenceHistory: [] };
    const newRecord = { date, taken, total };
    const updatedHistory = [...(existing.adherenceHistory || []), newRecord]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30); // Keep last 30 days
    storage.set({ adherenceHistory: updatedHistory });
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};