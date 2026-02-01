import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Pill, Stethoscope, BarChart3, Clock, Wind, Sun, CloudRain, Trees, ChevronRight, AlertCircle, Search, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FamilyMember, WEATHER_TIPS } from '@/app/data/caregiver';
import { Medicine, MEDICINE_DATABASE } from '@/app/data/medicines';
import { toast } from 'sonner';
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

  // Add Prescription Dialog State
  const [showAddPrescriptionDialog, setShowAddPrescriptionDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempStock, setTempStock] = useState('30');

  // Handler to add prescription
  const handleAddPrescription = (med: Medicine) => {
    const newMedication = {
      id: `${Date.now()}`,
      name: med.name,
      dosage: med.dosage,
      time: '9:00 AM',
      adherence: 100
    };

    setMedications([...medications, newMedication]);
    toast.success(`${med.name} added to ${member.name}'s prescriptions! 💊`);

    setShowAddPrescriptionDialog(false);
    setSearchQuery('');
    setTempStock('30');
  };

  // Timeline Tab Data
  const [timelineData] = useState([
    { id: '1', type: 'taken', medication: 'Aspirin', time: 'Today, 2:30 PM', status: 'On time', icon: '✅', color: 'green' },
    { id: '2', type: 'taken', medication: 'Lisinopril', time: 'Today, 9:00 AM', status: 'On time', icon: '✅', color: 'green' },
    { id: '3', type: 'missed', medication: 'Metformin', time: 'Yesterday, 6:00 PM', status: 'Reminder sent', icon: '❌', color: 'red' },
    { id: '4', type: 'added', medication: 'Aspirin 75mg', time: '2 days ago', status: 'New prescription', icon: '💊', color: 'blue' },
    { id: '5', type: 'refill', medication: 'Lisinopril', time: '3 days ago', status: 'Refill ordered', icon: '📦', color: 'orange' }
  ]);
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'today' | 'week'>('all');

  // Appointments Tab Data
  const [appointments] = useState([
    {
      id: '1', type: 'doctor', icon: '👨‍⚕️', title: 'Dr. Sarah Johnson', description: 'Regular Checkup',
      date: 'Feb 5, 2026', time: '10:00 AM', location: 'Main Street Medical Center', status: 'upcoming'
    },
    {
      id: '2', type: 'lab', icon: '🔬', title: 'Blood Test', description: 'Routine lab work',
      date: 'Feb 12, 2026', time: '8:00 AM', location: 'Lab - Downtown', notes: 'Fasting Required', status: 'upcoming'
    },
    {
      id: '3', type: 'dental', icon: '🦷', title: 'Dr. Mike Williams', description: 'Dental Cleaning',
      date: 'Jan 28, 2026', time: '2:00 PM', location: 'City Dental Clinic', status: 'completed'
    }
  ]);
  const [showPastAppointments, setShowPastAppointments] = useState(false);

  // Pharmacist Chat Data
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'pharmacist', senderName: 'Pharmacist', message: `Hello! How can I help you with ${member.name}'s medications today?`, time: '2:30 PM', avatar: '💊' },
    { id: '2', sender: 'user', senderName: 'You', message: 'I need to refill the Aspirin prescription.', time: '2:35 PM', avatar: '👤' },
    { id: '3', sender: 'pharmacist', senderName: 'Pharmacist', message: "I'll process that refill for you. It should be ready by tomorrow afternoon. I'll send you a notification when it's ready for pickup.", time: '2:36 PM', avatar: '💊' },
    { id: '4', sender: 'user', senderName: 'You', message: 'Great, thank you!', time: '2:37 PM', avatar: '👤' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [pharmacistOnline] = useState(true);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMsg = {
      id: `${Date.now()}`,
      sender: 'user' as const,
      senderName: 'You',
      message: newMessage,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      avatar: '👤'
    };

    setChatMessages([...chatMessages, userMsg]);
    toast.success('Message sent to pharmacist');
    setNewMessage('');

    // Simulate pharmacist response after 2 seconds
    setTimeout(() => {
      const pharmacistMsg = {
        id: `${Date.now() + 1}`,
        sender: 'pharmacist' as const,
        senderName: 'Pharmacist',
        message: "I've received your message and will get back to you shortly!",
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        avatar: '💊'
      };
      setChatMessages(prev => [...prev, pharmacistMsg]);
    }, 2000);
  };

  // Analytics Tab Data
  const [analyticsData] = useState({
    adherenceTrend: [
      { week: 'Week 1', adherence: 92 },
      { week: 'Week 2', adherence: 88 },
      { week: 'Week 3', adherence: 95 },
      { week: 'Week 4', adherence: 90 }
    ],
    byMedication: [
      { name: 'Aspirin', adherence: 90, color: 'bg-green-500' },
      { name: 'Lisinopril', adherence: 85, color: 'bg-blue-500' },
      { name: 'Metformin', adherence: 80, color: 'bg-purple-500' }
    ],
    insights: {
      bestTime: { period: 'Morning', percentage: 95 },
      worstTime: { period: 'Evening', percentage: 75 },
      currentStreak: 5,
      longestStreak: 12
    },
    monthlySummary: {
      thisMonth: 90,
      lastMonth: 88,
      totalMeds: 100,
      taken: 90,
      onTime: 85
    }
  });


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
      <div className={`bg-gradient-to-r ${member.relationship === 'mom' ? 'from-pink-500 to-rose-600' :
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
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${activeTab === tab.id
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
              {/* Add Prescription Button */}
              <button
                onClick={() => setShowAddPrescriptionDialog(true)}
                className="w-full bg-healing-sage-500 text-white rounded-2xl shadow-lg p-4 flex items-center justify-center gap-3 hover:bg-healing-sage-600 transition-all font-bold text-lg active:scale-95 mt-4"
              >
                <Plus className="w-6 h-6" />
                Add Prescription
              </button>
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-neutral-800">Medication Timeline</h3>
                <select
                  value={timelineFilter}
                  onChange={(e) => setTimelineFilter(e.target.value as any)}
                  className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                </select>
              </div>

              <div className="space-y-3">
                {timelineData.map((item, index) => (
                  <div key={item.id} className="relative pl-8">
                    {/* Timeline line */}
                    {index !== timelineData.length - 1 && (
                      <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-neutral-200" />
                    )}

                    {/* Timeline dot */}
                    <div className={`absolute left-0 w-6 h-6 rounded-full ${item.color === 'green' ? 'bg-green-100' :
                      item.color === 'red' ? 'bg-red-100' :
                        item.color === 'blue' ? 'bg-blue-100' :
                          'bg-orange-100'
                      } flex items-center justify-center text-sm`}>
                      {item.icon}
                    </div>

                    {/* Timeline content */}
                    <div className="bg-white rounded-xl shadow-sm p-4 border border-neutral-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-neutral-800">{item.medication}</p>
                          <p className="text-sm text-neutral-500">{item.status}</p>
                        </div>
                        <span className="text-xs text-neutral-400">{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div key="appointments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-xl font-bold text-neutral-800 mb-4">Upcoming Appointments</h3>

              <div className="space-y-4">
                {appointments.filter(a => a.status === 'upcoming').map((apt) => (
                  <div key={apt.id} className="bg-white rounded-xl shadow-sm p-4 border border-neutral-100">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{apt.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-neutral-800">{apt.title}</h4>
                        <p className="text-sm text-neutral-600">{apt.description}</p>
                        <div className="mt-2 space-y-1 text-sm text-neutral-500">
                          <p>📅 {apt.date}</p>
                          <p>⏰ {apt.time}</p>
                          <p>📍 {apt.location}</p>
                          {apt.notes && <p className="text-orange-600 font-medium">⚠️ {apt.notes}</p>}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button className="px-3 py-1 bg-healing-sage-100 text-healing-sage-700 rounded-lg text-xs font-medium hover:bg-healing-sage-200">
                            View Details
                          </button>
                          <button className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-lg text-xs font-medium hover:bg-neutral-200">
                            Reschedule
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Past Appointments */}
              <div className="mt-6">
                <button
                  onClick={() => setShowPastAppointments(!showPastAppointments)}
                  className="w-full flex items-center justify-between p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                >
                  <span className="font-medium text-neutral-700">
                    Past Appointments ({appointments.filter(a => a.status === 'completed').length})
                  </span>
                  <ChevronRight className={`w-5 h-5 text-neutral-500 transition-transform ${showPastAppointments ? 'rotate-90' : ''}`} />
                </button>

                {showPastAppointments && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 space-y-3"
                  >
                    {appointments.filter(a => a.status === 'completed').map((apt) => (
                      <div key={apt.id} className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 opacity-75">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{apt.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-bold text-neutral-700">{apt.title}</h4>
                            <p className="text-sm text-neutral-500">{apt.description}</p>
                            <p className="text-xs text-neutral-400 mt-1">📅 {apt.date} • ⏰ {apt.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'pharmacist' && (
            <motion.div key="pharmacist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-neutral-800">Pharmacist Chat</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${pharmacistOnline ? 'bg-green-500' : 'bg-neutral-400'}`} />
                  <span className="text-sm text-neutral-600">{pharmacistOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mb-4 overflow-x-auto">
                <button
                  onClick={() => setNewMessage('I need to request a refill for ')}
                  className="px-3 py-2 bg-healing-sage-100 text-healing-sage-700 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-healing-sage-200"
                >
                  📦 Request Refill
                </button>
                <button
                  onClick={() => setNewMessage('I have a question about ')}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-blue-200"
                >
                  ❓ Ask Question
                </button>
                <button
                  onClick={() => setNewMessage('I need help with a prescription for ')}
                  className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-purple-200"
                >
                  📋 Prescription Help
                </button>
              </div>

              {/* Chat Messages */}
              <div className="bg-white rounded-xl shadow-sm border border-neutral-100 mb-4 max-h-96 overflow-y-auto">
                <div className="p-4 space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 text-lg">
                        {msg.avatar}
                      </div>
                      <div className={`flex-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-neutral-500">{msg.senderName}</span>
                          <span className="text-xs text-neutral-400">{msg.time}</span>
                        </div>
                        <div className={`inline-block px-4 py-2 rounded-2xl ${msg.sender === 'user'
                          ? 'bg-healing-sage-500 text-white'
                          : 'bg-neutral-100 text-neutral-800'
                          }`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-white border border-neutral-200 rounded-xl outline-none focus:border-healing-sage-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-6 py-3 bg-healing-sage-500 text-white rounded-xl font-medium hover:bg-healing-sage-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="text-xl font-bold text-neutral-800 mb-4">Medication Analytics</h3>

              {/* Adherence Trend */}
              <div className="bg-white rounded-xl shadow-sm p-4 border border-neutral-100 mb-4">
                <h4 className="font-bold text-neutral-700 mb-3">Adherence Trend</h4>
                <div className="flex items-end justify-between gap-2 h-32">
                  {analyticsData.adherenceTrend.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-neutral-100 rounded-t-lg relative" style={{ height: '100%' }}>
                        <div
                          className="absolute bottom-0 w-full bg-gradient-to-t from-healing-sage-500 to-teal-400 rounded-t-lg transition-all"
                          style={{ height: `${item.adherence}%` }}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-healing-sage-600">{item.adherence}%</p>
                        <p className="text-xs text-neutral-500">{item.week}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Medication */}
              <div className="bg-white rounded-xl shadow-sm p-4 border border-neutral-100 mb-4">
                <h4 className="font-bold text-neutral-700 mb-3">By Medication</h4>
                <div className="space-y-3">
                  {analyticsData.byMedication.map((med) => (
                    <div key={med.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{med.name}</span>
                        <span className="text-neutral-600">{med.adherence}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-3">
                        <div
                          className={`${med.color} h-3 rounded-full transition-all`}
                          style={{ width: `${med.adherence}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Insights */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200 mb-4">
                <h4 className="font-bold text-blue-900 mb-3">Performance Insights</h4>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span className="text-blue-800">
                      <strong>Best Time:</strong> {analyticsData.insights.bestTime.period} ({analyticsData.insights.bestTime.percentage}%)
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-orange-600">⚠️</span>
                    <span className="text-blue-800">
                      <strong>Needs Improvement:</strong> {analyticsData.insights.worstTime.period} ({analyticsData.insights.worstTime.percentage}%)
                    </span>
                  </p>
                </div>
              </div>

              {/* Streak Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <p className="text-sm text-green-700 font-medium">Current Streak</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {analyticsData.insights.currentStreak}
                    <span className="text-lg ml-1">days</span>
                  </p>
                  <p className="text-xs text-green-600 mt-1">🔥 Keep going!</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                  <p className="text-sm text-orange-700 font-medium">Longest Streak</p>
                  <p className="text-3xl font-bold text-orange-600 mt-1">
                    {analyticsData.insights.longestStreak}
                    <span className="text-lg ml-1">days</span>
                  </p>
                  <p className="text-xs text-orange-600 mt-1">🏆 Personal Best</p>
                </div>
              </div>

              {/* Monthly Summary */}
              <div className="bg-white rounded-xl shadow-sm p-4 border border-neutral-100">
                <h4 className="font-bold text-neutral-700 mb-3">Monthly Comparison</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">This Month</span>
                    <span className="font-bold text-healing-sage-600">
                      {analyticsData.monthlySummary.thisMonth}%
                      <span className="text-xs text-green-600 ml-1">
                        (+{analyticsData.monthlySummary.thisMonth - analyticsData.monthlySummary.lastMonth}% vs last)
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Total Medications</span>
                    <span className="font-bold text-neutral-800">
                      {analyticsData.monthlySummary.taken}/{analyticsData.monthlySummary.totalMeds}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">On-time</span>
                    <span className="font-bold text-neutral-800">
                      {analyticsData.monthlySummary.onTime}/{analyticsData.monthlySummary.taken}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Prescription Dialog */}
      {showAddPrescriptionDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Add New Medicine</h3>
                <button
                  onClick={() => setShowAddPrescriptionDialog(false)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  Cancel
                </button>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search medicines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-neutral-50 rounded-2xl outline-none text-lg"
                />
              </div>

              {/* Stock Input */}
              <div>
                <label className="text-sm font-bold text-neutral-500 ml-1">
                  Current Stock (Tablets)
                </label>
                <input
                  type="number"
                  value={tempStock}
                  onChange={(e) => setTempStock(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 rounded-xl mt-1 outline-none font-bold text-healing-sage-600"
                />
              </div>
            </div>

            {/* Medicine List */}
            <div className="overflow-y-auto max-h-[40vh] p-2">
              {MEDICINE_DATABASE
                .filter(med => med.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((med) => (
                  <button
                    key={med.id}
                    onClick={() => handleAddPrescription(med)}
                    className="w-full text-left p-4 hover:bg-neutral-50 rounded-2xl transition-colors border-b last:border-0"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-neutral-800 text-lg">{med.name}</h4>
                      <span className="text-xs bg-neutral-100 px-3 py-1 rounded-full font-bold">
                        {med.dosage}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">{med.description}</p>
                  </button>
                ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}