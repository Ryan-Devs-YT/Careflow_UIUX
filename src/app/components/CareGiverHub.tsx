import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Cloud, Heart, Calendar, Clock, ChevronRight, Plus, MessageCircle, BarChart3, Pill, Stethoscope, AlertCircle, Trees, Wind, Sun, CloudRain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FamilyMember, CareUpdate, DEFAULT_FAMILY_MEMBERS, WEATHER_TIPS } from '@/app/data/caregiver';
import { Forest } from './ui/TreeIcon';

interface CareGiverHubProps {
  onBack: () => void;
  onNavigate: (screen: string, memberId?: string) => void;
}

export function CareGiverHub({ onBack, onNavigate }: CareGiverHubProps) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(DEFAULT_FAMILY_MEMBERS);
  const [currentUpdates, setCurrentUpdates] = useState<CareUpdate[]>([]);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [currentWeather, setCurrentWeather] = useState('sunny');

  // Simulate current updates (in real app, this would come from backend)
  useEffect(() => {
    const mockUpdates: CareUpdate[] = [
      {
        id: '1',
        memberId: 'mom',
        type: 'taken',
        medication: 'Aspirin',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        message: 'Mom took Aspirin at 8:30 AM'
      },
      {
        id: '2',
        memberId: 'dad',
        type: 'skipped',
        medication: 'Lisinopril',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        message: 'Dad skipped 6:00 PM Lisinopril dose'
      }
    ];
    setCurrentUpdates(mockUpdates);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return Sun;
      case 'cloudy': return Cloud;
      case 'rainy': return CloudRain;
      default: return Wind;
    }
  };

  const getWeatherTip = () => {
    const tip = WEATHER_TIPS[Math.floor(Math.random() * WEATHER_TIPS.length)];
    return tip;
  };

  const handleMemberClick = (member: FamilyMember) => {
    setSelectedMember(member);
    // Navigate to member's detailed view
    onNavigate('family-member-view', member.id);
  };

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'mom': return 'bg-pink-100 text-pink-700';
      case 'dad': return 'bg-blue-100 text-blue-700';
      case 'spouse': return 'bg-purple-100 text-purple-700';
      case 'child': return 'bg-green-100 text-green-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-healing-sage-500 to-teal-600 text-white p-6 sticky top-0 z-50 shadow-md">
        <button onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg">Back</span>
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-1">Care Giver Hub</h1>
          <p className="text-healing-sage-100">Manage your family's health</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Weather Health Tips */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              {(() => {
                const WeatherIcon = getWeatherIcon(currentWeather);
                return <WeatherIcon className="w-6 h-6 text-blue-600" />;
              })()}
            </div>
            <div>
              <h3 className="font-bold text-blue-900">Today's Health Tip</h3>
              <p className="text-blue-700 text-sm">Weather-related care advice</p>
            </div>
          </div>
          <p className="text-blue-800 text-sm leading-relaxed">
            {getWeatherTip().tip}
          </p>
        </motion.div>

        {/* Manage Profiles Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-neutral-700">Manage Profiles</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-healing-sage-500 text-white rounded-xl font-bold text-sm shadow-sm">
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {familyMembers.map((member) => (
              <motion.button
                key={member.id}
                onClick={() => handleMemberClick(member)}
                className="bg-white rounded-2xl shadow-md p-5 border border-neutral-100 hover:shadow-lg transition-all text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-healing-sage-100 to-teal-100 rounded-full flex items-center justify-center text-3xl shadow-sm">
                      {member.avatar}
                    </div>
                    
                    {/* Member Info */}
                    <div>
                      <h3 className="font-bold text-neutral-800 text-xl flex items-center gap-2">
                        {member.name}
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRelationshipColor(member.relationship)}`}>
                          {member.relationship.charAt(0).toUpperCase() + member.relationship.slice(1)}
                        </span>
                      </h3>
                      <p className="text-neutral-600 text-sm">
                        Adherence: <span className="font-bold text-healing-sage-600">{member.adherenceRate}%</span>
                      </p>
                      {member.lastMedicationTaken && (
                        <p className="text-xs text-success-dark mt-1">
                          ✓ {member.lastMedicationTaken}
                        </p>
                      )}
                      {member.lastMedicationSkipped && (
                        <p className="text-xs text-error-main mt-1">
                          ✗ {member.lastMedicationSkipped}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Forest Preview */}
                  <div className="text-right">
                    <div className="mb-2">
                      <Forest 
                        trees={[
                          { name: 'Health', adherence: member.adherenceRate }
                        ]} 
                        className="scale-50 origin-right"
                      />
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-400" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Current Updates Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-700">Current Updates</h2>
            {currentUpdates.length > 0 && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {currentUpdates.length}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {currentUpdates.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-neutral-100">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-8 h-8 text-neutral-400" />
                </div>
                <p className="text-neutral-500">No recent updates</p>
                <p className="text-sm text-neutral-400 mt-1">Family member activities will appear here</p>
              </div>
            ) : (
              currentUpdates.map((update) => {
                const member = familyMembers.find(m => m.id === update.memberId);
                const getUpdateIcon = () => {
                  switch (update.type) {
                    case 'taken': return '✅';
                    case 'skipped': return '❌';
                    case 'refill': return '🔄';
                    default: return '📅';
                  }
                };

                return (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-healing-sage-500"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getUpdateIcon()}</span>
                        <div>
                          <p className="font-medium text-neutral-800">{update.message}</p>
                          <p className="text-xs text-neutral-500">
                            {update.timestamp.toLocaleTimeString()} • {member?.name}
                          </p>
                        </div>
                      </div>
                      <AlertCircle className="w-4 h-4 text-neutral-400" />
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-bold text-neutral-700 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all text-left">
              <MessageCircle className="w-6 h-6 text-healing-sage-600 mb-2" />
              <p className="font-medium text-neutral-800">Send Reminder</p>
              <p className="text-xs text-neutral-500">Nudge family members</p>
            </button>
            <button className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all text-left">
              <Calendar className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-neutral-800">Schedule Visit</p>
              <p className="text-xs text-neutral-500">Book appointments</p>
            </button>
            <button className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all text-left">
              <Pill className="w-6 h-6 text-purple-600 mb-2" />
              <p className="font-medium text-neutral-800">Refill Request</p>
              <p className="text-xs text-neutral-500">Order medications</p>
            </button>
            <button className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all text-left">
              <BarChart3 className="w-6 h-6 text-orange-600 mb-2" />
              <p className="font-medium text-neutral-800">View Reports</p>
              <p className="text-xs text-neutral-500">Health analytics</p>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}