import { useState } from 'react';
import { ArrowLeft, Plus, Check, X, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface PotentialCaregiver {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'invited' | 'can_invite' | 'accepted';
}

interface CareGiverPermissionScreenProps {
  onBack: () => void;
  onInvite: (caregiver: PotentialCaregiver) => void;
}

export function CareGiverPermissionScreen({ onBack, onInvite }: CareGiverPermissionScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [potentialContacts, setPotentialContacts] = useState<PotentialCaregiver[]>([
    { id: '1', name: 'Dr. Smith', email: 'dr.smith@clinic.com', status: 'can_invite', avatar: '👨‍⚕️' },
    { id: '2', name: 'Aunt Martha', email: 'martha@family.com', status: 'can_invite', avatar: '👵' },
    { id: '3', name: 'Cousin Vinny', email: 'vinny@family.com', status: 'invited', avatar: '👨' },
    { id: '4', name: 'Nurse Joy', email: 'joy@hospital.com', status: 'can_invite', avatar: '👩‍⚕️' },
  ]);

  const handleInvite = (contact: PotentialCaregiver) => {
    setPotentialContacts(prev => prev.map(c => 
      c.id === contact.id ? { ...c, status: 'invited' } : c
    ));
    onInvite(contact);
    toast.success(`Invitation sent to ${contact.name}`);
  };

  const filteredContacts = potentialContacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-healing-sage-500 text-white p-6 sticky top-0 z-10 shadow-md">
        <button onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg">Back</span>
        </button>
        <h1 className="text-3xl font-bold">CareGiver Permissions</h1>
        <p className="text-healing-sage-100">Manage who can view your health data</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts..."
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-neutral-200 rounded-xl focus:border-healing-sage-500 focus:outline-none"
          />
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredContacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-healing-sage-100 rounded-full flex items-center justify-center text-xl">
                  {contact.avatar || '👤'}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-700">{contact.name}</h3>
                  <p className="text-sm text-neutral-500">{contact.email}</p>
                </div>
              </div>

              {contact.status === 'can_invite' ? (
                <button
                  onClick={() => handleInvite(contact)}
                  className="px-4 py-2 bg-healing-sage-500 text-white rounded-lg font-medium hover:bg-healing-sage-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Invite
                </button>
              ) : (
                <span className="px-4 py-2 bg-neutral-100 text-neutral-500 rounded-lg font-medium text-sm flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Invited
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
