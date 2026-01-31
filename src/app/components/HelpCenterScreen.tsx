import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQ {
  question: string;
  answer: string;
}

interface HelpCenterScreenProps {
  onBack: () => void;
}

const FAQS: FAQ[] = [
  {
    question: "How do I make the text bigger?",
    answer: "Go to the main menu (tap the 3 dots in the top right), select 'Settings', and use the + and - buttons under 'App Scaling' to adjust the text size."
  },
  {
    question: "How do I add a new medicine?",
    answer: "Go to the 'Prescription' screen and tap the large green 'Add Medicine' button. You can search for your medicine name there."
  },
  {
    question: "What if I miss a dose?",
    answer: "Don't worry. If it's close to your next dose, skip the missed one. Otherwise, take it as soon as you remember. You can mark it as taken late in the app."
  },
  {
    question: "How do I invite my daughter/son?",
    answer: "Go to the main menu, tap 'CareGiver Permission', search for their name or email, and tap 'Invite'. They will get an email to join."
  },
  {
    question: "Is my data safe?",
    answer: "Yes, your health data is private and only shared with the caregivers you explicitly invite."
  }
];

export function HelpCenterScreen({ onBack }: HelpCenterScreenProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <div className="bg-healing-sage-500 text-white p-6 sticky top-0 z-10 shadow-md">
        <button onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg">Back</span>
        </button>
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p className="text-healing-sage-100">Common Questions</p>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 p-4 bg-healing-sage-100 rounded-xl mb-6">
          <HelpCircle className="w-8 h-8 text-healing-sage-600" />
          <p className="text-healing-sage-800 text-sm font-medium">
            Here are some answers to common questions from our community.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-neutral-800 text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                )}
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 text-neutral-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
