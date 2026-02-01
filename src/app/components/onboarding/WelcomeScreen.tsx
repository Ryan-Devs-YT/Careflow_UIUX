import { Pill, ShieldCheck, Heart, Camera, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef } from 'react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSkip: () => void;
}

export function WelcomeScreen({ onGetStarted, onSkip }: WelcomeScreenProps) {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfilePic(url);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6 flex flex-col items-center justify-between">
      <div className="w-full flex justify-end">
        <button onClick={onSkip} className="text-neutral-400 font-bold uppercase tracking-widest text-xs hover:text-neutral-600 transition-colors">Skip</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        <div className="relative mb-10 group">
          <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden border-4 border-healing-sage-100">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Heart className="w-12 h-12 text-healing-sage-500 fill-healing-sage-100" />
            )}
          </div>
          <button 
            onClick={handleCameraClick}
            className="absolute bottom-0 right-0 w-10 h-10 bg-healing-sage-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white hover:scale-110 transition-transform active:scale-95"
          >
            <Camera className="w-5 h-5" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        <h1 className="text-4xl font-black text-neutral-800 text-center mb-4 leading-tight font-secondary">CareFlow</h1>
        <p className="text-neutral-500 text-center mb-12 text-lg leading-relaxed">
          Your personal health companion. Simple, easy, and built for your routine.
        </p>

        <div className="grid grid-cols-2 gap-4 w-full mb-12">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center text-center">
            <Pill className="w-6 h-6 text-healing-sage-500 mb-2" />
            <span className="text-xs font-bold text-neutral-600">Meds Track</span>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center text-center">
            <ShieldCheck className="w-6 h-6 text-healing-sage-500 mb-2" />
            <span className="text-xs font-bold text-neutral-600">Care Circle</span>
          </div>
        </div>
      </div>

      <button
        onClick={onGetStarted}
        className="w-full max-w-sm py-5 bg-healing-sage-500 text-white rounded-3xl font-black text-xl hover:bg-healing-sage-600 transition-all shadow-xl active:scale-95 mb-4"
      >
        Get Started
      </button>
    </div>
  );
}