import { ChevronRight, Pill, Calendar, Clock, MessageSquare, Users, BarChart3, MoreVertical, Settings, UserPlus, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
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
  description?: string;
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

  const cardNavItems = [
    {
      label: "Permissions",
      bgColor: "#0f766e",
      textColor: "#fff",
      links: [
        { label: "CareGiver Permission", onClick: () => onNavigate('caregiver-permission') },
        { label: "Revoke Access", onClick: () => onNavigate('revoke-access') }
      ]
    },
    {
      label: "Account",
      bgColor: "#111827",
      textColor: "#fff",
      links: [
        { label: "Settings", onClick: () => onNavigate('settings') },
        { label: "Profile", onClick: () => onNavigate('profile') }
      ]
    },
    {
      label: "Support",
      bgColor: "#4b5563",
      textColor: "#fff",
      links: [
        { label: "Help Center", onClick: () => onNavigate('help-center') },
        { label: "Contact Us", onClick: () => onNavigate('contact-support') }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-primary text-primary-foreground p-6 pb-8 rounded-b-3xl shadow-lg relative">
        <div className="flex items-center justify-between mb-6">
          <div className="w-8" />
          <SplitText
            text="CareFlow"
            className="text-3xl font-bold text-center"
            delay={50}
            duration={1.25}
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
          />
          <CardNav
            items={cardNavItems}
            buttonBgColor="transparent"
            buttonTextColor="white"
          />
        </div>

        <div className="flex justify-center mb-6">
          <PillNav
            items={[
              { label: 'Main', id: 'main' },
              { label: 'CareGiver Hub', id: 'hub' }
            ]}
            activeId={activeTab}
            onSelect={(id) => {
              if (id === 'hub') {
                onNavigate('caregiver-hub');
              } else {
                setActiveTab(id);
              }
            }}
            baseColor="#e0f2f1"
            pillColor="#ffffff"
            pillTextColor="#0f766e"
            hoveredPillTextColor="#ffffff"
            className="scale-110"
          />
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-inner">
          <h2 className="text-2xl font-semibold text-white mb-1">Good Day, {userName}!</h2>
          <p className="text-healing-sage-100 text-lg">You have {todayMedications.length} items left for today. 🌿</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'main' ? (
          <motion.div key="main" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="px-6 -mt-6 relative z-10">
              <motion.div className="bg-card rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Today's Medication</h2>

                {todayMedications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">All done for today! 🎉</p>
                ) : (
                  <div className="flex overflow-x-auto gap-4 pb-4 snap-x -mx-2 px-2">
                    <AnimatePresence mode="popLayout">
                      {todayMedications.map((med) => (
                        <motion.div
                          key={med.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, x: -100, scale: 0.5 }}
                          transition={{ type: "spring", stiffness: 200, damping: 20 }}
                          className="min-w-[280px] snap-center flex-shrink-0 flex flex-col justify-between p-5 rounded-xl border-2 shadow-sm bg-background border-border"
                        >
                          <div className="mb-4">
                            <h3 className="font-semibold text-foreground text-lg mb-1">{med.name}</h3>
                            <p className="text-muted-foreground font-medium">{med.time}</p>
                            <p className="text-muted-foreground text-sm">{med.dosage}</p>
                            {med.description && <p className="text-xs text-muted-foreground/80 mt-2 italic">"{med.description}"</p>}
                          </div>

                          <button
                            onClick={() => onMarkTaken(med.id)}
                            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-bold text-lg active:scale-95 shadow-sm"
                          >
                            Take
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            </div>

            <div className="px-6 mt-6">
              <AnimatedList
                items={menuItems}
                onItemSelect={(item) => onNavigate(item.id)}
                renderItem={(item) => (
                  <div className="flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors cursor-pointer rounded-xl">
                    <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center flex-shrink-0`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{item.label}</h3>
                        {item.hasAlert && <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />}
                      </div>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                )}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div key="hub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-6 pt-10">
            <div className="w-20 h-20 bg-healing-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartHandshake className="w-10 h-10 text-healing-sage-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">CareGiver Hub</h2>
            <p className="text-muted-foreground mb-6">Manage your family's health from one place.</p>

            <button
              onClick={() => onNavigate('caregiver-hub')}
              className="w-full bg-primary text-primary-foreground rounded-2xl shadow-lg p-5 flex items-center justify-center gap-3 hover:bg-primary/90 transition-all font-bold text-xl active:scale-95"
            >
              <HeartHandshake className="w-7 h-7" />
              Open CareGiver Hub
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
