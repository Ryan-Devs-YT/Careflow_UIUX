import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Cloud, Heart, Calendar, Clock, ChevronRight, Plus, MessageCircle, BarChart3, Pill, Stethoscope, AlertCircle, Trees, Wind, Sun, CloudRain, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { FamilyMember, CareUpdate, DEFAULT_FAMILY_MEMBERS, WEATHER_TIPS } from '@/app/data/caregiver';
import { Forest } from './ui/TreeIcon';
import { notificationService } from '@/app/services/notifications';
import { MEDICINE_DATABASE } from '@/app/data/medicines';

import { Appointment } from '@/app/App';

interface CareGiverHubProps {
  onBack: () => void;
  onNavigate: (screen: string, memberId?: string) => void;
  onAddAppointment: (appointment: Appointment) => void;
  currentUser: string;
}

export function CareGiverHub({ onBack, onNavigate, onAddAppointment, currentUser }: CareGiverHubProps) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(DEFAULT_FAMILY_MEMBERS);
  const [currentUpdates, setCurrentUpdates] = useState<CareUpdate[]>([]);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [currentWeather, setCurrentWeather] = useState('sunny');
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [selectedReminderMember, setSelectedReminderMember] = useState<string | null>(null);
  const [sendingReminder, setSendingReminder] = useState(false);

  // Schedule Visit state
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [schedulingVisit, setSchedulingVisit] = useState(false);
  const [visitForm, setVisitForm] = useState({
    forProfile: 'self',
    type: 'doctor' as 'doctor' | 'test' | 'custom',
    date: '',
    time: '',
    doctorLocation: '',
    description: ''
  });

  // Refill Request state
  const [showRefillDialog, setShowRefillDialog] = useState(false);
  const [submittingRefill, setSubmittingRefill] = useState(false);
  const [refillForm, setRefillForm] = useState({
    forProfile: 'self',
    medicineId: '',
    medicineName: '',
    dosage: '',
    date: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // View Reports state
  const [showReportsDialog, setShowReportsDialog] = useState(false);
  const [selectedReportProfile, setSelectedReportProfile] = useState<string>('self');

  // Mock analytics data
  const getAnalyticsData = (profileId: string) => {
    const analyticsMap: Record<string, any> = {
      'self': {
        profileName: currentUser,
        adherenceRate: 92,
        weeklyAdherence: [100, 100, 85, 100, 100, 71, 100],
        currentMedications: [
          { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily' },
          { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' }
        ],
        recentActivity: [
          { medication: 'Aspirin 75mg', status: 'taken' as const, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
          { medication: 'Lisinopril 10mg', status: 'taken' as const, timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000) },
          { medication: 'Aspirin 75mg', status: 'taken' as const, timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000) },
          { medication: 'Lisinopril 10mg', status: 'skipped' as const, timestamp: new Date(Date.now() - 38 * 60 * 60 * 1000) },
          { medication: 'Aspirin 75mg', status: 'taken' as const, timestamp: new Date(Date.now() - 50 * 60 * 60 * 1000) }
        ],
        statistics: {
          totalDoses: 156,
          missedDoses: 12,
          currentStreak: 7
        }
      },
      'mom': {
        profileName: 'Mom',
        adherenceRate: 88,
        weeklyAdherence: [100, 71, 100, 100, 85, 100, 100],
        currentMedications: [
          { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
          { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily' }
        ],
        recentActivity: [
          { medication: 'Metformin 500mg', status: 'taken' as const, timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
          { medication: 'Atorvastatin 20mg', status: 'taken' as const, timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000) },
          { medication: 'Metformin 500mg', status: 'taken' as const, timestamp: new Date(Date.now() - 27 * 60 * 60 * 1000) },
          { medication: 'Metformin 500mg', status: 'skipped' as const, timestamp: new Date(Date.now() - 39 * 60 * 60 * 1000) },
          { medication: 'Atorvastatin 20mg', status: 'taken' as const, timestamp: new Date(Date.now() - 51 * 60 * 60 * 1000) }
        ],
        statistics: {
          totalDoses: 142,
          missedDoses: 17,
          currentStreak: 5
        }
      },
      'dad': {
        profileName: 'Dad',
        adherenceRate: 75,
        weeklyAdherence: [71, 100, 57, 100, 71, 100, 85],
        currentMedications: [
          { name: 'Warfarin', dosage: '5mg', frequency: 'Once daily' },
          { name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily' }
        ],
        recentActivity: [
          { medication: 'Warfarin 5mg', status: 'taken' as const, timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) },
          { medication: 'Omeprazole 20mg', status: 'skipped' as const, timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000) },
          { medication: 'Warfarin 5mg', status: 'taken' as const, timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000) },
          { medication: 'Omeprazole 20mg', status: 'taken' as const, timestamp: new Date(Date.now() - 40 * 60 * 60 * 1000) },
          { medication: 'Warfarin 5mg', status: 'skipped' as const, timestamp: new Date(Date.now() - 52 * 60 * 60 * 1000) }
        ],
        statistics: {
          totalDoses: 98,
          missedDoses: 24,
          currentStreak: 3
        }
      }
    };

    return analyticsMap[profileId] || analyticsMap['self'];
  };

  // Simulate current updates (in real app, this would come from backend)
  useEffect(() => {
    // Add user's own profile to the beginning of family members list
    const userProfile: FamilyMember = {
      id: 'self',
      name: currentUser,
      relationship: 'self',
      avatar: '👤',
      adherenceRate: 92,
      lastMedicationTaken: '2 hours ago - Aspirin',
      weatherLocation: 'Current Location',
      prescriptionIds: ['med5', 'med6'],
      notifications: true
    };

    // Prepend user profile to family members
    setFamilyMembers([userProfile, ...DEFAULT_FAMILY_MEMBERS]);

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
  }, [currentUser]);

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

  const handleSendReminder = async () => {
    if (!selectedReminderMember) {
      toast.error('Please select a family member');
      return;
    }

    setSendingReminder(true);
    try {
      const member = familyMembers.find(m => m.id === selectedReminderMember);
      if (!member) return;

      // Check if notifications are enabled
      if (!notificationService.isEnabled()) {
        // Request permission first
        const granted = await notificationService.requestPermission();
        if (!granted) {
          toast.error('Please enable notifications to send reminders');
          setSendingReminder(false);
          return;
        }
      }

      // Send notification using the notification service
      notificationService.sendCaregiverReminder({
        familyMemberName: member.name,
        customMessage: `Reminder from your caregiver: Don't forget to take your medications!`
      });

      // Show success toast
      toast.success(`Reminder sent to ${member.name}! 📬`);

      // Close dialog and reset
      setShowReminderDialog(false);
      setSelectedReminderMember(null);
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder');
    } finally {
      setSendingReminder(false);
    }
  };

  const handleScheduleVisit = async () => {
    // Validation
    if (!visitForm.date || !visitForm.time || !visitForm.doctorLocation) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSchedulingVisit(true);
    try {
      // Get profile name
      let profileName = currentUser;
      if (visitForm.forProfile !== 'self') {
        const member = familyMembers.find(m => m.id === visitForm.forProfile);
        profileName = member?.name || visitForm.forProfile;
      }

      // Create appointment object
      const appointment: Appointment = {
        id: Date.now().toString(),
        type: visitForm.type,
        title: `${visitForm.doctorLocation}${visitForm.type === 'doctor' ? ' - Checkup' : ''}`,
        date: new Date(visitForm.date),
        time: visitForm.time,
        location: visitForm.doctorLocation,
        doctor: visitForm.type === 'doctor' ? visitForm.doctorLocation : undefined,
        description: visitForm.description || undefined,
        forProfile: visitForm.forProfile
      };

      // Add appointment
      onAddAppointment(appointment);

      // Show success toast
      const forWhom = visitForm.forProfile === 'self' ? 'yourself' : profileName;
      toast.success(`Visit scheduled for ${forWhom}! ✓`);

      // Reset and close
      setShowScheduleDialog(false);
      setVisitForm({
        forProfile: 'self',
        type: 'doctor',
        date: '',
        time: '',
        doctorLocation: '',
        description: ''
      });
    } catch (error) {
      console.error('Error scheduling visit:', error);
      toast.error('Failed to schedule visit');
    } finally {
      setSchedulingVisit(false);
    }
  };

  const handleRefillRequest = async () => {
    // Validation
    if (!refillForm.medicineId || !refillForm.date) {
      toast.error('Please select a medicine and date');
      return;
    }

    setSubmittingRefill(true);
    try {
      // Get profile name
      let profileName = currentUser;
      if (refillForm.forProfile !== 'self') {
        const member = familyMembers.find(m => m.id === refillForm.forProfile);
        profileName = member?.name || refillForm.forProfile;
      }

      // Get priority emoji
      const priorityEmoji = refillForm.priority === 'high' ? '🔴' : refillForm.priority === 'medium' ? '🟡' : '🟢';
      const priorityText = refillForm.priority.charAt(0).toUpperCase() + refillForm.priority.slice(1);

      // Show success toast
      if (refillForm.forProfile === 'self') {
        toast.success(`Refill request submitted for ${refillForm.medicineName} (${priorityText} priority)! 📋`);
      } else {
        toast.success(`Refill request for ${profileName}'s ${refillForm.medicineName} submitted! 📋`);
      }

      // Secondary toast for pharmacist notification
      setTimeout(() => {
        toast.info('Pharmacist will be notified');
      }, 500);

      // Reset and close
      setShowRefillDialog(false);
      setRefillForm({
        forProfile: 'self',
        medicineId: '',
        medicineName: '',
        dosage: '',
        date: '',
        priority: 'medium'
      });
    } catch (error) {
      console.error('Error submitting refill request:', error);
      toast.error('Failed to submit refill request');
    } finally {
      setSubmittingRefill(false);
    }
  };

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'self': return 'bg-healing-sage-100 text-healing-sage-700';
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
            <button
              onClick={() => setShowReminderDialog(true)}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all text-left"
            >
              <MessageCircle className="w-6 h-6 text-healing-sage-600 mb-2" />
              <p className="font-medium text-neutral-800">Send Reminder</p>
              <p className="text-xs text-neutral-500">Nudge family members</p>
            </button>
            <button
              onClick={() => setShowScheduleDialog(true)}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all text-left"
            >
              <Calendar className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-neutral-800">Schedule Visit</p>
              <p className="text-xs text-neutral-500">Book appointments</p>
            </button>
            <button
              onClick={() => setShowRefillDialog(true)}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all text-left"
            >
              <Pill className="w-6 h-6 text-purple-600 mb-2" />
              <p className="font-medium text-neutral-800">Refill Request</p>
              <p className="text-xs text-neutral-500">Order medications</p>
            </button>
            <button
              onClick={() => setShowReportsDialog(true)}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all text-left"
            >
              <BarChart3 className="w-6 h-6 text-orange-600 mb-2" />
              <p className="font-medium text-neutral-800">View Reports</p>
              <p className="text-xs text-neutral-500">Health analytics</p>
            </button>
          </div>
        </section>
      </div>

      {/* Reminder Dialog */}
      <AnimatePresence>
        {showReminderDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => !sendingReminder && setShowReminderDialog(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-6 z-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-neutral-700">Send Reminder</h3>
                <button
                  onClick={() => !sendingReminder && setShowReminderDialog(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  disabled={sendingReminder}
                >
                  <X className="w-5 h-5 text-neutral-600" />
                </button>
              </div>

              <p className="text-neutral-600 mb-4">
                Select a family member to send a medication reminder.
              </p>

              {/* Family Member Selection */}
              <div className="space-y-2 mb-6">
                {familyMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedReminderMember(member.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${selectedReminderMember === member.id
                      ? 'border-healing-sage-500 bg-healing-sage-50'
                      : 'border-neutral-200 hover:border-healing-sage-300'
                      }`}
                    disabled={sendingReminder}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-healing-sage-100 to-teal-100 rounded-full flex items-center justify-center text-2xl">
                        {member.avatar}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-800">{member.name}</h4>
                        <p className="text-sm text-neutral-500 capitalize">{member.relationship}</p>
                      </div>
                      {selectedReminderMember === member.id && (
                        <div className="w-6 h-6 bg-healing-sage-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowReminderDialog(false);
                    setSelectedReminderMember(null);
                  }}
                  className="flex-1 py-3 bg-neutral-200 text-neutral-700 rounded-xl font-medium hover:bg-neutral-300 transition-colors"
                  disabled={sendingReminder}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReminder}
                  disabled={!selectedReminderMember || sendingReminder}
                  className="flex-1 py-3 bg-healing-sage-500 text-white rounded-xl font-medium hover:bg-healing-sage-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sendingReminder ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Reminder
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Schedule Visit Dialog */}
      <AnimatePresence>
        {showScheduleDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => !schedulingVisit && setShowScheduleDialog(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-6 z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-neutral-700">Schedule Visit</h3>
                <button
                  onClick={() => !schedulingVisit && setShowScheduleDialog(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  disabled={schedulingVisit}
                >
                  <X className="w-5 h-5 text-neutral-600" />
                </button>
              </div>

              <p className="text-neutral-600 mb-4">
                Schedule a doctor visit or medical appointment.
              </p>

              {/* Form */}
              <div className="space-y-4">
                {/* Profile Selection */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Schedule for
                  </label>
                  <select
                    value={visitForm.forProfile}
                    onChange={(e) => setVisitForm({ ...visitForm, forProfile: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-healing-sage-500 focus:outline-none"
                    disabled={schedulingVisit}
                  >
                    <option value="self">Myself ({currentUser})</option>
                    {familyMembers.filter(member => member.id !== 'self').map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.relationship})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Appointment Type */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Appointment Type
                  </label>
                  <select
                    value={visitForm.type}
                    onChange={(e) => setVisitForm({ ...visitForm, type: e.target.value as any })}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-healing-sage-500 focus:outline-none"
                    disabled={schedulingVisit}
                  >
                    <option value="doctor">Doctor Visit</option>
                    <option value="test">Medical Test</option>
                    <option value="custom">Other</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={visitForm.date}
                    onChange={(e) => setVisitForm({ ...visitForm, date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-healing-sage-500 focus:outline-none"
                    disabled={schedulingVisit}
                    required
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={visitForm.time}
                    onChange={(e) => setVisitForm({ ...visitForm, time: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-healing-sage-500 focus:outline-none"
                    disabled={schedulingVisit}
                    required
                  />
                </div>

                {/* Doctor/Location */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {visitForm.type === 'doctor' ? 'Doctor Name' : 'Location'} *
                  </label>
                  <input
                    type="text"
                    value={visitForm.doctorLocation}
                    onChange={(e) => setVisitForm({ ...visitForm, doctorLocation: e.target.value })}
                    placeholder={visitForm.type === 'doctor' ? 'Dr. Smith' : 'Medical Center'}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-healing-sage-500 focus:outline-none"
                    disabled={schedulingVisit}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={visitForm.description}
                    onChange={(e) => setVisitForm({ ...visitForm, description: e.target.value })}
                    placeholder="Additional notes..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-healing-sage-500 focus:outline-none resize-none"
                    disabled={schedulingVisit}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowScheduleDialog(false);
                    setVisitForm({
                      forProfile: 'self',
                      type: 'doctor',
                      date: '',
                      time: '',
                      doctorLocation: '',
                      description: ''
                    });
                  }}
                  className="flex-1 py-3 bg-neutral-200 text-neutral-700 rounded-xl font-medium hover:bg-neutral-300 transition-colors"
                  disabled={schedulingVisit}
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleVisit}
                  disabled={schedulingVisit || !visitForm.date || !visitForm.time || !visitForm.doctorLocation}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {schedulingVisit ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      Schedule Visit
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Refill Request Dialog */}
      <AnimatePresence>
        {showRefillDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => !submittingRefill && setShowRefillDialog(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-6 z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-neutral-700">Refill Request</h3>
                <button
                  onClick={() => !submittingRefill && setShowRefillDialog(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  disabled={submittingRefill}
                >
                  <X className="w-5 h-5 text-neutral-600" />
                </button>
              </div>

              <p className="text-neutral-600 mb-4">
                Request a medication refill from the pharmacist.
              </p>

              {/* Form */}
              <div className="space-y-4">
                {/* Profile Selection */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Request for
                  </label>
                  <select
                    value={refillForm.forProfile}
                    onChange={(e) => setRefillForm({ ...refillForm, forProfile: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    disabled={submittingRefill}
                  >
                    <option value="self">Myself ({currentUser})</option>
                    {familyMembers.filter(member => member.id !== 'self').map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.relationship})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Medicine Selection */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Medicine *
                  </label>
                  <select
                    value={refillForm.medicineId}
                    onChange={(e) => {
                      const medicine = MEDICINE_DATABASE.find(m => m.id === e.target.value);
                      setRefillForm({
                        ...refillForm,
                        medicineId: e.target.value,
                        medicineName: medicine?.name || '',
                        dosage: medicine?.dosage || ''
                      });
                    }}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    disabled={submittingRefill}
                    required
                  >
                    <option value="">Select medicine...</option>
                    {MEDICINE_DATABASE.map(med => (
                      <option key={med.id} value={med.id}>
                        {med.name} - {med.dosage}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Needed */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Date Needed *
                  </label>
                  <input
                    type="date"
                    value={refillForm.date}
                    onChange={(e) => setRefillForm({ ...refillForm, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    disabled={submittingRefill}
                    required
                  />
                </div>

                {/* Priority Selection */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Priority Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRefillForm({ ...refillForm, priority: 'low' })}
                      className={`py-3 px-4 rounded-xl font-medium transition-all ${refillForm.priority === 'low'
                        ? 'bg-green-100 border-2 border-green-500 text-green-700'
                        : 'bg-neutral-100 border-2 border-transparent text-neutral-600 hover:bg-neutral-200'
                        }`}
                      disabled={submittingRefill}
                    >
                      <span className="block text-xl mb-1">🟢</span>
                      <span className="text-sm">Low</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRefillForm({ ...refillForm, priority: 'medium' })}
                      className={`py-3 px-4 rounded-xl font-medium transition-all ${refillForm.priority === 'medium'
                        ? 'bg-yellow-100 border-2 border-yellow-500 text-yellow-700'
                        : 'bg-neutral-100 border-2 border-transparent text-neutral-600 hover:bg-neutral-200'
                        }`}
                      disabled={submittingRefill}
                    >
                      <span className="block text-xl mb-1">🟡</span>
                      <span className="text-sm">Medium</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRefillForm({ ...refillForm, priority: 'high' })}
                      className={`py-3 px-4 rounded-xl font-medium transition-all ${refillForm.priority === 'high'
                        ? 'bg-red-100 border-2 border-red-500 text-red-700'
                        : 'bg-neutral-100 border-2 border-transparent text-neutral-600 hover:bg-neutral-200'
                        }`}
                      disabled={submittingRefill}
                    >
                      <span className="block text-xl mb-1">🔴</span>
                      <span className="text-sm">High</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowRefillDialog(false);
                    setRefillForm({
                      forProfile: 'self',
                      medicineId: '',
                      medicineName: '',
                      dosage: '',
                      date: '',
                      priority: 'medium'
                    });
                  }}
                  className="flex-1 py-3 bg-neutral-200 text-neutral-700 rounded-xl font-medium hover:bg-neutral-300 transition-colors"
                  disabled={submittingRefill}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRefillRequest}
                  disabled={submittingRefill || !refillForm.medicineId || !refillForm.date}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submittingRefill ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Pill className="w-4 h-4" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* View Reports Dialog */}
      <AnimatePresence>
        {showReportsDialog && (() => {
          const analytics = getAnalyticsData(selectedReportProfile);
          const getAdherenceColor = (rate: number) => {
            if (rate >= 80) return 'text-green-600';
            if (rate >= 60) return 'text-yellow-600';
            return 'text-red-600';
          };
          const getAdherenceBg = (rate: number) => {
            if (rate >= 80) return 'bg-green-50 border-green-200';
            if (rate >= 60) return 'bg-yellow-50 border-yellow-200';
            return 'bg-red-50 border-red-200';
          };
          const getAdherenceMessage = (rate: number) => {
            if (rate >= 90) return 'Excellent adherence! 🌟';
            if (rate >= 80) return 'Great job! Keep it up! 👍';
            if (rate >= 70) return 'Good progress 💪';
            if (rate >= 60) return 'Room for improvement 📈';
            return 'Needs attention ⚠️';
          };

          return (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowReportsDialog(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-4 md:inset-8 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-healing-sage-500 to-teal-600 text-white p-6 flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Health Analytics</h2>
                    <button
                      onClick={() => setShowReportsDialog(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Profile Selector */}
                  <select
                    value={selectedReportProfile}
                    onChange={(e) => setSelectedReportProfile(e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white font-medium focus:outline-none focus:border-white/50"
                  >
                    <option value="self" className="text-neutral-800">My Reports</option>
                    {familyMembers.filter(member => member.id !== 'self').map(member => (
                      <option key={member.id} value={member.id} className="text-neutral-800">
                        {member.name}'s Reports
                      </option>
                    ))}
                  </select>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Adherence Rate Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border-2 p-6 text-center ${getAdherenceBg(analytics.adherenceRate)}`}
                  >
                    <h3 className="text-lg font-semibold text-neutral-700 mb-3">Adherence Rate</h3>
                    <div className={`text-6xl font-bold mb-2 ${getAdherenceColor(analytics.adherenceRate)}`}>
                      {analytics.adherenceRate}%
                    </div>
                    <p className="text-neutral-600 font-medium">{getAdherenceMessage(analytics.adherenceRate)}</p>
                  </motion.div>

                  {/* Weekly Adherence Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border-2 border-neutral-200 p-6"
                  >
                    <h3 className="text-lg font-semibold text-neutral-700 mb-4">Weekly Adherence</h3>
                    <div className="flex items-end justify-between gap-2 h-40">
                      {analytics.weeklyAdherence.map((value: number, index: number) => {
                        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                        const height = `${value}%`;
                        const barColor = value === 100 ? 'bg-green-500' : value >= 70 ? 'bg-yellow-500' : 'bg-red-500';

                        return (
                          <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-neutral-100 rounded-t-lg relative" style={{ height: '100%' }}>
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height }}
                                transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                                className={`${barColor} rounded-t-lg absolute bottom-0 w-full flex items-center justify-center`}
                              >
                                {value < 100 && (
                                  <span className="text-xs font-bold text-white">{value}%</span>
                                )}
                              </motion.div>
                            </div>
                            <span className="text-xs font-medium text-neutral-600">{days[index]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Medications */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white rounded-2xl border-2 border-neutral-200 p-6"
                    >
                      <h3 className="text-lg font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                        <Pill className="w-5 h-5 text-purple-600" />
                        Current Medications
                      </h3>
                      <div className="space-y-3">
                        {analytics.currentMedications.map((med: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                            <div>
                              <p className="font-semibold text-neutral-800">{med.name}</p>
                              <p className="text-sm text-neutral-600">{med.frequency}</p>
                            </div>
                            <span className="text-sm font-medium text-purple-600 bg-white px-3 py-1 rounded-lg">
                              {med.dosage}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white rounded-2xl border-2 border-neutral-200 p-6"
                    >
                      <h3 className="text-lg font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        Recent Activity
                      </h3>
                      <div className="space-y-3">
                        {analytics.recentActivity.map((activity: any, index: number) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.status === 'taken' ? 'bg-green-100' : 'bg-red-100'
                              }`}>
                              {activity.status === 'taken' ? (
                                <span className="text-green-600 text-lg">✓</span>
                              ) : (
                                <span className="text-red-600 text-lg">✗</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-neutral-800">{activity.medication}</p>
                              <p className="text-xs text-neutral-500">
                                {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Statistics Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 p-6"
                  >
                    <h3 className="text-lg font-semibold text-neutral-700 mb-4">Statistics Summary</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded-xl">
                        <p className="text-sm text-neutral-600 mb-1">Total Doses</p>
                        <p className="text-3xl font-bold text-blue-600">{analytics.statistics.totalDoses}</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl">
                        <p className="text-sm text-neutral-600 mb-1">Missed</p>
                        <p className="text-3xl font-bold text-red-600">{analytics.statistics.missedDoses}</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl">
                        <p className="text-sm text-neutral-600 mb-1">Current Streak</p>
                        <p className="text-3xl font-bold text-green-600">{analytics.statistics.currentStreak}</p>
                        <p className="text-xs text-neutral-500 mt-1">days</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}