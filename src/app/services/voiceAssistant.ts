import { Medicine } from '@/app/data/medicines';

export class VoiceAssistant {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private enabled: boolean = false;

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
    
    // Wait for voices to be loaded
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = this.loadVoices.bind(this);
    }
  }

  private loadVoices(): void {
    this.voices = this.synth.getVoices();
    this.enabled = this.voices.length > 0;
  }

  async requestPermission(): Promise<boolean> {
    // Speech synthesis doesn't need explicit permission in most browsers
    this.enabled = 'speechSynthesis' in window && this.voices.length > 0;
    return this.enabled;
  }

  speakMedicationReminder(medicine: Medicine, description?: string): void {
    if (!this.enabled) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    const timingContext = this.getTimingContext(description);
    const voiceText = this.generateMedicationVoiceText(medicine, timingContext);

    const utterance = new SpeechSynthesisUtterance(voiceText);
    
    // Configure voice settings
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.1; // Slightly higher pitch for friendly tone
    utterance.volume = 0.8;

    // Try to use a pleasant female voice if available
    const preferredVoice = this.voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Karen') ||
      voice.name.includes('Google')
    ) || this.voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.synth.speak(utterance);
  }

  private getTimingContext(description?: string): string {
    if (!description) return '';
    
    const desc = description.toLowerCase();
    
    if (desc.includes('breakfast')) return 'with your breakfast';
    if (desc.includes('lunch')) return 'with your lunch';
    if (desc.includes('dinner')) return 'with your dinner';
    if (desc.includes('coffee')) return 'with your morning coffee';
    if (desc.includes('bedtime') || desc.includes('night')) return 'before bedtime';
    if (desc.includes('morning')) return 'this morning';
    if (desc.includes('afternoon')) return 'this afternoon';
    if (desc.includes('evening')) return 'this evening';
    
    return '';
  }

  private generateMedicationVoiceText(medicine: Medicine, timingContext: string): string {
    const sizeDesc = medicine.size === 'small' ? 'small' : medicine.size === 'large' ? 'large' : '';
    const colorDesc = medicine.color || 'white';
    const shapeDesc = medicine.shape === 'round' ? 'round' : medicine.shape === 'capsule' ? 'capsule' : 'oval';
    
    let message = 'Time to take your medication.';
    
    if (sizeDesc) {
      message += ` Take the ${sizeDesc} ${colorDesc} ${shapeDesc} pill.`;
    } else {
      message += ` Take your ${medicine.name}.`;
    }
    
    if (timingContext) {
      message += ` ${timingContext.charAt(0).toUpperCase() + timingContext.slice(1)}.`;
    }
    
    // Add health encouragement
    const encouragements = [
      'Taking care of yourself is important!',
      'Your health matters!',
      'Stay consistent with your treatment!',
      'You\'re doing great with your health routine!'
    ];
    
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    message += ` ${randomEncouragement}`;
    
    return message;
  }

  speakMedicineTaken(medicineName: string): void {
    if (!this.enabled) return;

    this.synth.cancel();

    const messages = [
      `Great job taking ${medicineName}!`,
      `${medicineName} taken. Well done!`,
      `Excellent! ${medicineName} has been taken.`,
      `Good work! You remembered to take ${medicineName}.`
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    const utterance = new SpeechSynthesisUtterance(randomMessage);
    utterance.rate = 1.0;
    utterance.pitch = 1.2;
    utterance.volume = 0.7;

    const preferredVoice = this.voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Karen')
    ) || this.voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.synth.speak(utterance);
  }

  speakReminder(): void {
    if (!this.enabled) return;

    this.synth.cancel();

    const messages = [
      'It\'s time for your medication reminder.',
      'Don\'t forget to take your scheduled medication.',
      'This is your medication reminder.',
      'Time to check your medication schedule.'
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    const utterance = new SpeechSynthesisUtterance(randomMessage);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.6;

    this.synth.speak(utterance);
  }

  stop(): void {
    this.synth.cancel();
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

// Global voice assistant instance
export const voiceAssistant = new VoiceAssistant();