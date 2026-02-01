import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Pill, Stethoscope, BarChart3, Clock, Wind, Sun, CloudRain, Trees, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FamilyMember, WEATHER_TIPS } from '@/app/data/caregiver';
import { Forest } from './ui/TreeIcon';

interface FamilyMemberViewProps {
  member: FamilyMember;
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export function FamilyMemberView({ member, onBack, onNavigate }: FamilyMemberViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'prescription' | 'timeline' | 'appointments' | 'pharmacist' | 'analytics'>('overview');
  const [currentWeather, setCurrentWeather] = useState('sunny');
  const [medications, setMedications] = useState([
    { id: '1', name: 'Aspirin', dosage: '75mg', time: '8:00 AM', adherence: 90 },
    { id: '2', name: 'Lisinopril', dosage: '10mg', time: '9:00 AM', adherence: 85 },
    { id: '3', name: 'Metformin', dosage: '500mg', time: '6:00 PM', adherence: 80 }
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Trees },
    { id: 'prescription', label: 'Prescription', icon: Pill },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'pharmacist', label: 'Pharmacist', icon: Stethoscope },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const getWeatherIcon = () => {
    switch (currentWeather) {
      case 'sunny': return Sun;
      case 'rainy': return CloudRain;
      default: return Wind;
    }
  };

  const getWeatherTip = () => {
    return WEATHER_TIPS[Math.floor(Math.random() * WEATHER_TIPS.length)];
  };

  const WeatherIcon = getWeatherIcon();

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header with Member Info */}
      <div className={`bg-gradient-to-r ${
        member.relationship === 'mom' ? 'from-pink-500 to-rose-600' :
        member.relationship === 'dad' ? 'from-blue-500 to-indigo-600' :
        'from-healing-sage-500 to-teal-600'
      } text-white p-6 sticky top-0 z-50 shadow-md`}>
        <button onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg">Back</span>
        </button>
        
        <div className="text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 text-4xl">
            {member.avatar}
          </div>
          <h1 className="text-3xl font-bold mb-1">{member.name}'s Health</h1>
          <p className="text-white/80">Adherence Rate: {member.adherenceRate}%</p>
        </div>
      </div>

      {/* Weather Health Tip */}
      <div className="p-6 pb-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <WeatherIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 text-sm">Health Tip for {member.name}</h3>
              <p className="text-blue-700 text-xs mt-1">{getWeatherTip().tip}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm p-1 flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-healing-sage-500 text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Forest Visualization */}
              <div className="bg-gradient-to-b from-green-50 to-emerald-50 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-neutral-800 mb-4 flex items-center gap-2">
                  <Trees className="w-5 h-5 text-green-600" />
                  Health Forest
                </h3>
                <Forest 
                  trees={medications.map(med => ({ 
                    name: med.name, 
                    adherence: med.adherence 
                  }))} 
                  className="py-4"
                />
                <p className="text-sm text-center text-neutral-600 mt-4">
                  {member.adherenceRate >= 90 ? 'Excellent adherence! Forest is thriving! 🌳' :
                   member.adherenceRate >= 70 ? 'Good progress! Keep up the consistency! 🌲' :
                   'Forest needs care. More consistency will help it grow! 🌱'}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-sm text-neutral-600">Today's Progress</p>
                  <p className="text-2xl font-bold text-healing-sage-600">2/3</p>
                  <p className="text-xs text-neutral-500">Medications taken</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-sm text-neutral-600">Week Streak</p>
                  <p className="text-2xl font-bold text-orange-600">5 days</p>
                  <p className="text-xs text-neutral-500">Consistent adherence</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h4 className="font-bold text-neutral-800 mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b border-neutral-50">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✅</span>
                      <span className="text-sm">Aspirin taken</span>
                    </div>
                    <span className="text-xs text-neutral-500">8:30 AM</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-neutral-50">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✅</span>
                      <span className="text-sm">Lisinopril taken</span>
                    </div>
                    <span className="text-xs text-neutral-500">9:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">❌</span>
                      <span className="text-sm">Metformin missed</span>
                    </div>
                    <span className="text-xs text-neutral-500">6:00 PM</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'prescription' && (
            <motion.div key="prescription" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-xl font-bold text-neutral-800 mb-4">Current Prescriptions</h3>
              <div className="space-y-4">
                {medications.map((med) => (
                  <div key={med.id} className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-neutral-800">{med.name}</h4>
                        <p className="text-neutral-600">{med.dosage}</p>
                        <p className="text-sm text-healing-sage-600">🕐 {med.time}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-healing-sage-600">{med.adherence}%</div>
                        <div className="text-xs text-neutral-500">adherence</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-xl font-bold text-neutral-800 mb-4">Medication Timeline</h3>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-center text-neutral-500 py-8">Timeline view coming soon...</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div key="appointments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-xl font-bold text-neutral-800 mb-4">Appointments</h3>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-center text-neutral-500 py-8">No upcoming appointments</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'pharmacist' && (
            <motion.div key="pharmacist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-xl font-bold text-neutral-800 mb-4">Pharmacist Chat</h3>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-center text-neutral-500 py-8">Chat interface coming soon...</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-xl font-bold text-neutral-800 mb-4">Analytics (No Forest)</h3>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-center text-neutral-500 py-8">Analytics dashboard coming soon...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}