import { TodayMedication } from '@/app/App';
import { generateVoiceDescription } from '@/app/data/medicines';
import { voiceAssistant } from './voiceAssistant';
import { Medicine } from '@/app/data/medicines';

export interface NotificationOptions {
  id: string;
  medicineId: string;
  medicineName: string;
  time: string;
  description?: string;
}

export class NotificationService {
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private notificationsEnabled: boolean = false;

  constructor() {
    // Check if notifications are supported
    if ('Notification' in window) {
      this.requestPermission();
    }
  }

  async requestPermission(): Promise<boolean> {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      this.notificationsEnabled = permission === 'granted';
      return this.notificationsEnabled;
    }
    this.notificationsEnabled = Notification.permission === 'granted';
    return this.notificationsEnabled;
  }

  scheduleNotifications(medications: TodayMedication[]): void {
    // Clear existing timers
    this.clearAllNotifications();

    medications.forEach(med => {
      const [hourStr, minuteStr] = med.time.split(' ')[0].split(':');
      const period = med.time.split(' ')[1];
      
      let hour = parseInt(hourStr);
      const minute = parseInt(minuteStr || '0');
      
      // Convert to 24-hour format
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;

      this.scheduleNotification(med, hour, minute);
    });
  }

  private scheduleNotification(medication: TodayMedication, hour: number, minute: number): void {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    if (timeUntilNotification > 0) {
      const timer = setTimeout(() => {
        this.showNotification(medication);
        // Schedule for next day
        this.scheduleNotification(medication, hour, minute);
      }, timeUntilNotification);

      this.timers.set(medication.id, timer);
    }
  }

  showNotification(medication: TodayMedication): void {
    if (!this.notificationsEnabled) return;

    const description = medication.description || 'Time to take your medication';
    const voiceDesc = generateVoiceDescription({
      id: medication.medicineId,
      name: medication.name,
      dosage: medication.dosage,
      color: 'white',
      size: 'medium',
      shape: 'round',
      description: '',
      usage: '',
      interactions: []
    });

    // Create a mock medicine object for voice assistant
    const mockMedicine: Medicine = {
      id: medication.medicineId,
      name: medication.name,
      dosage: medication.dosage,
      color: 'white',
      size: 'medium',
      shape: 'round',
      description: '',
      usage: '',
      interactions: [],
      timing: 'at'
    };

    // Voice announcement
    voiceAssistant.speakMedicationReminder(mockMedicine, description);

    // Browser notification
    const notification = new Notification('Medicine Reminder - CareFlow', {
      body: `${description}: ${medication.name} (${medication.dosage})`,
      icon: '/favicon.ico',
      tag: medication.id,
      requireInteraction: true,
      actions: [
        {
          action: 'taken',
          title: '✓ Taken'
        },
        {
          action: 'remind',
          title: '⏰ Remind Later'
        },
        {
          action: 'skip',
          title: '✗ Skip Today'
        }
      ]
    });

    // Handle notification actions
    notification.onclick = () => {
      this.handleNotificationAction('taken', medication);
      notification.close();
    };

    // Show custom notification modal
    this.showCustomNotification(medication, voiceDesc, description);
  }

  private showCustomNotification(medication: TodayMedication, voiceDesc: string, description: string): void {
    // Create a custom notification modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm';
    modal.innerHTML = `
      <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
        <div class="text-center mb-6">
          <div class="w-20 h-20 bg-healing-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-4xl">💊</span>
          </div>
          <h3 class="text-2xl font-bold text-neutral-800 mb-2">Medicine Reminder</h3>
          <p class="text-healing-sage-600 font-medium">"${description}"</p>
        </div>
        
        <div class="bg-neutral-50 rounded-xl p-4 mb-6">
          <p class="font-bold text-neutral-800 text-lg mb-1">${medication.name}</p>
          <p class="text-neutral-600">${medication.dosage}</p>
          <p class="text-sm text-neutral-500 mt-2 italic">${voiceDesc}</p>
        </div>
        
        <div class="grid grid-cols-3 gap-3">
          <button class="taken-btn py-3 bg-healing-sage-500 text-white rounded-xl font-bold hover:bg-healing-sage-600 transition-colors">
            ✓ Taken
          </button>
          <button class="remind-btn py-3 bg-warning-main text-white rounded-xl font-bold hover:bg-warning-dark transition-colors">
            ⏰ 15 min
          </button>
          <button class="skip-btn py-3 bg-neutral-200 text-neutral-600 rounded-xl font-bold hover:bg-neutral-300 transition-colors">
            ✗ Skip
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    const takenBtn = modal.querySelector('.taken-btn');
    const remindBtn = modal.querySelector('.remind-btn');
    const skipBtn = modal.querySelector('.skip-btn');

    takenBtn?.addEventListener('click', () => {
      this.handleNotificationAction('taken', medication);
      document.body.removeChild(modal);
    });

    remindBtn?.addEventListener('click', () => {
      this.handleNotificationAction('remind', medication);
      document.body.removeChild(modal);
    });

    skipBtn?.addEventListener('click', () => {
      this.handleNotificationAction('skip', medication);
      document.body.removeChild(modal);
    });

    // Auto-close after 30 seconds
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    }, 30000);
  }

  private handleNotificationAction(action: 'taken' | 'remind' | 'skip', medication: TodayMedication): void {
    // Create caregiver update
    const caregiverUpdate = {
      type: action,
      medication: medication.name,
      time: new Date().toLocaleTimeString(),
      timestamp: new Date(),
      message: this.createCaregiverMessage(action, medication)
    };

    // Emit custom event for the app to handle
    const event = new CustomEvent('medicationNotificationAction', {
      detail: { action, medication, caregiverUpdate }
    });
    window.dispatchEvent(event);

    if (action === 'taken') {
      // Play success sound if available
      this.playSound('success');
      // Voice confirmation
      voiceAssistant.speakMedicineTaken(medication.name);
      // Show forest growth animation
      this.showForestGrowthAnimation();
    } else if (action === 'remind') {
      // Schedule reminder for 15 minutes later
      setTimeout(() => {
        this.showNotification(medication);
      }, 15 * 60 * 1000);
    }
  }

  private createCaregiverMessage(action: string, medication: TodayMedication): string {
    const userName = 'User'; // In real app, this would be the actual user's name
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    switch (action) {
      case 'taken':
        return `${userName} took ${medication.name} at ${time}`;
      case 'skip':
        return `${userName} skipped ${medication.name} at ${time}`;
      default:
        return `${userName} has a medication update at ${time}`;
    }
  }

  private showForestGrowthAnimation(): void {
    // Create and show forest growth animation
    const animationContainer = document.createElement('div');
    animationContainer.id = 'forest-growth-animation';
    document.body.appendChild(animationContainer);

    // Emit event to show animation in React component
    const event = new CustomEvent('showForestGrowth', {});
    window.dispatchEvent(event);

    // Auto-remove animation container after animation completes
    setTimeout(() => {
      if (document.body.contains(animationContainer)) {
        document.body.removeChild(animationContainer);
      }
    }, 3000);
  }

  private playSound(type: 'success' | 'reminder'): void {
    // In a real app, you would play actual sound files
    try {
      const audio = new Audio();
      if (type === 'success') {
        // Create a simple success sound
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
      } else {
        // Create a reminder sound
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
      }
      audio.play().catch(() => {
        // Ignore audio play errors
      });
    } catch (error) {
      // Ignore audio errors
    }
  }

  clearNotification(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  clearAllNotifications(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }

  isEnabled(): boolean {
    return this.notificationsEnabled;
  }
}

// Global notification service instance
export const notificationService = new NotificationService();