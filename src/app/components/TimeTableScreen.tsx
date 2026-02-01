import { useState } from 'react';
import { ArrowLeft, Clock, Save, Edit3, Coffee, Sun, Moon, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface MedicationSchedule {
  id: string;
  name: string;
  dosage: string;
  time: string;
  hour: number;
  schedule: string[];
}

interface TimeTableScreenProps {
  onBack: () => void;
  medications: MedicationSchedule[];
  onUpdateSchedule: (id: string, hour: number, days: string[], description?: string) => void;
}

const TIMING_DESCRIPTIONS = [
  { id: 'breakfast', label: 'Breakfast', icon: Utensils, time: 8, description: 'With your morning meal' },
  { id: 'morning-coffee', label: 'Morning Coffee', icon: Coffee, time: 9, description: 'While enjoying coffee' },
  { id: 'lunch', label: 'Lunch', icon: Utensils, time: 12, description: 'With your lunch' },
  { id: 'afternoon', label: 'Afternoon', icon: Sun, time: 15, description: 'Mid-afternoon break' },
  { id: 'dinner', label: 'Dinner', icon: Utensils, time: 18, description: 'With your evening meal' },
  { id: 'bedtime', label: 'Bedtime', icon: Moon, time: 22, description: 'Before going to sleep' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function TimeTableScreen({ onBack, medications, onUpdateSchedule }: TimeTableScreenProps) {
  const [editingMed, setEditingMed] = useState<MedicationSchedule | null>(null);
  const [selectedTiming, setSelectedTiming] = useState(TIMING_DESCRIPTIONS[0]);
  const [selectedDays, setSelectedDays] = useState<string[]>(DAYS);
  const [customTime, setCustomTime] = useState(8);
  const [useCustomTime, setUseCustomTime] = useState(false);

  const handleSave = () => {
    if (editingMed) {
      const hour = useCustomTime ? customTime : selectedTiming.time;
      const description = useCustomTime ? `At ${hour}:00` : selectedTiming.description;
      onUpdateSchedule(editingMed.id, hour, selectedDays, description);
      setEditingMed(null);
      setUseCustomTime(false);
      toast.success('Schedule updated successfully');
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const startEditing = (med: MedicationSchedule) => {
    setEditingMed(med);
    setSelectedDays(med.schedule.length > 0 ? med.schedule : DAYS);
    
    // Find matching timing or use custom
    const matchingTiming = TIMING_DESCRIPTIONS.find(t => t.time === med.hour);
    if (matchingTiming) {
      setSelectedTiming(matchingTiming);
      setUseCustomTime(false);
    } else {
      setCustomTime(med.hour);
      setUseCustomTime(true);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <div className="bg-healing-sage-500 text-white p-6 sticky top-0 z-10 shadow-md">
        <button onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg">Back</span>
        </button>
        <h1 className="text-3xl font-bold font-secondary text-center">Medication Timeline</h1>
      </div>

      <div className="p-6">
        {/* Simple List View */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-700 mb-4">Your Medications</h2>
          <div className="space-y-4">
            {medications.map(med => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-md p-5 border border-neutral-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-neutral-800 text-lg mb-1">{med.name}</h3>
                    <p className="text-neutral-600 font-medium">{med.dosage}</p>
                    {med.schedule.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {med.schedule.map(day => (
                          <span key={day} className="text-xs bg-healing-sage-100 text-healing-sage-700 px-2 py-1 rounded-full font-bold">
                            {day}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => startEditing(med)}
                    className="px-4 py-2 bg-healing-sage-500 text-white rounded-xl font-bold text-sm hover:bg-healing-sage-600 transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Time
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Timing Templates */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-neutral-50 mb-6">
          <h3 className="text-xl font-bold text-neutral-700 mb-4">Quick Setup Templates</h3>
          <div className="grid grid-cols-2 gap-3">
            {TIMING_DESCRIPTIONS.map(timing => {
              const Icon = timing.icon;
              return (
                <button
                  key={timing.id}
                  onClick={() => {
                    setSelectedTiming(timing);
                    setUseCustomTime(false);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedTiming.id === timing.id && !useCustomTime
                      ? 'border-healing-sage-500 bg-healing-sage-50'
                      : 'border-neutral-200 hover:border-healing-sage-300'
                  }`}
                >
                  <Icon className="w-6 h-6 text-healing-sage-600 mb-2 mx-auto" />
                  <p className="font-bold text-neutral-800">{timing.label}</p>
                  <p className="text-xs text-neutral-500 mt-1">{timing.description}</p>
                  <p className="text-sm font-bold text-healing-sage-600 mt-2">{timing.time}:00</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingMed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Schedule: {editingMed.name}</h3>
                <p className="text-neutral-600 mb-6">{editingMed.dosage}</p>

                {/* Timing Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-neutral-700 mb-3">When to take:</label>
                  
                  <div className="space-y-3">
                    {/* Custom Time Option */}
                    <button
                      onClick={() => setUseCustomTime(true)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        useCustomTime
                          ? 'border-healing-sage-500 bg-healing-sage-50'
                          : 'border-neutral-200 hover:border-healing-sage-300'
                      }`}
                    >
                      <p className="font-bold text-neutral-800">Custom Time</p>
                      <input
                        type="range"
                        min="0"
                        max="23"
                        value={customTime}
                        onChange={(e) => setCustomTime(parseInt(e.target.value))}
                        className="w-full mt-2"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <p className="text-sm font-bold text-healing-sage-600 mt-1">{customTime}:00</p>
                    </button>

                    {/* Template Options */}
                    {TIMING_DESCRIPTIONS.map(timing => {
                      const Icon = timing.icon;
                      return (
                        <button
                          key={timing.id}
                          onClick={() => {
                            setSelectedTiming(timing);
                            setUseCustomTime(false);
                          }}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            selectedTiming.id === timing.id && !useCustomTime
                              ? 'border-healing-sage-500 bg-healing-sage-50'
                              : 'border-neutral-200 hover:border-healing-sage-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-healing-sage-600 flex-shrink-0" />
                            <div>
                              <p className="font-bold text-neutral-800">{timing.label}</p>
                              <p className="text-xs text-neutral-500">{timing.description}</p>
                            </div>
                            <span className="text-sm font-bold text-healing-sage-600 ml-auto">
                              {timing.time}:00
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Days Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-neutral-700 mb-3">Days of week:</label>
                  <div className="grid grid-cols-7 gap-2">
                    {DAYS.map(day => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`py-3 rounded-lg text-xs font-bold transition-all ${
                          selectedDays.includes(day)
                            ? 'bg-healing-sage-500 text-white shadow-sm'
                            : 'bg-neutral-50 text-neutral-400 hover:bg-neutral-100'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => setEditingMed(null)} 
                    className="flex-1 py-4 rounded-2xl font-bold bg-neutral-100 text-neutral-500"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave} 
                    className="flex-1 py-4 rounded-2xl font-bold bg-healing-sage-500 text-white shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Schedule
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}