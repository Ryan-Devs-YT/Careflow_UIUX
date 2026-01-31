import { useState } from 'react';
import { ArrowLeft, Plus, Phone, MessageSquare, Mail, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface CareGiver {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  avatar?: string;
  status: 'active' | 'pending';
}

interface FamilyNote {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  isFromUser: boolean;
}

interface MyCareGiverScreenProps {
  onBack: () => void;
  caregivers: CareGiver[];
  onAddCaregiver: (email: string) => void;
}

export function MyCareGiverScreen({ onBack, caregivers, onAddCaregiver }: MyCareGiverScreenProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [familyNotes, setFamilyNotes] = useState<FamilyNote[]>([
    {
      id: '1',
      sender: 'Sarah (Daughter)',
      message: 'Dad, don\'t forget to take your evening medication! Love you ❤️',
      timestamp: new Date(Date.now() - 3600000),
      isFromUser: false,
    },
    {
      id: '2',
      sender: 'You',
      message: 'Thank you dear, I just took them!',
      timestamp: new Date(Date.now() - 1800000),
      isFromUser: true,
    },
  ]);
  const [newNote, setNewNote] = useState('');

  const handleAddCaregiver = () => {
    if (!newEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!newEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    onAddCaregiver(newEmail);
    setNewEmail('');
    setShowAddDialog(false);
    toast.success('Caregiver request sent!');
  };

  const sendFamilyNote = () => {
    if (!newNote.trim()) return;

    const note: FamilyNote = {
      id: Date.now().toString(),
      sender: 'You',
      message: newNote,
      timestamp: new Date(),
      isFromUser: true,
    };

    setFamilyNotes([...familyNotes, note]);
    setNewNote('');
    toast.success('Note sent to all caregivers');
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-healing-sage-500 text-white p-6 sticky top-0 z-10 shadow-md">
        <button onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg">Back</span>
        </button>
        <h1 className="text-3xl font-bold">My CareGivers</h1>
        <p className="text-healing-sage-100">Your support network</p>
      </div>

      <div className="p-6 space-y-6">
        {/* My CareGivers Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-neutral-700">CareGivers</h2>
            <button
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-healing-sage-500 text-white rounded-full hover:bg-healing-sage-600 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>

          <div className="space-y-3">
            {caregivers.map((caregiver, index) => (
              <motion.div
                key={caregiver.id}
                className="bg-white rounded-2xl shadow-md p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-healing-sage-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                    {caregiver.avatar || '👤'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-neutral-700 text-lg">{caregiver.name}</h3>
                      {caregiver.status === 'pending' && (
                        <span className="px-2 py-1 bg-warning-light text-warning-dark text-xs rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-600 mb-3">{caregiver.relationship}</p>
                    
                    <div className="space-y-1 text-sm text-neutral-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{caregiver.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{caregiver.email}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toast.info(`Calling ${caregiver.name}...`)}
                        className="flex-1 py-2 bg-healing-sage-100 text-healing-sage-700 rounded-lg hover:bg-healing-sage-200 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </button>
                      <button
                        onClick={() => toast.info(`Opening chat with ${caregiver.name}`)}
                        className="flex-1 py-2 bg-info-light text-info-dark rounded-lg hover:bg-info-main/20 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {caregivers.length === 0 && (
              <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                <p className="text-neutral-500 mb-4">No caregivers added yet</p>
                <button
                  onClick={() => setShowAddDialog(true)}
                  className="px-6 py-3 bg-healing-sage-500 text-white rounded-full hover:bg-healing-sage-600 transition-colors font-medium"
                >
                  Add Your First Caregiver
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Family Notes Section */}
        <section>
          <h2 className="text-2xl font-bold text-neutral-700 mb-4">Family Notes</h2>
          
          <div className="bg-white rounded-2xl shadow-md p-5">
            {/* Notes list */}
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {familyNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${note.isFromUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${
                    note.isFromUser 
                      ? 'bg-healing-sage-500 text-white rounded-br-sm' 
                      : 'bg-warm-comfort-100 text-neutral-700 rounded-bl-sm'
                  } rounded-2xl px-4 py-3`}>
                    {!note.isFromUser && (
                      <p className="text-xs font-medium mb-1 opacity-80">{note.sender}</p>
                    )}
                    <p className="text-base">{note.message}</p>
                    <p className={`text-xs mt-1 ${
                      note.isFromUser ? 'text-healing-sage-100' : 'text-neutral-600'
                    }`}>
                      {note.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input area */}
            <div className="pt-4 border-t border-neutral-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newNote.trim()) {
                      sendFamilyNote();
                    }
                  }}
                  placeholder="Send a note to all caregivers..."
                  className="flex-1 px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-healing-sage-500 focus:outline-none"
                />
                <button
                  onClick={sendFamilyNote}
                  disabled={!newNote.trim()}
                  className="w-12 h-12 bg-healing-sage-500 text-white rounded-xl flex items-center justify-center hover:bg-healing-sage-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Add Caregiver Dialog */}
      <AnimatePresence>
        {showAddDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowAddDialog(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-6 z-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-neutral-700">Add CareGiver</h3>
                <button
                  onClick={() => setShowAddDialog(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-600" />
                </button>
              </div>

              <p className="text-neutral-600 mb-4">
                Send a caregiver request by email. They'll receive an invitation to join your care circle.
              </p>

              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="caregiver@example.com"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-healing-sage-500 focus:outline-none mb-4"
                autoFocus
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddDialog(false);
                    setNewEmail('');
                  }}
                  className="flex-1 py-3 bg-neutral-200 text-neutral-700 rounded-xl font-medium hover:bg-neutral-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCaregiver}
                  className="flex-1 py-3 bg-healing-sage-500 text-white rounded-xl font-medium hover:bg-healing-sage-600 transition-colors"
                >
                  Send Request
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
