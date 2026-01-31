import { useState } from 'react';
import { ArrowLeft, Type, Minus, Plus, Monitor } from 'lucide-react';
import { motion } from 'motion/react';

interface Settings {
  fontSize: number;
}

interface SettingsScreenProps {
  onBack: () => void;
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
}

export function SettingsScreen({ onBack, settings, onUpdateSettings }: SettingsScreenProps) {
  // We use a percentage for display (16px = 100%)
  const percentage = Math.round((settings.fontSize / 16) * 100);

  const handleSizeChange = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, settings.fontSize + delta));
    onUpdateSettings({ ...settings, fontSize: newSize });
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-healing-sage-500 text-white p-6 sticky top-0 z-10 shadow-md">
        <button onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg">Back</span>
        </button>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-healing-sage-100">Customize your experience</p>
      </div>

      <div className="p-6 space-y-8">
        {/* App Scaling Section */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-healing-sage-100 rounded-full flex items-center justify-center text-healing-sage-700">
              <Type className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-neutral-700">App Scaling</h2>
          </div>

          <p className="text-neutral-500 mb-6">
            Adjust the size of text, buttons, and icons to make the app easier to read.
          </p>

          <div className="flex items-center justify-between gap-4 mb-4">
            <button 
              onClick={() => handleSizeChange(-1)}
              className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center hover:bg-neutral-200 transition-colors"
              aria-label="Decrease size"
            >
              <Minus className="w-5 h-5 text-neutral-600" />
            </button>
            <div className="flex-1 text-center">
              <span className="text-3xl font-bold text-healing-sage-600">{percentage}%</span>
            </div>
            <button 
              onClick={() => handleSizeChange(1)}
              className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center hover:bg-neutral-200 transition-colors"
              aria-label="Increase size"
            >
              <Plus className="w-5 h-5 text-neutral-600" />
            </button>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 transition-all duration-300">
            <p className="text-neutral-700 mb-2">Preview:</p>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-neutral-100">
                <h3 className="font-bold text-neutral-800">Hello, CareFlow!</h3>
                <p className="text-neutral-600">This is how your content will appear.</p>
                <button className="mt-2 bg-healing-sage-500 text-white px-4 py-2 rounded-lg">Button</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}