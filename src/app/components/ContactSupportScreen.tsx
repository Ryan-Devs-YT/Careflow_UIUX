import { useState } from 'react';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface ContactSupportScreenProps {
  onBack: () => void;
}

export function ContactSupportScreen({ onBack }: ContactSupportScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    query: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.query) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Inquiry sent successfully!');
      onBack();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <div className="bg-healing-sage-500 text-white p-6 sticky top-0 z-10 shadow-md">
        <button onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg">Back</span>
        </button>
        <h1 className="text-3xl font-bold">Contact Support</h1>
        <p className="text-healing-sage-100">We're here to help</p>
      </div>

      <div className="p-6">
        <motion.div 
          className="bg-white rounded-2xl shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6 text-neutral-600">
            <MessageCircle className="w-6 h-6" />
            <p>Send us your question and we'll reply to your email.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Your Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-healing-sage-500 outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Your Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-healing-sage-500 outline-none transition-colors"
                placeholder="65"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Your Query</label>
              <textarea
                value={formData.query}
                onChange={e => setFormData({...formData, query: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-healing-sage-500 outline-none transition-colors min-h-[150px]"
                placeholder="How can we help you today?"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-healing-sage-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-healing-sage-600 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Sending...' : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Inquiry
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
