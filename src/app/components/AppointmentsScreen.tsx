import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Check, AlertCircle, X, Plus, Calendar as CalendarIcon, Clock, Edit2, Pill, Stethoscope, TestTube, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  type: 'doctor' | 'refill' | 'test' | 'custom';
  title: string;
  date: Date;
  time: string;
  location?: string;
  doctor?: string;
  description?: string;
}

interface AppointmentsScreenProps {
  onBack: () => void;
  appointments: Appointment[];
  onAddEvent: (event: Appointment) => void;
}

export function AppointmentsScreen({ onBack, appointments, onAddEvent }: AppointmentsScreenProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', type: 'custom', time: '10:00 AM' });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'doctor': return Stethoscope;
      case 'refill': return Pill;
      case 'test': return TestTube;
      default: return Calendar;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'doctor': return 'bg-info-light text-info-dark border-info-main';
      case 'refill': return 'bg-warning-light text-warning-dark border-warning-main';
      case 'test': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-healing-sage-100 text-healing-sage-700 border-healing-sage-300';
    }
  };

  // Get next upcoming appointment
  const getNextUpAppointment = () => {
    const now = new Date();
    const futureAppointments = appointments
      .filter(apt => apt.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return futureAppointments[0];
  };

  const nextUp = getNextUpAppointment();

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      apt.date.getDate() === date.getDate() &&
      apt.date.getMonth() === date.getMonth() &&
      apt.date.getFullYear() === date.getFullYear()
    );
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title) return;
    onAddEvent({
      id: Date.now().toString(),
      type: newEvent.type as any,
      title: newEvent.title,
      date: selectedDate,
      time: newEvent.time,
    });
    setShowAddModal(false);
    setNewEvent({ title: '', type: 'custom', time: '10:00 AM' });
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 font-sans">
      <div className="bg-healing-sage-500 text-white p-6 sticky top-0 z-10 shadow-md">
        <button onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg">Back</span>
        </button>
        <h1 className="text-3xl font-bold font-secondary text-center">Calendar</h1>
      </div>

      <div className="p-6">
        {/* Next Up Feature */}
        {nextUp && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-healing-sage-500 to-teal-600 text-white rounded-2xl p-6 mb-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Next Up
                </h3>
                <p className="text-xl font-bold mt-1">{nextUp.title}</p>
                <p className="text-healing-sage-100">
                  {nextUp.date.toLocaleDateString()} at {nextUp.time}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                 {nextUp.type === 'doctor' ? (
                    <Stethoscope className="w-8 h-8" />
                  ) : nextUp.type === 'refill' ? (
                    <Pill className="w-8 h-8" />
                  ) : nextUp.type === 'test' ? (
                    <TestTube className="w-8 h-8" />
                  ) : (
                    <Calendar className="w-8 h-8" /> // Your fallback icon
                  )}
                 <Calendar className="w-8 h-8" />
              </div>
            </div>
          </motion.div>
        )}

        <div className="bg-white rounded-3xl shadow-md p-6 border border-neutral-50 mb-6 relative">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-neutral-800">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
            <div className="flex gap-2">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-2 bg-neutral-50 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-2 bg-neutral-50 rounded-xl"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-[10px] font-black text-neutral-300 uppercase">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const dayEvents = getAppointmentsForDate(date);
              const isSelected = selectedDate?.getDate() === day;
              
              return (
                <button 
                  key={day} 
                  onClick={() => setSelectedDate(date)} 
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all hover:scale-105 ${
                    isSelected ? 'bg-healing-sage-500 text-white shadow-lg scale-110 z-10' : 'hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <span className="text-sm font-bold">{day}</span>
                  <div className="flex gap-1 absolute bottom-1">
                    {dayEvents.slice(0, 3).map((event, idx) => {
                      const EventIcon = getEventIcon(event.type);
                      return (
                        <EventIcon 
                          key={idx} 
                          className={`w-2 h-2 ${
                            event.type === 'doctor' ? 'text-info-main' :
                            event.type === 'refill' ? 'text-warning-main' :
                            event.type === 'test' ? 'text-purple-500' :
                            'text-healing-sage-500'
                          }`} 
                        />
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedDate && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-4 mb-20" // Added mb-20 to prevent overlay
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-neutral-800">Events for {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}</h3>
              <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-healing-sage-500 text-white rounded-xl font-bold text-sm shadow-sm"><Plus className="w-4 h-4" /> Add Event</button>
            </div>
            
            {getAppointmentsForDate(selectedDate).map(apt => {
              const EventIcon = getEventIcon(apt.type);
              return (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`bg-white p-5 rounded-2xl shadow-sm border-l-4 ${getEventColor(apt.type).split(' ')[2]} flex justify-between items-center`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${getEventColor(apt.type)}`}>
                      <EventIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-800">{apt.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-neutral-400 mt-1">
                        <Clock className="w-3 h-3" /> {apt.time}
                      </div>
                      {apt.location && (
                        <p className="text-xs text-neutral-500 mt-1">{apt.location}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-xs font-bold uppercase text-neutral-400 tracking-wider bg-neutral-50 px-2 py-1 rounded">
                    {apt.type}
                  </div>
                </motion.div>
              );
            })}
            
            {getAppointmentsForDate(selectedDate).length === 0 && (
              <p className="text-center py-10 text-neutral-400 italic">No events scheduled</p>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">Add Event</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Event Name (e.g. Fasting)" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full px-4 py-4 bg-neutral-50 rounded-2xl outline-none text-lg border-2 border-transparent focus:border-healing-sage-500" />
                <select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})} className="w-full px-4 py-4 bg-neutral-50 rounded-2xl outline-none font-bold text-neutral-600">
                  <option value="custom">General Event</option>
                  <option value="test">Medical Test</option>
                  <option value="doctor">Doctor Visit</option>
                  <option value="refill">Refill Date</option>
                </select>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 rounded-2xl font-bold bg-neutral-100 text-neutral-500">Cancel</button>
                  <button onClick={handleAddEvent} className="flex-1 py-4 rounded-2xl font-bold bg-healing-sage-500 text-white shadow-lg">Add</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
