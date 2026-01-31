import { useState } from 'react';
import { ArrowLeft, TrendingUp, Calendar, Trees } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface MedicationAdherence {
  name: string;
  adherence: number;
}

interface AnaliticalsScreenProps {
  onBack: () => void;
  adherenceRate: number;
  missedDoses: number;
  medicationAdherence: MedicationAdherence[];
  forestTrees: number;
}

export function AnaliticalsScreen({
  onBack,
  adherenceRate,
  missedDoses,
  medicationAdherence,
  forestTrees,
}: AnaliticalsScreenProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  // Mock data for adherence over time
  const weeklyData = [
    { day: 'Mon', adherence: 95 },
    { day: 'Tue', adherence: 100 },
    { day: 'Wed', adherence: 90 },
    { day: 'Thu', adherence: 100 },
    { day: 'Fri', adherence: 85 },
    { day: 'Sat', adherence: 100 },
    { day: 'Sun', adherence: 95 },
  ];

  const monthlyData = [
    { week: 'Week 1', adherence: 92 },
    { week: 'Week 2', adherence: 88 },
    { week: 'Week 3', adherence: 95 },
    { week: 'Week 4', adherence: 90 },
  ];

  const yearlyData = [
    { month: 'Jan', adherence: 85 },
    { month: 'Feb', adherence: 88 },
    { month: 'Mar', adherence: 92 },
    { month: 'Apr', adherence: 90 },
    { month: 'May', adherence: 95 },
    { month: 'Jun', adherence: 93 },
  ];

  const getChartData = () => {
    switch (selectedPeriod) {
      case 'week': return weeklyData;
      case 'month': return monthlyData;
      case 'year': return yearlyData;
    }
  };

  const COLORS = ['#7BA886', '#E8B27E', '#7BA8C9', '#E8A84E', '#6FA86F'];

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-healing-sage-500 text-white p-6 sticky top-0 z-10 shadow-md">
        <button onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg">Back</span>
        </button>
        <h1 className="text-3xl font-bold">Analyticals</h1>
        <p className="text-healing-sage-100">Your health progress</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Personal Forest (Moved to Top as requested implicitly by importance) */}
        <section>
          <div className="bg-gradient-to-b from-healing-sage-100 to-healing-sage-50 rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trees className="w-8 h-8 text-healing-sage-600" />
              <div>
                <h2 className="text-2xl font-bold text-neutral-700">Your Health Forest</h2>
                <p className="text-neutral-600">Each tree represents a prescription. Keep them green!</p>
              </div>
            </div>

            {/* Forest visualization */}
            <div className="bg-white rounded-xl p-6 mb-4 min-h-[200px] relative overflow-hidden flex items-end justify-center">
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-healing-sage-200 to-transparent pointer-events-none" />
              
              <div className="flex items-end justify-center gap-6 md:gap-8 flex-wrap z-10">
                {medicationAdherence.map((med, index) => {
                  // Logic: < 60% = Pale/Dead, 60-90% = Yellow/Weak, > 90% = Green/Strong
                  let treeColor = 'text-healing-sage-600'; // Green
                  let trunkColor = 'bg-warm-comfort-700';
                  let opacity = 1;
                  let scale = 1;

                  if (med.adherence < 60) {
                      treeColor = 'text-neutral-400'; // Gray
                      trunkColor = 'bg-neutral-400';
                      opacity = 0.6;
                      scale = 0.9;
                  } else if (med.adherence < 90) {
                      treeColor = 'text-warm-comfort-400'; // Yellow/Orange
                      scale = 0.95;
                  }

                  return (
                    <motion.div
                      key={med.name}
                      initial={{ scale: 0, y: 20 }}
                      animate={{ scale: scale, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col items-center group relative"
                    >
                        {/* Tooltip */}
                        <div className="absolute -top-10 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {med.name}: {med.adherence}%
                        </div>

                      {/* Tree Icon */}
                      <div className={`text-6xl ${treeColor} transition-colors duration-500`} style={{ opacity }}>
                        {index % 2 === 0 ? '🌳' : '🌲'}
                      </div>
                      
                      {/* Label */}
                      <p className="text-xs font-medium text-neutral-600 mt-2 max-w-[80px] text-center truncate">{med.name}</p>
                    </motion.div>
                  );
                })}

                {medicationAdherence.length === 0 && (
                  <p className="text-neutral-500 text-center">
                    No active prescriptions to track.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 p-4 bg-white rounded-xl">
              <p className="text-sm text-neutral-600 text-center">
                <span className="font-medium text-healing-sage-700">Emotional Weight:</span> 
                If you neglect your meds, your forest fades. Take care of yourself to keep your forest thriving! 🌱
              </p>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="grid grid-cols-2 gap-4">
          <motion.div
            className="bg-white rounded-2xl shadow-md p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-healing-sage-600" />
              <h3 className="font-semibold text-neutral-600">Adherence Rate</h3>
            </div>
            <p className="text-3xl font-bold text-healing-sage-600">{adherenceRate}%</p>
            <p className="text-sm text-neutral-500 mt-1">Total Average</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl shadow-md p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-error-main" />
              <h3 className="font-semibold text-neutral-600">Missed Doses</h3>
            </div>
            <p className="text-3xl font-bold text-error-main">{missedDoses}</p>
            <p className="text-sm text-neutral-500 mt-1">This month</p>
          </motion.div>
        </section>

        {/* Adherence Rate Graph */}
        <section>
          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-700">Adherence Trend</h2>
              
              <div className="flex gap-2 bg-neutral-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedPeriod('week')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedPeriod === 'week'
                      ? 'bg-white text-neutral-700 shadow-sm'
                      : 'text-neutral-600'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setSelectedPeriod('month')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedPeriod === 'month'
                      ? 'bg-white text-neutral-700 shadow-sm'
                      : 'text-neutral-600'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E8E7" />
                <XAxis 
                  dataKey={selectedPeriod === 'week' ? 'day' : selectedPeriod === 'month' ? 'week' : 'month'} 
                  stroke="#6B7878"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6B7878" 
                  domain={[0, 100]}
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E5E8E7',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="adherence" 
                  stroke="#7BA886" 
                  strokeWidth={3}
                  dot={{ fill: '#7BA886', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}