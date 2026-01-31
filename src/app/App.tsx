import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast, Toaster } from 'sonner';

// Onboarding components
import { WelcomeScreen } from '@/app/components/onboarding/WelcomeScreen';
import { InterfaceSelectionScreen, InterfaceMode } from '@/app/components/onboarding/InterfaceSelectionScreen';
import { PrivacyScreen, PermissionSettings } from '@/app/components/onboarding/PrivacyScreen';
import { QuickSetupScreen, SetupData } from '@/app/components/onboarding/QuickSetupScreen';
import { SuccessScreen } from '@/app/components/onboarding/SuccessScreen';

// Main screens
import { HomeScreen } from '@/app/components/HomeScreen';
import { PrescriptionScreen } from '@/app/components/PrescriptionScreen';
import { TimeTableScreen } from '@/app/components/TimeTableScreen';
import { AppointmentsScreen } from '@/app/components/AppointmentsScreen';
import { PharmacistChat } from '@/app/components/PharmacistChat';
import { MyCareGiverScreen } from '@/app/components/MyCareGiverScreen';
import { AnaliticalsScreen } from '@/app/components/AnaliticalsScreen';
import { CareGiverPermissionScreen } from '@/app/components/CareGiverPermissionScreen';
import { SettingsScreen } from '@/app/components/SettingsScreen';
import { RevokeAccessScreen } from '@/app/components/RevokeAccessScreen';
import { HelpCenterScreen } from '@/app/components/HelpCenterScreen';
import { ContactSupportScreen } from '@/app/components/ContactSupportScreen';

type OnboardingStep = 'welcome' | 'interface' | 'privacy' | 'setup' | 'success' | 'complete';
type Screen = 'home' | 'prescription' | 'timetable' | 'appointments' | 'pharmacist' | 'caregivers' | 'analyticals' | 'caregiver-permission' | 'settings' | 'revoke-access' | 'help-center' | 'contact-support';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  timing: 'pre' | 'post' | 'at' | null;
  description: string;
  usage: string;
  stock?: number;
  interactions?: string[];
}

interface TodayMedication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  hour: number;
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

interface Appointment {
  id: string;
  type: 'doctor' | 'refill' | 'test';
  title: string;
  date: Date;
  time: string;
  location?: string;
  doctor?: string;
}

interface Settings {
  fontSize: number;
}

function App() {
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('welcome');
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [interfaceMode, setInterfaceMode] = useState<InterfaceMode>('simplified');
  const [permissions, setPermissions] = useState<PermissionSettings>({
    notifications: true,
    camera: true,
    location: false,
  });
  const [userData, setUserData] = useState<SetupData>({ name: '' });
  
  // App Settings State
  const [appSettings, setAppSettings] = useState<Settings>({ fontSize: 16 });

  // Current prescription data
  const [currentPrescription, setCurrentPrescription] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Metformin',
      dosage: '500mg tablet',
      timing: 'post',
      description: 'Helps control blood sugar levels in type 2 diabetes',
      usage: 'Take twice daily with meals to manage blood glucose',
      stock: 10,
      interactions: ['Alcohol', 'Iodinated contrast'],
    },
    {
      id: '2',
      name: 'Lisinopril',
      dosage: '10mg tablet',
      timing: 'at',
      description: 'ACE inhibitor for blood pressure',
      usage: 'Helps lower blood pressure and reduce risk of stroke',
      stock: 2,
      interactions: ['Potassium supplements', 'NSAIDs'],
    },
    {
      id: '3',
      name: 'Atorvastatin',
      dosage: '20mg tablet',
      timing: 'pre',
      description: 'Statin medication for cholesterol',
      usage: 'Reduces cholesterol levels and prevents heart disease',
      stock: 15,
      interactions: ['Grapefruit juice', 'Certain antibiotics'],
    },
  ]);

  // Today's medications with time tracking
  const [todayMedications, setTodayMedications] = useState<TodayMedication[]>([
    { id: '1', name: 'Metformin', dosage: '500mg', time: '8:00 AM', taken: false, hour: 8 },
    { id: '2', name: 'Lisinopril', dosage: '10mg', time: '8:30 AM', taken: false, hour: 8 },
    { id: '3', name: 'Metformin', dosage: '500mg', time: '8:00 PM', taken: false, hour: 20 },
    { id: '4', name: 'Atorvastatin', dosage: '20mg', time: '8:00 PM', taken: false, hour: 20 },
  ]);

  // Caregivers data
  const [caregivers, setCaregivers] = useState<CareGiver[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Daughter',
      phone: '+1 (555) 123-4567',
      email: 'sarah.j@email.com',
      avatar: '👧',
      status: 'active',
    },
    {
      id: '2',
      name: 'Michael Johnson',
      relationship: 'Son',
      phone: '+1 (555) 987-6543',
      email: 'michael.j@email.com',
      avatar: '👦',
      status: 'active',
    },
    {
      id: '3',
      name: 'Emily Wilson',
      relationship: 'Guardian',
      phone: '+1 (555) 456-7890',
      email: 'emily.w@email.com',
      avatar: '👩',
      status: 'pending',
    },
  ]);

  // Appointments data
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      type: 'doctor',
      title: 'Dr. Sarah Johnson - Regular Checkup',
      date: new Date(2026, 1, 5), // Feb 5, 2026
      time: '10:00 AM',
      location: 'Main Street Medical Center',
      doctor: 'Dr. Sarah Johnson',
    },
    {
      id: '2',
      type: 'refill',
      title: 'Pharmacy Refill Due',
      date: new Date(2026, 1, 8), // Feb 8, 2026
      time: '2:00 PM',
    },
    {
      id: '3',
      type: 'test',
      title: 'Blood Test - Glucose & Cholesterol',
      date: new Date(2026, 1, 12), // Feb 12, 2026
      time: '8:00 AM',
      location: 'Community Lab',
    },
  ]);

  // Analytics data
  const medicationAdherence = [
    { name: 'Metformin', adherence: 95 },
    { name: 'Lisinopril', adherence: 100 },
    { name: 'Atorvastatin', adherence: 88 },
  ];

  const adherenceRate = 94;
  const missedDoses = 2;
  const forestTrees = 15;

  // Handlers
  const handleMarkTaken = (id: string) => {
    setTodayMedications(meds =>
      meds.map(med =>
        med.id === id ? { ...med, taken: true } : med
      )
    );
    toast.success('Medication marked as taken! 🌱', {
      description: 'Your forest is growing!',
    });
  };

  const handleNavigate = (section: string) => {
    setCurrentScreen(section as Screen);
  };

  const handleReplaceMedicine = (oldId: string, newMed: Medicine) => {
    setCurrentPrescription(prev => 
      prev.map(med => med.id === oldId ? { ...newMed, id: oldId, timing: med.timing, stock: 10 } : med)
    );
    toast.success('Medication replaced successfully');
  };

  const handleDiscardMedicine = (id: string) => {
    setCurrentPrescription(prev => prev.filter(med => med.id !== id));
  };

  const handleTagMedicine = (id: string, timing: 'pre' | 'post' | 'at') => {
    setCurrentPrescription(prev =>
      prev.map(med => (med.id === id ? { ...med, timing } : med))
    );
    toast.success('Meal timing updated');
  };

  const handleAddMedicine = (med: Medicine) => {
    const newMed = { ...med, id: Date.now().toString(), stock: 10 };
    setCurrentPrescription(prev => [...prev, newMed]);
    toast.success(`${med.name} added to prescription`);
  };

  const handleRefillAlert = () => {
    setCurrentScreen('pharmacist');
  };

  const handleUpdateSchedule = (id: string, time: string, days: string[]) => {
    console.log('Update schedule:', id, time, days);
    toast.success('Schedule updated');
  };

  const handleAddCaregiver = (email: string) => {
    const newCaregiver: CareGiver = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      relationship: 'Pending',
      phone: 'Pending',
      email,
      status: 'pending',
    };
    setCaregivers([...caregivers, newCaregiver]);
  };

  const handleInviteCaregiver = (caregiver: any) => {
      const newCaregiver: CareGiver = {
        id: caregiver.id,
        name: caregiver.name,
        relationship: 'Friend', 
        phone: 'Pending',
        email: caregiver.email,
        avatar: caregiver.avatar,
        status: 'pending',
      };
      if (!caregivers.find(c => c.email === newCaregiver.email)) {
          setCaregivers(prev => [...prev, newCaregiver]);
          toast.success(`${caregiver.name} added to CareGivers!`);
      } else {
          toast.info(`${caregiver.name} is already in your list.`);
      }
  };

  const handleRevokeCaregiver = (id: string) => {
    setCaregivers(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateSettings = (newSettings: Settings) => {
    setAppSettings(newSettings);
  };

  // Onboarding flow
  if (onboardingStep !== 'complete') {
    return (
      <div className="min-h-screen">
        {onboardingStep === 'welcome' && (
          <WelcomeScreen
            onGetStarted={() => setOnboardingStep('interface')}
            onSkip={() => setOnboardingStep('complete')}
          />
        )}
        {onboardingStep === 'interface' && (
          <InterfaceSelectionScreen
            onContinue={(mode) => {
              setInterfaceMode(mode === 'smart' ? 'simplified' : mode);
              setOnboardingStep('privacy');
            }}
          />
        )}
        {onboardingStep === 'privacy' && (
          <PrivacyScreen
            onContinue={(perms) => {
              setPermissions(perms);
              setOnboardingStep('setup');
            }}
          />
        )}
        {onboardingStep === 'setup' && (
          <QuickSetupScreen
            onContinue={(data) => {
              setUserData(data);
              setOnboardingStep('success');
            }}
            onSkip={() => setOnboardingStep('success')}
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

  // Main app
  return (
    <div className="min-h-screen bg-neutral-50" style={{ fontSize: `${appSettings.fontSize}px` }}>
      <Toaster position="top-center" richColors />

      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HomeScreen
              userName={userData.name || 'Friend'}
              todayMedications={todayMedications}
              onNavigate={handleNavigate}
              onMarkTaken={handleMarkTaken}
              hasRefillAlert={todayMedications.some(m => !m.taken)}
            />
          </motion.div>
        )}

        {currentScreen === 'prescription' && (
          <motion.div
            key="prescription"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <PrescriptionScreen
              onBack={() => setCurrentScreen('home')}
              currentPrescription={currentPrescription}
              onReplace={handleReplaceMedicine}
              onDiscard={handleDiscardMedicine}
              onTag={handleTagMedicine}
              onAddMedicine={handleAddMedicine}
              onRefillAlert={handleRefillAlert}
            />
          </motion.div>
        )}

        {currentScreen === 'timetable' && (
          <motion.div
            key="timetable"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <TimeTableScreen
              onBack={() => setCurrentScreen('home')}
              medications={todayMedications}
              onUpdateSchedule={handleUpdateSchedule}
            />
          </motion.div>
        )}

        {currentScreen === 'appointments' && (
          <motion.div
            key="appointments"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <AppointmentsScreen
              onBack={() => setCurrentScreen('home')}
              appointments={appointments}
            />
          </motion.div>
        )}

        {currentScreen === 'pharmacist' && (
          <motion.div
            key="pharmacist"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <PharmacistChat
              onBack={() => setCurrentScreen('home')}
              currentMedications={currentPrescription}
            />
          </motion.div>
        )}

        {currentScreen === 'caregivers' && (
          <motion.div
            key="caregivers"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <MyCareGiverScreen
              onBack={() => setCurrentScreen('home')}
              caregivers={caregivers}
              onAddCaregiver={handleAddCaregiver}
            />
          </motion.div>
        )}

        {currentScreen === 'analyticals' && (
          <motion.div
            key="analyticals"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <AnaliticalsScreen
              onBack={() => setCurrentScreen('home')}
              adherenceRate={adherenceRate}
              missedDoses={missedDoses}
              medicationAdherence={medicationAdherence}
              forestTrees={forestTrees}
            />
          </motion.div>
        )}

        {currentScreen === 'caregiver-permission' && (
          <motion.div
            key="caregiver-permission"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <CareGiverPermissionScreen
              onBack={() => setCurrentScreen('home')}
              onInvite={handleInviteCaregiver}
            />
          </motion.div>
        )}

        {currentScreen === 'settings' && (
          <motion.div
            key="settings"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <SettingsScreen
              onBack={() => setCurrentScreen('home')}
              settings={appSettings}
              onUpdateSettings={handleUpdateSettings}
            />
          </motion.div>
        )}

        {currentScreen === 'revoke-access' && (
          <motion.div
            key="revoke-access"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <RevokeAccessScreen
              onBack={() => setCurrentScreen('home')}
              caregivers={caregivers}
              onRevoke={handleRevokeCaregiver}
            />
          </motion.div>
        )}

        {currentScreen === 'help-center' && (
          <motion.div
            key="help-center"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <HelpCenterScreen
              onBack={() => setCurrentScreen('home')}
            />
          </motion.div>
        )}

        {currentScreen === 'contact-support' && (
          <motion.div
            key="contact-support"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <ContactSupportScreen
              onBack={() => setCurrentScreen('home')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
