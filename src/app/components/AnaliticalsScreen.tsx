import { useState } from 'react';
import { ArrowLeft, TrendingUp, Calendar, Trees } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Forest } from './ui/TreeIcon';
import { storage } from '@/app/utils/storage';

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

  // Load adherence history from storage
  const [adherenceHistory] = useState(() => {
    const data = storage.get();
    return data?.adherenceHistory || [];
  });

  // Mock data for adherence over time - enhanced with real data
  const weeklyData = adherenceHistory.slice(0, 7).reverse().map((record, index) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][new Date(record.date).getDay()] || `Day ${index + 1}`,
    adherence: Math.round((record.taken / record.total) * 100)
  })).concat(
    adherenceHistory.length === 0 ? [
      { day: 'Mon', adherence: 95 },
      { day: 'Tue', adherence: 100 },
      { day: 'Wed', adherence: 90 },
      { day: 'Thu', adherence: 100 },
      { day: 'Fri', adherence: 85 },
      { day: 'Sat', adherence: 100 },
      { day: 'Sun', adherence: 95 },
    ] : []
  );

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
      case 'week': return weeklyData.slice(-7);
      case 'month': return monthlyData;
      case 'year': return yearlyData;
    }
  };

  const COLORS = ['#7BA886', '#E8B27E', '#7BA8C9', '#E8A84E', '#6FA86F'];

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header - Fixed z-index and proper spacing */}
      <div className="bg-healing-sage-500 text-white p-6 sticky top-0 z-50 shadow-md">
        <button onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg">Back</span>
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-1">Analytics</h1>
          <p className="text-healing-sage-100">Your health progress</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Personal Forest - Enhanced with better forest visualization */}
        <section>
          <div className="bg-gradient-to-b from-healing-sage-100 to-healing-sage-50 rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trees className="w-8 h-8 text-healing-sage-600" />
              <div>
                <h2 className="text-2xl font-bold text-neutral-700">Your Health Forest</h2>
                <p className="text-neutral-600">High adherence = Lush green forest 🌲</p>
              </div>
            </div>

            {/* Enhanced Forest Visualization */}
            <div className="bg-white rounded-xl p-6 mb-4 min-h-[250px] relative overflow-hidden">
              {/* Ground gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-100 via-green-50 to-transparent pointer-events-none" />
              
              {/* Forest container */}
              <div className="relative z-10">
                <Forest 
                  trees={medicationAdherence.length > 0 ? medicationAdherence : [
                    { name: 'Sample', adherence: adherenceRate }
                  ]} 
                  className="py-4"
                />
                
                {/* Forest density indicator */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-neutral-600">
                    <span className="font-semibold">Forest Density:</span>{' '}
                    <span className={`font-bold ${
                      medicationAdherence.length >= 5 ? 'text-green-600' :
                      medicationAdherence.length >= 3 ? 'text-yellow-600' :
                      'text-gray-500'
                    }`}>
                      {medicationAdherence.length >= 5 ? 'Dense 🌳🌳🌳' :
                       medicationAdherence.length >= 3 ? 'Growing 🌳🌳' :
                       'Just starting 🌱'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-white rounded-xl">
              <p className="text-sm text-neutral-600 text-center">
                <span className="font-medium text-healing-sage-700">Your Forest Grows With Adherence!</span>{' '}
                {adherenceRate >= 90 ? 'Excellent work! Your forest is thriving! 🌲' :
                 adherenceRate >= 70 ? 'Good progress! Keep taking your medications! 🌳' :
                 'Your forest needs care. Stay consistent! 🌱'}
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
              <h3 className="font-semibold text-neutral-600">Adherence</h3>
            </div>
            <p className="text-3xl font-bold text-healing-sage-600">{adherenceRate}%</p>
            <p className="text-sm text-neutral-500 mt-1">Overall rate</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl shadow-md p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-error-main" />
              <h3 className="font-semibold text-neutral-600">Missed</h3>
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