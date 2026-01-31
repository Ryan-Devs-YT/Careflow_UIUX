import { motion } from 'motion/react';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { ArrowLeft, UserPlus, MessageCircle, Phone, Video, MoreVertical, Check, Clock } from 'lucide-react';
import { Avatar } from '@/app/components/ui/avatar';

interface CareCircleMember {
  id: string;
  name: string;
  role: 'primary-caregiver' | 'helper' | 'doctor' | 'pharmacist';
  avatar?: string;
  lastActive?: string;
  status?: 'online' | 'offline' | 'away';
}

interface CareCircleHubProps {
  members: CareCircleMember[];
  pendingInvites?: number;
  onBack: () => void;
  onInviteMember: () => void;
  onMemberClick: (member: CareCircleMember) => void;
  onMessage: (memberId: string) => void;
  onCall: (memberId: string) => void;
  mode?: 'simplified' | 'balanced';
}

export function CareCircleHub({
  members,
  pendingInvites = 0,
  onBack,
  onInviteMember,
  onMemberClick,
  onMessage,
  onCall,
  mode = 'simplified',
}: CareCircleHubProps) {
  const isSimplified = mode === 'simplified';

  const familyMembers = members.filter(
    (m) => m.role === 'primary-caregiver' || m.role === 'helper'
  );
  const professionals = members.filter(
    (m) => m.role === 'doctor' || m.role === 'pharmacist'
  );

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'primary-caregiver': 'Primary Caregiver',
      'helper': 'Helper',
      'doctor': 'Doctor',
      'pharmacist': 'Pharmacist',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'primary-caregiver': 'bg-healing-sage-100 text-healing-sage-700',
      'helper': 'bg-info-light text-info-dark',
      'doctor': 'bg-warm-comfort-100 text-warm-comfort-600',
      'pharmacist': 'bg-success-light text-success-dark',
    };
    return colors[role] || 'bg-neutral-100 text-neutral-600';
  };

  const getStatusColor = (status?: string) => {
    const colors: Record<string, string> = {
      online: 'bg-success-main',
      away: 'bg-warning-main',
      offline: 'bg-neutral-400',
    };
    return colors[status || 'offline'];
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-32">
      {/* Header */}
      <div className="bg-gradient-to-br from-healing-sage-500 to-healing-sage-600 text-white p-6 rounded-b-[32px] shadow-lg mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className={`${isSimplified ? 'text-3xl' : 'text-2xl'} font-bold mb-1`}>
              Your Care Team
            </h1>
            <p className="text-healing-sage-100">
              {members.length} member{members.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <button
            onClick={onInviteMember}
            className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
          >
            <UserPlus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Pending Invitations Banner */}
        {pendingInvites > 0 && (
          <motion.div
            className="bg-warm-comfort-100 border-2 border-warm-comfort-400 rounded-xl p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-warm-comfort-600" />
                <span className="font-medium text-neutral-700">
                  {pendingInvites} pending invitation{pendingInvites !== 1 ? 's' : ''}
                </span>
              </div>
              <button className="text-sm font-medium text-healing-sage-600 hover:text-healing-sage-700">
                View
              </button>
            </div>
          </motion.div>
        )}

        {/* Family Members Section */}
        {familyMembers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-neutral-700 mb-4">
              Family & Caregivers
            </h2>

            <div className="space-y-3">
              {familyMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  className="bg-white rounded-[16px] p-5 shadow-md"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    {/* Avatar with status */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-healing-sage-300 to-healing-sage-500 flex items-center justify-center text-white text-xl font-bold overflow-hidden">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          member.name.charAt(0)
                        )}
                      </div>
                      {member.status && (
                        <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-neutral-700 truncate">
                        {member.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleColor(member.role)}`}>
                          {getRoleLabel(member.role)}
                        </span>
                        {member.lastActive && (
                          <span className="text-xs text-neutral-500">
                            {member.lastActive}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => onMessage(member.id)}
                        className="w-10 h-10 rounded-full bg-healing-sage-100 hover:bg-healing-sage-200 flex items-center justify-center transition-colors"
                      >
                        <MessageCircle className="w-5 h-5 text-healing-sage-600" />
                      </button>
                      <button
                        onClick={() => onCall(member.id)}
                        className="w-10 h-10 rounded-full bg-healing-sage-100 hover:bg-healing-sage-200 flex items-center justify-center transition-colors"
                      >
                        <Phone className="w-5 h-5 text-healing-sage-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Healthcare Professionals Section */}
        {professionals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-neutral-700 mb-4">
              Healthcare Professionals
            </h2>

            <div className="space-y-3">
              {professionals.map((member, index) => (
                <motion.div
                  key={member.id}
                  className="bg-white rounded-[16px] p-5 shadow-md"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-warm-comfort-300 to-warm-comfort-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 overflow-hidden">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        member.name.charAt(0)
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-neutral-700">
                        {member.name}
                      </h3>
                      <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium mt-1 ${getRoleColor(member.role)}`}>
                        {getRoleLabel(member.role)}
                      </span>
                      
                      {member.role === 'pharmacist' && (
                        <div className="mt-3">
                          <p className="text-sm text-neutral-600 mb-2">CVS Pharmacy - Main Street</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-sm">
                              <div className="w-2 h-2 rounded-full bg-success-main" />
                              <span className="text-neutral-600">Available</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {member.role === 'doctor' && (
                        <div className="mt-3">
                          <p className="text-sm text-neutral-600">Internal Medicine</p>
                          <p className="text-sm text-neutral-500 mt-1">
                            Next appointment: Feb 15, 2026
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => onMessage(member.id)}
                          className="px-4 py-2 bg-healing-sage-100 hover:bg-healing-sage-200 text-healing-sage-700 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Message
                        </button>
                        <button
                          onClick={() => onCall(member.id)}
                          className="px-4 py-2 bg-healing-sage-100 hover:bg-healing-sage-200 text-healing-sage-700 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {members.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">
              No care team members yet
            </h3>
            <p className="text-neutral-600 mb-6 max-w-sm mx-auto">
              Invite family members and connect with healthcare professionals to build your support network
            </p>
            <PrimaryButton onClick={onInviteMember} mode={mode}>
              Invite Your First Member
            </PrimaryButton>
          </motion.div>
        )}

        {/* Invite Button (FAB style) */}
        {members.length > 0 && (
          <motion.div
            className="fixed bottom-24 right-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
          >
            <button
              onClick={onInviteMember}
              className="w-16 h-16 bg-healing-sage-500 hover:bg-healing-sage-600 text-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all active:scale-95"
            >
              <UserPlus className="w-7 h-7" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
