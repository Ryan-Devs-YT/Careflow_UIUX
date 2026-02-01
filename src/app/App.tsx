import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast, Toaster } from 'sonner';
import { storage } from '@/app/utils/storage';
import { Medicine } from '@/app/data/medicines';
import { notificationService } from '@/app/services/notifications';

// Onboarding components
import { WelcomeScreen } from '@/app/components/onboarding/WelcomeScreen';
import { PrivacyScreen, PermissionSettings } from '@/app/components/onboarding/PrivacyScreen';
import { SuccessScreen } from '@/app/components/onboarding/SuccessScreen';

// Main screens
import { HomeScreen } from '@/app/components/HomeScreen';
import { PrescriptionScreen } from '@/app/components/PrescriptionScreen';
import { TimeTableScreen } from '@/app/components/TimeTableScreen';
import { AppointmentsScreen } from '@/app/components/AppointmentsScreen';
import { PharmacistChat } from '@/app/components/PharmacistChat';
import { MyCareGiverScreen } from '@/app/components/MyCareGiverScreen';
import { CareGiverHub } from '@/app/components/CareGiverHub';
import { FamilyMemberView } from '@/app/components/FamilyMemberView';
import { FamilyMember } from '@/app/data/caregiver';
import { ForestGrowthAnimation } from '@/app/components/ui/ForestGrowthAnimation';
import { AnaliticalsScreen } from '@/app/components/AnaliticalsScreen';
import { CareGiverPermissionScreen } from '@/app/components/CareGiverPermissionScreen';
import { SettingsScreen } from '@/app/components/SettingsScreen';
import { RevokeAccessScreen } from '@/app/components/RevokeAccessScreen';
import { HelpCenterScreen } from '@/app/components/HelpCenterScreen';
import { ContactSupportScreen } from '@/app/components/ContactSupportScreen';

type OnboardingStep = 'welcome' | 'privacy' | 'success' | 'complete';
type Screen = 'home' | 'prescription' | 'timetable' | 'appointments' | 'pharmacist' | 'caregivers' | 'analyticals' | 'caregiver-permission' | 'settings' | 'revoke-access' | 'help-center' | 'contact-support' | 'caregiver-hub' | 'family-member-view';



export interface TodayMedication {
  id: string;
  medicineId: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  hour: number;
  description?: string;
}

interface CareGiver {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  avatar?: string;
  status: 'active' | 'pending';
}

export interface Appointment {
  id: string;
  type: 'doctor' | 'refill' | 'test' | 'custom';
  title: string;
  date: Date;
  time: string;
  location?: string;
  doctor?: string;
  description?: string;
}

interface Settings {
  fontSize: number;
}

function App() {
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('welcome');
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [permissions, setPermissions] = useState<PermissionSettings>({
    notifications: true,
    camera: true,
    timeCheck: true, // Replaced location with time check
  });
  const [userData, setUserData] = useState({ name: '', profilePic: null as string | null });
  const [appSettings, setAppSettings] = useState<Settings>({ fontSize: 16 });
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<FamilyMember | null>(null);
  const [showForestGrowth, setShowForestGrowth] = useState(false);
  const [caregiverUpdates, setCaregiverUpdates] = useState<any[]>([]);

  // Load data from storage on mount
  useEffect(() => {
    const storedData = storage.get();
    if (storedData) {
      if (storedData.userData) setUserData(storedData.userData);
      if (storedData.appSettings) setAppSettings(storedData.appSettings);
      if (storedData.currentPrescription) setCurrentPrescription(storedData.currentPrescription);
      if (storedData.todayMedications) setTodayMedications(storedData.todayMedications);
      if (storedData.appointments) setAppointments(storedData.appointments);
      if (storedData.caregivers) setCaregivers(storedData.caregivers);
      setOnboardingStep('complete'); // Skip onboarding if data exists
    }

    // Initialize notifications
    notificationService.requestPermission();
  }, []);

  // Current prescription data - loaded from storage or empty
  const [currentPrescription, setCurrentPrescription] = useState<Medicine[]>([]);

  // Today's medications - derived from prescription and schedule
  const [todayMedications, setTodayMedications] = useState<TodayMedication[]>([]);

  // Appointments - loaded from storage or with default
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const stored = storage.get();
    return stored?.appointments || [
      {
        id: '1',
        type: 'doctor',
        title: 'Dr. Sarah Johnson - Regular Checkup',
        date: new Date(2026, 1, 5),
        time: '10:00 AM',
        location: 'Main Street Medical Center',
        doctor: 'Dr. Sarah Johnson',
      }
    ];
  });

  // Derived logic for Today's Medications
  useEffect(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = days[new Date().getDay()];
    
    const derived = currentPrescription
      .filter(med => med.schedule?.includes(today))
      .map(med => ({
        id: `today-${med.id}`,
        medicineId: med.id,
        name: med.name,
        dosage: med.dosage,
        time: '08:00 AM', // Default, will be managed in timetable
        taken: false,
        hour: 8,
      }));
    
    // Only update if current list is empty (prevents overwriting 'taken' status during a session)
    if (todayMedications.length === 0 && derived.length > 0) {
      setTodayMedications(derived);
    }
  }, [currentPrescription]);

  // Caregivers data - loaded from storage or with default
  const [caregivers, setCaregivers] = useState<CareGiver[]>(() => {
    const stored = storage.get();
    return stored?.caregivers || [
      {
        id: '1',
        name: 'Sarah Johnson',
        relationship: 'Daughter',
        phone: '+1 (555) 123-4567',
        email: 'sarah.j@email.com',
        avatar: '👧',
        status: 'active',
      }
    ];
  });

  // Handlers
  const handleMarkTaken = (id: string) => {
    // Find the medication before filtering
    const todayMed = todayMedications.find(m => m.id === id);
    
    // Remove from today's list
    setTodayMedications(prev => {
      const filtered = prev.filter(med => med.id !== id);
      storage.updateTodayMedications(filtered);
      return filtered;
    });
    
    // Update stock logic
    if (todayMed) {
      setCurrentPrescription(prev => {
        const updated = prev.map(med => {
          if (med.id === todayMed.medicineId && med.stock !== undefined) {
            const newStock = med.stock - 1;
            if (newStock === 2) {
              toast.warning(`Refill Alert: ${med.name} stock is low (2 left)`);
            }
            return { ...med, stock: newStock };
          }
          return med;
        });
        storage.updatePrescription(updated);
        return updated;
      });

      // Track adherence
      const today = new Date().toISOString().split('T')[0];
      const totalCount = todayMedications.length;
      storage.addAdherenceRecord(today, 1, totalCount);
    }

    toast.success('Medication taken! 🌱');
  };

  const handleNavigate = (section: string, memberId?: string) => {
    if (section === 'family-member-view' && memberId) {
      // Find the family member
      const members = [
        { id: 'mom', name: 'Mom', relationship: 'mom' as const, avatar: '👩', adherenceRate: 85, prescriptionIds: [], notifications: true },
        { id: 'dad', name: 'Dad', relationship: 'dad' as const, avatar: '👨', adherenceRate: 92, prescriptionIds: [], notifications: true }
      ];
      const member = members.find(m => m.id === memberId);
      if (member) {
        setSelectedFamilyMember(member);
        setCurrentScreen('family-member-view');
      }
    } else {
      setCurrentScreen(section as Screen);
    }
  };

  const handleReplaceMedicine = (oldId: string, newMed: Medicine) => {
    setCurrentPrescription(prev => {
      const updated = prev.map(med => med.id === oldId ? { ...newMed, id: oldId, timing: med.timing, stock: med.stock } : med);
      storage.updatePrescription(updated);
      return updated;
    });
    toast.success('Medication replaced');
  };

  const handleDiscardMedicine = (id: string) => {
    setCurrentPrescription(prev => {
      const updated = prev.filter(med => med.id !== id);
      storage.updatePrescription(updated);
      return updated;
    });
  };

  const handleTagMedicine = (id: string, timing: 'pre' | 'post' | 'at') => {
    setCurrentPrescription(prev => {
      const updated = prev.map(med => (med.id === id ? { ...med, timing } : med));
      storage.updatePrescription(updated);
      return updated;
    });
  };

  const handleAddMedicine = (med: Medicine) => {
    const newMed = { ...med, id: Date.now().toString(), schedule: [] };
    setCurrentPrescription(prev => {
      const updated = [...prev, newMed];
      storage.updatePrescription(updated);
      return updated;
    });
  };

  const handleUpdateSchedule = (id: string, hour: number, days: string[], description?: string) => {
    // Update the medicine's master schedule
    setCurrentPrescription(prev => {
      const updated = prev.map(med => med.id === id ? { ...med, schedule: days } : med);
      storage.updatePrescription(updated);
      return updated;
    });

    // Update today's list if applicable
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = daysOfWeek[new Date().getDay()];
    
    if (days.includes(today)) {
      setTodayMedications(prev => {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        const timeStr = `${hour12}:00 ${ampm}`;
        
        const exists = prev.find(m => m.medicineId === id);
        let updated;
        if (exists) {
          updated = prev.map(m => m.medicineId === id ? { ...m, hour, time: timeStr, description } : m);
        } else {
          const med = currentPrescription.find(m => m.id === id);
          if (!med) return prev;
          updated = [...prev, {
            id: `today-${id}`,
            medicineId: id,
            name: med.name,
            dosage: med.dosage,
            time: timeStr,
            taken: false,
            hour,
            description
          }].sort((a, b) => a.hour - b.hour);
        }
        storage.updateTodayMedications(updated);
        return updated;
      });
    } else {
      setTodayMedications(prev => {
        const updated = prev.filter(m => m.medicineId !== id);
        storage.updateTodayMedications(updated);
        return updated;
      });
    }
  };

  const handleRevokeCaregiver = (id: string) => {
    setCaregivers(prev => {
      const updated = prev.filter(c => c.id !== id);
      storage.updateCaregivers(updated);
      return updated;
    });
  };

  const handleAddEvent = (event: Appointment) => {
    setAppointments(prev => {
      const updated = [...prev, event];
      storage.updateAppointments(updated);
      return updated;
    });
    toast.success('Event added to calendar');
  };

  // Update handlers for userData and appSettings
  const handleUpdateUserData = (newUserData: { name: string; profilePic: string | null }) => {
    setUserData(newUserData);
    storage.updateUserData(newUserData);
  };

  const handleUpdateAppSettings = (newSettings: Settings) => {
    setAppSettings(newSettings);
    storage.updateAppSettings(newSettings);
  };

  // Handle notification actions
  useEffect(() => {
    const handleNotificationAction = (event: CustomEvent) => {
      const { action, medication, caregiverUpdate } = event.detail;
      
      if (action === 'taken') {
        handleMarkTaken(medication.id);
        // Show forest growth animation or other feedback
        toast.success('Great job! Medication taken! 🌳');
      } else if (action === 'skip') {
        // Log for caregiver to see
        storage.addAdherenceRecord(
          new Date().toISOString().split('T')[0], 
          todayMedications.filter(m => m.taken).length, 
          todayMedications.length + 1
        );
        toast.info('Medication skipped for today');
      }

      // Add to caregiver updates
      if (caregiverUpdate) {
        setCaregiverUpdates(prev => [caregiverUpdate, ...prev].slice(0, 50)); // Keep last 50 updates
      }
    };

    const handleForestGrowth = () => {
      setShowForestGrowth(true);
      setTimeout(() => setShowForestGrowth(false), 3000);
    };

    window.addEventListener('medicationNotificationAction', handleNotificationAction as EventListener);
    window.addEventListener('showForestGrowth', handleForestGrowth);
    
    return () => {
      window.removeEventListener('medicationNotificationAction', handleNotificationAction as EventListener);
      window.removeEventListener('showForestGrowth', handleForestGrowth);
    };
  }, [todayMedications]);

  // Schedule notifications when today's medications change
  useEffect(() => {
    if (permissions.notifications && todayMedications.length > 0) {
      notificationService.scheduleNotifications(todayMedications);
    }

    return () => {
      notificationService.clearAllNotifications();
    };
  }, [todayMedications, permissions.notifications]);

  // Onboarding flow
  if (onboardingStep !== 'complete') {
    return (
      <div className="min-h-screen">
        {onboardingStep === 'welcome' && (
          <WelcomeScreen
            onGetStarted={() => setOnboardingStep('privacy')}
            onSkip={() => setOnboardingStep('complete')}
          />
        )}
        {onboardingStep === 'privacy' && (
          <PrivacyScreen
            onContinue={(perms) => {
              setPermissions(perms);
              setOnboardingStep('success');
            }}
          />
        )}
        {onboardingStep === 'success' && (
          <SuccessScreen
            userName={userData.name}
            onGoToHome={() => setOnboardingStep('complete')}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50" style={{ fontSize: `${appSettings.fontSize}px` }}>
      <Toaster position="top-center" richColors />
      
      {/* Forest Growth Animation */}
      <ForestGrowthAnimation 
        isVisible={showForestGrowth} 
        onComplete={() => setShowForestGrowth(false)} 
      />

      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HomeScreen
              userName={userData.name || 'Friend'}
              todayMedications={todayMedications}
              onNavigate={handleNavigate}
              onMarkTaken={handleMarkTaken}
              hasRefillAlert={currentPrescription.some(m => (m.stock || 0) <= 2)}
            />
          </motion.div>
        )}

        {currentScreen === 'prescription' && (
          <motion.div key="prescription" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
            <PrescriptionScreen
              onBack={() => setCurrentScreen('home')}
              currentPrescription={currentPrescription}
              onReplace={handleReplaceMedicine}
              onDiscard={handleDiscardMedicine}
              onTag={handleTagMedicine}
              onAddMedicine={handleAddMedicine}
              onRefillAlert={() => setCurrentScreen('pharmacist')}
            />
          </motion.div>
        )}

        {currentScreen === 'timetable' && (
          <motion.div key="timetable" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
            <TimeTableScreen
              onBack={() => setCurrentScreen('home')}
              medications={currentPrescription.map(m => ({ 
                id: m.id, 
                name: m.name, 
                dosage: m.dosage, 
                time: '08:00 AM', 
                hour: 8,
                schedule: m.schedule || []
              }))}
              onUpdateSchedule={handleUpdateSchedule}
            />
          </motion.div>
        )}

        {currentScreen === 'appointments' && (
          <motion.div key="appointments" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
            <AppointmentsScreen
              onBack={() => setCurrentScreen('home')}
              appointments={appointments}
              onAddEvent={handleAddEvent}
            />
          </motion.div>
        )}

        {currentScreen === 'pharmacist' && (
          <motion.div key="pharmacist" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
            <PharmacistChat
              onBack={() => setCurrentScreen('home')}
              currentMedications={currentPrescription}
            />
          </motion.div>
        )}

        {currentScreen === 'caregivers' && (
          <motion.div key="caregivers" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
            <MyCareGiverScreen
              onBack={() => setCurrentScreen('home')}
              caregivers={caregivers}
              onAddCaregiver={(email) => {}}
            />
          </motion.div>
        )}

        {currentScreen === 'caregiver-hub' && (
          <motion.div key="caregiver-hub" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
            <CareGiverHub
              onBack={() => setCurrentScreen('home')}
              onNavigate={handleNavigate}
            />
          </motion.div>
        )}

        {currentScreen === 'family-member-view' && selectedFamilyMember && (
          <motion.div key="family-member-view" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
            <FamilyMemberView
              member={selectedFamilyMember}
              onBack={() => {
                setCurrentScreen('caregiver-hub');
                setSelectedFamilyMember(null);
              }}
              onNavigate={(screen) => setCurrentScreen(screen as Screen)}
            />
          </motion.div>
        )}

        {currentScreen === 'analyticals' && (
          <motion.div key="analyticals" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
            <AnaliticalsScreen
              onBack={() => setCurrentScreen('home')}
              adherenceRate={94}
              missedDoses={2}
              medicationAdherence={[]}
              forestTrees={15}
            />
          </motion.div>
        )}

        {currentScreen === 'caregiver-permission' && (
          <motion.div key="caregiver-permission" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
            <CareGiverPermissionScreen
              onBack={() => setCurrentScreen('home')}
              onInvite={() => {}}
            />
          </motion.div>
        )}

        {currentScreen === 'settings' && (
          <motion.div key="settings" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
            <SettingsScreen
              onBack={() => setCurrentScreen('home')}
              settings={appSettings}
              onUpdateSettings={setAppSettings}
            />
          </motion.div>
        )}

        {currentScreen === 'revoke-access' && (
          <motion.div key="revoke-access" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
            <RevokeAccessScreen
              onBack={() => setCurrentScreen('home')}
              caregivers={caregivers}
              onRevoke={handleRevokeCaregiver}
            />
          </motion.div>
        )}

        {currentScreen === 'help-center' && (
          <motion.div key="help-center" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
            <HelpCenterScreen onBack={() => setCurrentScreen('home')} />
          </motion.div>
        )}

        {currentScreen === 'contact-support' && (
          <motion.div key="contact-support" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}>
            <ContactSupportScreen onBack={() => setCurrentScreen('home')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;