import { useState } from 'react';
import { ArrowLeft, Type, Minus, Plus, Monitor, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';

interface Settings {
  fontSize: number;
  theme: 'light' | 'dark' | 'auto';
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
    <div className="min-h-screen bg-background pb-24">
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
        <section className="bg-card rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-healing-sage-100 rounded-full flex items-center justify-center text-healing-sage-700">
              <Type className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">App Scaling</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Adjust the size of text, buttons, and icons to make the app easier to read.
          </p>

          <div className="flex items-center justify-between gap-4 mb-4">
            <button
              onClick={() => handleSizeChange(-1)}
              className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center hover:bg-muted/80 transition-colors"
              aria-label="Decrease size"
            >
              <Minus className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex-1 text-center">
              <span className="text-3xl font-bold text-primary">{percentage}%</span>
            </div>
            <button
              onClick={() => handleSizeChange(1)}
              className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center hover:bg-muted/80 transition-colors"
              aria-label="Increase size"
            >
              <Plus className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="p-4 bg-background rounded-xl border border-border transition-all duration-300">
            <p className="text-foreground mb-2">Preview:</p>
            <div className="bg-card p-3 rounded-lg shadow-sm border border-border">
              <h3 className="font-bold text-foreground">Hello, CareFlow!</h3>
              <p className="text-muted-foreground">This is how your content will appear.</p>
              <button className="mt-2 bg-healing-sage-500 text-white px-4 py-2 rounded-lg">Button</button>
            </div>
          </div>
        </section>

        {/* Theme Section */}
        <section className="bg-card rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700">
              <Monitor className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Theme</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Choose your preferred color scheme for the app.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {/* Light Theme */}
            <button
              onClick={() => onUpdateSettings({ ...settings, theme: 'light' })}
              className={`p-4 rounded-xl border-2 transition-all ${settings.theme === 'light'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
                }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Sun className="w-6 h-6 text-yellow-500" />
                </div>
                <span className="font-medium text-foreground">Light</span>
              </div>
            </button>

            {/* Dark Theme */}
            <button
              onClick={() => onUpdateSettings({ ...settings, theme: 'dark' })}
              className={`p-4 rounded-xl border-2 transition-all ${settings.theme === 'dark'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
                }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center shadow-md">
                  <Moon className="w-6 h-6 text-blue-300" />
                </div>
                <span className="font-medium text-foreground">Dark</span>
              </div>
            </button>

            {/* Auto Theme */}
            <button
              onClick={() => onUpdateSettings({ ...settings, theme: 'auto' })}
              className={`p-4 rounded-xl border-2 transition-all ${settings.theme === 'auto'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
                }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gradient-to-br from-white to-neutral-800 rounded-full flex items-center justify-center shadow-md">
                  <Monitor className="w-6 h-6 text-neutral-600" />
                </div>
                <span className="font-medium text-foreground">Auto</span>
              </div>
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {settings.theme === 'light' && '☀️ Light mode is active'}
              {settings.theme === 'dark' && '🌙 Dark mode is active'}
              {settings.theme === 'auto' && '🔄 Theme follows your system preferences'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}