import { ChevronRight, Pill, Calendar, Clock, MessageSquare, Users, BarChart3, MoreVertical, Settings, UserPlus, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import SplitText from "@/app/components/ui/SplitText";
import PillNav from "@/app/components/ui/PillNav";
import AnimatedList from "@/app/components/ui/AnimatedList";
import CardNav from "@/app/components/ui/CardNav";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

interface HomeScreenProps {
  userName: string;
  todayMedications: Medication[];
  onNavigate: (section: string) => void;
  onMarkTaken: (id: string) => void;
  hasRefillAlert?: boolean;
}

export function HomeScreen({ 
  userName, 
  todayMedications, 
  onNavigate, 
  onMarkTaken,
  hasRefillAlert = false 
}: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState('main');

  const menuItems = [
    { 
      id: 'prescription', 
      icon: Pill, 
      label: 'Prescription', 
      description: 'Manage current medications',
      color: 'bg-healing-sage-100 text-healing-sage-700',
      hasAlert: hasRefillAlert
    },
    { 
      id: 'timetable', 
      icon: Clock, 
      label: 'Time Table', 
      description: 'Schedule medications',
      color: 'bg-info-light text-info-dark'
    },
    { 
      id: 'appointments', 
      icon: Calendar, 
      label: 'Appointments', 
      description: 'Upcoming events',
      color: 'bg-warm-comfort-100 text-warm-comfort-600'
    },
    { 
      id: 'pharmacist', 
      icon: MessageSquare, 
      label: 'Pharmacist', 
      description: 'Chat for refills',
      color: 'bg-success-light text-success-dark'
    },
    { 
      id: 'caregivers', 
      icon: Users, 
      label: 'My CareGivers', 
      description: 'Family & guardians',
      color: 'bg-warm-comfort-200 text-warm-comfort-600'
    },
    { 
      id: 'analyticals', 
      icon: BarChart3, 
      label: 'Analyticals', 
      description: 'Progress & insights',
      color: 'bg-healing-sage-200 text-healing-sage-700'
    },
  ];

  // Config for CardNav
  const cardNavItems = [
    {
      label: "Permissions",
      bgColor: "#0f766e", // Teal
      textColor: "#fff",
      links: [
        { label: "CareGiver Permission", onClick: () => onNavigate('caregiver-permission') },
        { label: "Revoke Access", onClick: () => onNavigate('revoke-access') }
      ]
    },
    {
      label: "Account",
      bgColor: "#111827", // Gray 900
      textColor: "#fff",
      links: [
        { label: "Settings", onClick: () => onNavigate('settings') },
        { label: "Profile", onClick: () => console.log('Profile') }
      ]
    },
    {
      label: "Support",
      bgColor: "#4b5563", // Gray 600
      textColor: "#fff",
      links: [
        { label: "Help Center", onClick: () => onNavigate('help-center') },
        { label: "Contact Us", onClick: () => onNavigate('contact-support') }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-healing-sage-500 text-white p-6 pb-8 rounded-b-3xl shadow-lg relative">
        <div className="flex items-center justify-between mb-6">
          {/* Invisible spacer for centering */}
          <div className="w-8" />
          
          <SplitText 
            text="CareFlow"
            className="text-3xl font-bold text-center"
            delay={50}
            duration={1.25}
            ease="circOut"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
          />
          
          <CardNav 
            items={cardNavItems}
            buttonBgColor="transparent"
            buttonTextColor="white"
          />
        </div>

        {/* Navigation Pills (Visual Switcher) */}
        <div className="flex justify-center mb-6">
            <PillNav
                items={[
                    { label: 'Main', id: 'main' },
                    { label: 'CareGiver Hub', id: 'hub' }
                ]}
                activeId={activeTab}
                onSelect={(id) => setActiveTab(id)}
                baseColor="#e0f2f1"
                pillColor="#ffffff"
                pillTextColor="#0f766e"
                hoveredPillTextColor="#ffffff"
                className="scale-110" // Make larger as requested
            />
        </div>
        
        {/* Greeting Box */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-inner">
           <h2 className="text-2xl font-semibold text-white mb-1">Good Morning, {userName}!</h2>
           <p className="text-healing-sage-100 text-lg">Hope you're feeling wonderful today. 🌿</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'main' ? (
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Today's Medication Section */}
            <div className="px-6 -mt-6 relative z-10">
              <motion.div 
                className="bg-white rounded-2xl shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-2xl font-bold text-neutral-700 mb-4">Today's Medication</h2>
                
                {todayMedications.length === 0 ? (
                  <p className="text-neutral-500 text-center py-4">No medications scheduled for today</p>
                ) : (
                  <div className="flex overflow-x-auto gap-4 pb-4 snap-x -mx-2 px-2">
                    {todayMedications.map((med, index) => (
                      <motion.div
                        key={med.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`min-w-[280px] snap-center flex-shrink-0 flex flex-col justify-between p-5 rounded-xl border-2 shadow-sm ${
                          med.taken 
                            ? 'bg-success-light border-success-main' 
                            : 'bg-neutral-50 border-neutral-200'
                        }`}
                      >
                        <div className="mb-4">
                          <h3 className="font-semibold text-neutral-700 text-lg mb-1">{med.name}</h3>
                          <p className="text-neutral-600 font-medium">{med.time}</p>
                          <p className="text-neutral-500 text-sm">{med.dosage}</p>
                        </div>
                        
                        {!med.taken ? (
                          <button
                            onClick={() => onMarkTaken(med.id)}
                            className="w-full py-2 bg-healing-sage-500 text-white rounded-lg hover:bg-healing-sage-600 transition-colors font-medium"
                          >
                            Take Now
                          </button>
                        ) : (
                          <div className="w-full py-2 flex items-center justify-center gap-2 text-success-dark font-medium bg-white/50 rounded-lg">
                            <span>✓ Taken</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Menu List */}
            <div className="px-6 mt-6">
              <AnimatedList
                  items={menuItems}
                  onItemSelect={(item) => onNavigate(item.id)}
                  renderItem={(item, index) => {
                      const Icon = item.icon;
                      return (
                          <div className="flex items-center gap-4 p-5 hover:bg-neutral-50 transition-colors">
                              <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center flex-shrink-0`}>
                                  <Icon className="w-6 h-6" />
                              </div>
                              
                              <div className="flex-1 text-left">
                                  <div className="flex items-center gap-2">
                                      <h3 className="font-semibold text-neutral-700">{item.label}</h3>
                                      {item.hasAlert && (
                                          <div className="w-2 h-2 bg-error-main rounded-full animate-pulse" />
                                      )}
                                  </div>
                                  <p className="text-neutral-500 text-sm">{item.description}</p>
                              </div>
                              
                              <ChevronRight className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                          </div>
                      );
                  }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
             key="hub"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="p-6 pt-10 text-center"
          >
             <div className="w-20 h-20 bg-healing-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartHandshake className="w-10 h-10 text-healing-sage-600" />
             </div>
             <h2 className="text-2xl font-bold text-neutral-700 mb-2">CareGiver Hub</h2>
             <p className="text-neutral-600">
               Connect with your family and doctors here. <br/>
               (Upcoming features will appear here)
             </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}