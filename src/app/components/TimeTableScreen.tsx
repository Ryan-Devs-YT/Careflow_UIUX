import { useState } from 'react';
import { ArrowLeft, Clock, GripVertical, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'sonner';

interface MedicationSchedule {
  id: string;
  name: string;
  dosage: string;
  time: string;
  hour: number;
}

interface TimeTableScreenProps {
  onBack: () => void;
  medications: MedicationSchedule[];
  onUpdateSchedule: (id: string, time: string, days: string[]) => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const ItemTypes = {
  MEDICINE: 'medicine',
};

// Draggable Medicine Component
const DraggableMedicine = ({ med }: { med: MedicationSchedule }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.MEDICINE,
    item: { id: med.id, name: med.name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 bg-white border-2 border-healing-sage-200 rounded-xl shadow-sm flex items-center gap-2 cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <GripVertical className="w-5 h-5 text-neutral-400" />
      <div>
        <p className="font-medium text-neutral-700">{med.name}</p>
        <p className="text-xs text-neutral-500">{med.dosage}</p>
      </div>
    </div>
  );
};

// Drop Zone Component (Day)
const DayColumn = ({ day, scheduledMeds, onDrop, onRemove }: { 
  day: string; 
  scheduledMeds: { id: string; name: string }[]; 
  onDrop: (item: { id: string; name: string }) => void;
  onRemove: (medId: string) => void;
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.MEDICINE,
    drop: (item: { id: string; name: string }) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`min-w-[120px] rounded-xl p-3 flex flex-col gap-2 transition-colors ${
        isOver ? 'bg-healing-sage-100 border-2 border-healing-sage-300' : 'bg-neutral-100 border-2 border-transparent'
      }`}
    >
      <h3 className="font-bold text-neutral-600 text-center mb-2">{day}</h3>
      <div className="space-y-2 min-h-[100px]">
        {scheduledMeds.map((med, idx) => (
          <div key={`${med.id}-${idx}`} className="bg-white p-2 rounded-lg shadow-sm text-sm relative group">
            <span className="font-medium text-neutral-700">{med.name}</span>
            <button 
              onClick={() => onRemove(med.id)}
              className="absolute right-1 top-1 text-neutral-400 hover:text-error-main opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {scheduledMeds.length === 0 && (
          <p className="text-xs text-neutral-400 text-center mt-4">Drop here</p>
        )}
      </div>
    </div>
  );
};

export function TimeTableScreen({ onBack, medications, onUpdateSchedule }: TimeTableScreenProps) {
  const [selectedView, setSelectedView] = useState<'day' | 'week'>('day');
  // Week Schedule State: { "Mon": [{id, name}], ... }
  const [weekSchedule, setWeekSchedule] = useState<{ [key: string]: { id: string; name: string }[] }>({});

  const handleDayDrop = (day: string, item: { id: string; name: string }) => {
    setWeekSchedule(prev => {
      const current = prev[day] || [];
      // Prevent duplicates if needed, or allow multiple doses
      if (current.find(m => m.id === item.id)) return prev; 
      return { ...prev, [day]: [...current, item] };
    });
    toast.success(`Scheduled ${item.name} for ${day}`);
  };

  const handleRemoveFromDay = (day: string, medId: string) => {
    setWeekSchedule(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(m => m.id !== medId)
    }));
  };

  // Logic for horizontal time update
  const handleTimeChange = (medId: string, newHour: number) => {
    // Determine AM/PM
    const ampm = newHour >= 12 ? 'PM' : 'AM';
    const hour12 = newHour % 12 || 12;
    const timeString = `${hour12}:00 ${ampm}`;
    
    // In a real app, this would bubble up. For now we just toast.
    // onUpdateSchedule(medId, timeString, []); 
    toast.success(`Rescheduled to ${timeString}`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-neutral-50 pb-24">
        {/* Header */}
        <div className="bg-healing-sage-500 text-white p-6 sticky top-0 z-10 shadow-md">
          <button onClick={onBack} className="flex items-center gap-2 mb-4">
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg">Back</span>
          </button>
          <h1 className="text-3xl font-bold">Time Table</h1>
          <p className="text-healing-sage-100">Schedule your medications</p>
        </div>

        {/* View Toggle */}
        <div className="p-6">
          <div className="bg-white rounded-2xl shadow-md p-2 flex gap-2 mb-6">
            <button
              onClick={() => setSelectedView('day')}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                selectedView === 'day'
                  ? 'bg-healing-sage-500 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Day View (Horizontal)
            </button>
            <button
              onClick={() => setSelectedView('week')}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                selectedView === 'week'
                  ? 'bg-healing-sage-500 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              Week View (Drag & Drop)
            </button>
          </div>

          {/* Day View - Horizontal Timeline */}
          {selectedView === 'day' && (
            <div className="bg-white rounded-2xl shadow-md p-6 overflow-hidden">
              <h2 className="text-xl font-bold text-neutral-700 mb-6">Today's Timeline</h2>
              <p className="text-sm text-neutral-500 mb-4">Scroll horizontally to see all hours. Click a medication to reschedule.</p>
              
              <div className="relative overflow-x-auto pb-6">
                <div className="flex min-w-[1600px] border-b-2 border-neutral-200">
                  {HOURS.map((hour) => (
                    <div key={hour} className="w-20 flex-shrink-0 relative group">
                      {/* Hour Label */}
                      <div className="text-center text-xs text-neutral-500 font-medium py-2">
                        {hour}:00
                      </div>
                      
                      {/* Tick Mark */}
                      <div className="h-4 w-0.5 bg-neutral-300 mx-auto" />
                      
                      {/* Slot Content */}
                      <div className="h-32 border-l border-neutral-100 relative bg-neutral-50/50 group-hover:bg-neutral-100 transition-colors">
                        {medications.filter(m => m.hour === hour).map(med => (
                          <motion.button
                            key={med.id}
                            layoutId={med.id}
                            onClick={() => {
                                const newTime = prompt("Enter new hour (0-23):", hour.toString());
                                if (newTime && !isNaN(parseInt(newTime))) {
                                    handleTimeChange(med.id, parseInt(newTime));
                                }
                            }}
                            className="absolute left-1 right-1 top-2 bg-healing-sage-500 text-white text-xs p-2 rounded shadow-sm z-10 hover:bg-healing-sage-600 text-left"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <span className="font-bold block">{med.name}</span>
                            {med.dosage}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Week View - Drag & Drop */}
          {selectedView === 'week' && (
            <div className="space-y-6">
              {/* Source List */}
              <div className="bg-white rounded-2xl shadow-md p-4">
                <h3 className="font-bold text-neutral-700 mb-3">Medications</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {medications.map(med => (
                    <DraggableMedicine key={med.id} med={med} />
                  ))}
                  {medications.length === 0 && <p className="text-neutral-500 text-sm">No medications found.</p>}
                </div>
              </div>

              {/* Target Days */}
              <div className="bg-white rounded-2xl shadow-md p-4">
                <h3 className="font-bold text-neutral-700 mb-4">Weekly Schedule</h3>
                <div className="flex gap-3 overflow-x-auto pb-4 snap-x">
                  {DAYS.map(day => (
                    <div key={day} className="snap-center">
                      <DayColumn 
                        day={day} 
                        scheduledMeds={weekSchedule[day] || []} 
                        onDrop={(item) => handleDayDrop(day, item)}
                        onRemove={(medId) => handleRemoveFromDay(day, medId)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}