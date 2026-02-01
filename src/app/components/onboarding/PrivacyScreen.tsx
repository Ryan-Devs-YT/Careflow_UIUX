import { Bell, Camera, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export interface PermissionSettings {
  notifications: boolean;
  camera: boolean;
  timeCheck: boolean;
}

interface PrivacyScreenProps {
  onContinue: (permissions: PermissionSettings) => void;
}

export function PrivacyScreen({ onContinue }: PrivacyScreenProps) {
  const [permissions, setPermissions] = useState<PermissionSettings>({
    notifications: true,
    camera: true,
    timeCheck: true,
  });

  const togglePermission = (key: keyof PermissionSettings) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6 flex flex-col items-center justify-center">
      <div className="w-20 h-20 bg-healing-sage-100 rounded-full flex items-center justify-center mb-8">
        <ShieldCheck className="w-10 h-10 text-healing-sage-600" />
      </div>

      <h1 className="text-3xl font-bold text-neutral-800 text-center mb-4 font-secondary">Your Privacy</h1>
      <p className="text-neutral-600 text-center mb-10 max-w-sm">
        We need a few permissions to help you stay on track with your health routine.
      </p>

      <div className="w-full max-w-md space-y-4 mb-10">
        <PermissionToggle
          icon={Bell}
          title="Notifications"
          description="To remind you when it's time for your medication"
          isEnabled={permissions.notifications}
          onToggle={() => togglePermission('notifications')}
        />
        <PermissionToggle
          icon={Camera}
          title="Camera & Gallery"
          description="To scan prescriptions and set your profile picture"
          isEnabled={permissions.camera}
          onToggle={() => togglePermission('camera')}
        />
        <PermissionToggle
          icon={Clock}
          title="Time Check"
          description="To sync with your local time for accurate reminders"
          isEnabled={permissions.timeCheck}
          onToggle={() => togglePermission('timeCheck')}
        />
      </div>

      <button
        onClick={() => onContinue(permissions)}
        className="w-full max-w-md py-4 bg-healing-sage-500 text-white rounded-2xl font-bold text-lg hover:bg-healing-sage-600 transition-all shadow-md active:scale-95"
      >
        Continue
      </button>
    </div>
  );
}

function PermissionToggle({ 
  icon: Icon, 
  title, 
  description, 
  isEnabled, 
  onToggle 
}: { 
  icon: any, 
  title: string, 
  description: string, 
  isEnabled: boolean, 
  onToggle: () => void 
}) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between gap-4 border border-neutral-100">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-neutral-600" />
        </div>
        <div>
          <h3 className="font-bold text-neutral-800">{title}</h3>
          <p className="text-sm text-neutral-500 leading-tight">{description}</p>
        </div>
      </div>
      
      <button
        onClick={onToggle}
        className={`w-14 h-8 rounded-full transition-colors relative flex-shrink-0 ${
          isEnabled ? 'bg-healing-sage-500' : 'bg-neutral-200'
        }`}
      >
        <motion.div
          animate={{ x: isEnabled ? 26 : 4 }}
          className="absolute top-1 left-0 w-6 h-6 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}