import { useState } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, User, ChevronLeft, ChevronRight, Check, AlertCircle, X } from 'lucide-react';
import { motion } from 'motion/react';

interface Appointment {
  id: string;
  type: 'doctor' | 'refill' | 'test';
  title: string;
  date: Date;
  time: string;
  location?: string;
  doctor?: string;
}

interface AppointmentsScreenProps {
  onBack: () => void;
  appointments: Appointment[];
}

// Mock Adherence History for Gamification
const MOCK_HISTORY: { [dateStr: string]: 'full' | 'partial' | 'missed' } = {
  '2026-02-01': 'full',
  '2026-01-31': 'full',
  '2026-01-30': 'partial',
  '2026-01-29': 'full',
  '2026-01-28': 'missed',
  '2026-01-27': 'full',
  '2026-01-26': 'full',
  '2026-01-25': 'partial',
  // ... more logic can be added or dynamically generated
};

export function AppointmentsScreen({ onBack, appointments }: AppointmentsScreenProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // Feb 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      apt.date.getDate() === date.getDate() &&
      apt.date.getMonth() === date.getMonth() &&
      apt.date.getFullYear() === date.getFullYear()
    );
  };

  const getAdherenceStatus = (date: Date) => {
      // Create simplified ISO string key YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const key = `${year}-${month}-${day}`;
      
      // Don't show status for future dates
      if (date > new Date()) return null;
      
      // Use mock data or randomize for demo if not found
      if (MOCK_HISTORY[key]) return MOCK_HISTORY[key];
      
      // Randomizer for unfilled past dates for demo visual
      if (date < new Date()) {
          const rand = Math.random();
          if (rand > 0.8) return 'partial';
          if (rand > 0.95) return 'missed';
          return 'full';
      }
      return null;
  };

  // Get next 2 upcoming appointments
  const upcomingAppointments = appointments
    .filter(apt => apt.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 2);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'doctor': return 'bg-healing-sage-500';
      case 'refill': return 'bg-warm-comfort-400';
      case 'test': return 'bg-info-main';
      default: return 'bg-neutral-400';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'doctor': return '👨‍⚕️ Doctor Visit';
      case 'refill': return '💊 Refill';
      case 'test': return '🔬 Test';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-healing-sage-500 text-white p-6 sticky top-0 z-10 shadow-md">
        <button onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg">Back</span>
        </button>
        <h1 className="text-3xl font-bold">Appointments</h1>
        <p className="text-healing-sage-100">Your upcoming events</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Next Up Section */}
        <section>
          <h2 className="text-2xl font-bold text-neutral-700 mb-4">Next Up</h2>
          <div className="space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((apt, index) => (
                <motion.div
                  key={apt.id}
                  className="bg-white rounded-2xl shadow-md p-5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 ${getTypeColor(apt.type)} rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0`}>
                      {apt.date.getDate()}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-neutral-700">{apt.title}</h3>
                        <span className={`px-2 py-1 ${getTypeColor(apt.type)} text-white text-xs rounded-full`}>
                          {apt.type}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-neutral-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{apt.date.toLocaleDateString()} • {apt.time}</span>
                        </div>
                        
                        {apt.doctor && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{apt.doctor}</span>
                          </div>
                        )}
                        
                        {apt.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{apt.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                <p className="text-neutral-500">No upcoming appointments</p>
              </div>
            )}
          </div>
        </section>

        {/* Calendar Section */}
        <section>
          <div className="bg-white rounded-2xl shadow-md p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-700">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-neutral-600" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-neutral-600" />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-neutral-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const hasAppointments = getAppointmentsForDate(date).length > 0;
                const adherence = getAdherenceStatus(date);
                const isToday = 
                  date.getDate() === new Date().getDate() &&
                  date.getMonth() === new Date().getMonth() &&
                  date.getFullYear() === new Date().getFullYear();

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-colors ${
                      isToday 
                        ? 'bg-healing-sage-500 text-white font-bold ring-2 ring-healing-sage-300' 
                        : selectedDate?.getTime() === date.getTime()
                        ? 'bg-neutral-200'
                        : 'hover:bg-neutral-50'
                    }`}
                  >
                    <span className={`text-sm ${isToday ? 'text-white' : 'text-neutral-700'}`}>{day}</span>
                    
                    {/* Adherence Indicator (Background Gamification) */}
                    {!isToday && adherence === 'full' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                            <Check className="w-8 h-8 text-success-main" />
                        </div>
                    )}
                    {!isToday && adherence === 'partial' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                            <AlertCircle className="w-8 h-8 text-warning-main" />
                        </div>
                    )}
                    {!isToday && adherence === 'missed' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                            <X className="w-8 h-8 text-error-main" />
                        </div>
                    )}


                    {/* Appointment Dots (Foreground) */}
                    {hasAppointments && (
                      <div className="absolute bottom-1 flex gap-0.5">
                        {getAppointmentsForDate(date).slice(0, 3).map((apt, idx) => (
                          <div key={idx} className={`w-1.5 h-1.5 rounded-full ${getTypeColor(apt.type)}`} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected date appointments */}
            {selectedDate && getAppointmentsForDate(selectedDate).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 pt-6 border-t border-neutral-200"
              >
                <h3 className="font-semibold text-neutral-700 mb-3">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </h3>
                <div className="space-y-2">
                  {getAppointmentsForDate(selectedDate).map(apt => (
                    <div key={apt.id} className="p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-neutral-700">{getTypeLabel(apt.type)}</span>
                      </div>
                      <p className="text-sm text-neutral-600">{apt.title} • {apt.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}