import { motion } from 'motion/react';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { Shield, Lock, Eye, Trash2, Bell, Camera, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Switch } from '@/app/components/ui/switch';

interface PrivacyScreenProps {
  onContinue: (permissions: PermissionSettings) => void;
}

export interface PermissionSettings {
  notifications: boolean;
  camera: boolean;
  location: boolean;
}

export function PrivacyScreen({ onContinue }: PrivacyScreenProps) {
  const [permissions, setPermissions] = useState<PermissionSettings>({
    notifications: true,
    camera: true,
    location: false,
  });

  const privacyPoints = [
    { icon: <Lock className="w-5 h-5" />, text: 'Encrypted end-to-end' },
    { icon: <Eye className="w-5 h-5" />, text: 'You control who sees what' },
    { icon: <Shield className="w-5 h-5" />, text: 'No data selling, ever' },
    { icon: <Trash2 className="w-5 h-5" />, text: 'Delete anytime' },
  ];

  const permissionOptions = [
    {
      key: 'notifications' as keyof PermissionSettings,
      icon: <Bell className="w-6 h-6" />,
      title: 'Notifications',
      description: 'Get reminded when it\'s time to take your medication',
      recommended: true,
    },
    {
      key: 'camera' as keyof PermissionSettings,
      icon: <Camera className="w-6 h-6" />,
      title: 'Camera',
      description: 'Take photos of your medications for easy identification',
      recommended: true,
    },
    {
      key: 'location' as keyof PermissionSettings,
      icon: <MapPin className="w-6 h-6" />,
      title: 'Location (Optional)',
      description: 'Find nearby pharmacies and get refill reminders',
      recommended: false,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col p-6 pb-32">
      {/* Shield Illustration */}
      <motion.div
        className="flex justify-center mt-8 mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div className="w-24 h-24 bg-gradient-to-br from-healing-sage-400 to-healing-sage-600 rounded-[24px] flex items-center justify-center shadow-lg">
          <Shield className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-neutral-700 mb-2">
          Your health data stays yours
        </h1>
        <p className="text-neutral-600">
          Privacy and security built in from day one
        </p>
      </motion.div>

      {/* Privacy Points */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 max-w-2xl mx-auto w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {privacyPoints.map((point, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <div className="text-healing-sage-600">
              {point.icon}
            </div>
            <span className="text-sm text-neutral-700 font-medium">
              {point.text}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Permissions Section */}
      <motion.div
        className="max-w-2xl mx-auto w-full mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-neutral-700 mb-4">
          Permissions Needed
        </h2>
        
        <div className="space-y-3">
          {permissionOptions.map((option, index) => (
            <motion.div
              key={option.key}
              className="bg-white rounded-xl border border-neutral-200 p-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-healing-sage-100 rounded-xl flex items-center justify-center text-healing-sage-600">
                  {option.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-neutral-700">
                      {option.title}
                    </h3>
                    {option.recommended && (
                      <span className="text-xs bg-success-light text-success-dark px-2 py-0.5 rounded-full font-medium">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {option.description}
                  </p>
                </div>

                <Switch
                  checked={permissions[option.key]}
                  onCheckedChange={(checked) =>
                    setPermissions({ ...permissions, [option.key]: checked })
                  }
                  className="flex-shrink-0"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        className="fixed bottom-6 left-6 right-6 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <PrimaryButton
          onClick={() => onContinue(permissions)}
          fullWidth
        >
          Continue
        </PrimaryButton>
      </motion.div>
    </div>
  );
}
