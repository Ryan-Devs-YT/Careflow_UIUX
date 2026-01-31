import { motion } from 'motion/react';
import { MedicationCard, MedicationStatus } from '@/app/components/MedicationCard';
import { HealthGarden } from '@/app/components/HealthGarden';
import { Sun, Moon, Cloud, HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  photo?: string;
  status: MedicationStatus;
  timeGroup: 'morning' | 'afternoon' | 'evening';
}

interface SimplifiedDashboardProps {
  userName?: string;
  medications: Medication[];
  onMarkTaken: (id: string) => void;
  onMedicationClick: (id: string) => void;
  onHelpClick: () => void;
  onGardenClick: () => void;
}

export function SimplifiedDashboard({
  userName = 'Friend',
  medications,
  onMarkTaken,
  onMedicationClick,
  onHelpClick,
  onGardenClick,
}: SimplifiedDashboardProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>('morning');

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  
  const greetingIcon =
    currentHour < 12 ? <Sun className="w-8 h-8" /> : 
    currentHour < 18 ? <Cloud className="w-8 h-8" /> : 
    <Moon className="w-8 h-8" />;

  const timeGroups = [
    { id: 'morning', label: 'Morning Medications', time: '8:00 AM', icon: <Sun className="w-8 h-8" /> },
    { id: 'afternoon', label: 'Afternoon Medications', time: '2:00 PM', icon: <Cloud className="w-8 h-8" /> },
    { id: 'evening', label: 'Evening Medications', time: '8:00 PM', icon: <Moon className="w-8 h-8" /> },
  ];

  const getMedicationsByGroup = (group: string) => {
    return medications.filter((med) => med.timeGroup === group);
  };

  const getTakenCount = (group: string) => {
    const groupMeds = getMedicationsByGroup(group);
    return groupMeds.filter((med) => med.status === 'taken').length;
  };

  const getNextMedication = () => {
    const upcoming = medications.find(
      (med) => med.status === 'upcoming' || med.status === 'time-to-take'
    );
    return upcoming;
  };

  const nextMed = getNextMedication();

  // Sample plants for the garden
  const gardenPlants = [
    { id: '1', type: 'flower' as const, earned: true, milestone: 'First week complete', position: { x: 20, y: 35 } },
    { id: '2', type: 'tree' as const, earned: true, milestone: '30 days streak', position: { x: 50, y: 40 } },
    { id: '3', type: 'flower' as const, earned: true, milestone: 'Never missed', position: { x: 75, y: 32 } },
    { id: '4', type: 'bush' as const, earned: false, milestone: '90 days streak', position: { x: 35, y: 30 } },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header with Greeting */}
      <motion.div
        className="bg-gradient-to-br from-healing-sage-500 to-healing-sage-600 text-white p-6 rounded-b-[32px] shadow-lg mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {greetingIcon}
            <div>
              <h1 className="text-2xl font-bold">{greeting}!</h1>
              <p className="text-healing-sage-100 text-lg">{userName}</p>
            </div>
          </div>
          <button
            onClick={onHelpClick}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>
        
        {/* Quick Stats */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success-light" />
            <span className="text-healing-sage-100">
              {medications.filter((m) => m.status === 'taken').length} taken today
            </span>
          </div>
        </div>
      </motion.div>

      <div className="px-6 space-y-6">
        {/* Next Medication Countdown */}
        {nextMed && (
          <motion.div
            className="bg-gradient-to-r from-warm-comfort-100 to-warm-comfort-200 p-5 rounded-[20px] border-2 border-warm-comfort-400"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-warm-comfort-400 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-neutral-600 font-medium">Up Next</p>
                <p className="text-lg font-bold text-neutral-700">{nextMed.name}</p>
              </div>
            </div>
            <p className="text-neutral-600">
              {nextMed.time} • {nextMed.dosage}
            </p>
          </motion.div>
        )}

        {/* Today's Medications by Time Group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-neutral-700 mb-4">
            Today's Medications
          </h2>

          <div className="space-y-4">
            {timeGroups.map((group, index) => {
              const groupMeds = getMedicationsByGroup(group.id);
              if (groupMeds.length === 0) return null;

              const takenCount = getTakenCount(group.id);
              const isExpanded = expandedGroup === group.id;

              return (
                <motion.div
                  key={group.id}
                  className="bg-white rounded-[20px] shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {/* Group Header */}
                  <button
                    onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                    className="w-full p-5 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-healing-sage-600">{group.icon}</div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-neutral-700">
                          {group.label}
                        </h3>
                        <p className="text-sm text-neutral-500">{group.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-neutral-600">
                        {takenCount}/{groupMeds.length} taken
                      </span>
                      <motion.svg
                        className="w-6 h-6 text-neutral-400"
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </div>
                  </button>

                  {/* Medications List */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isExpanded ? 'auto' : 0,
                      opacity: isExpanded ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 space-y-3">
                      {groupMeds.map((med) => (
                        <MedicationCard
                          key={med.id}
                          {...med}
                          mode="simplified"
                          onMarkTaken={onMarkTaken}
                          onCardClick={onMedicationClick}
                        />
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Health Garden Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-700">Your Health Garden</h2>
            <button
              onClick={onGardenClick}
              className="text-sm font-medium text-healing-sage-600 hover:text-healing-sage-700"
            >
              View full garden
            </button>
          </div>
          
          <div
            onClick={onGardenClick}
            className="cursor-pointer hover:shadow-xl transition-shadow duration-200"
          >
            <HealthGarden plants={gardenPlants} daysStreak={7} mini />
          </div>
          
          <p className="text-center text-sm text-neutral-600 mt-3">
            Keep taking your medications to grow your garden! 🌱
          </p>
        </motion.div>
      </div>
    </div>
  );
}
