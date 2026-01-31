import { Check, Clock, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export type MedicationStatus = 'upcoming' | 'time-to-take' | 'taken' | 'missed' | 'skipped';

interface MedicationCardProps {
  id: string;
  name: string;
  dosage: string;
  time: string;
  photo?: string;
  status: MedicationStatus;
  mode?: 'simplified' | 'balanced';
  onMarkTaken?: (id: string) => void;
  onCardClick?: (id: string) => void;
}

export function MedicationCard({
  id,
  name,
  dosage,
  time,
  photo,
  status,
  mode = 'simplified',
  onMarkTaken,
  onCardClick,
}: MedicationCardProps) {
  const isSimplified = mode === 'simplified';
  
  const statusStyles = {
    upcoming: 'bg-neutral-white border-neutral-200',
    'time-to-take': 'bg-neutral-white border-healing-sage-500 ring-2 ring-healing-sage-200',
    taken: 'bg-neutral-100 border-neutral-200 opacity-60',
    missed: 'bg-error-light border-error-main',
    skipped: 'bg-neutral-100 border-neutral-300',
  };

  const buttonSize = isSimplified ? 'h-[60px] px-8 text-lg' : 'h-[48px] px-6 text-sm';
  const cardPadding = isSimplified ? 'p-5' : 'p-4';
  const photoSize = isSimplified ? 'w-20 h-20' : 'w-16 h-16';
  const nameSize = isSimplified ? 'text-xl' : 'text-base';
  const dosageSize = isSimplified ? 'text-base' : 'text-sm';
  const timeSize = isSimplified ? 'text-sm' : 'text-xs';

  return (
    <div
      className={`
        ${cardPadding} 
        rounded-[16px] 
        border-2 
        ${statusStyles[status]}
        shadow-[0_2px_8px_rgba(45,62,62,0.12)]
        transition-all duration-200
        ${onCardClick ? 'cursor-pointer hover:shadow-[0_4px_16px_rgba(45,62,62,0.16)]' : ''}
        relative
      `}
      onClick={() => onCardClick?.(id)}
    >
      <div className="flex items-center gap-4">
        {/* Medication Photo */}
        <div className={`${photoSize} rounded-xl bg-neutral-100 border-2 border-neutral-200 flex-shrink-0 overflow-hidden`}>
          {photo ? (
            <ImageWithFallback
              src={photo}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="12" y="8" width="16" height="24" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="14" x2="24" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="16" y1="20" x2="24" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>

        {/* Medication Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`${nameSize} font-semibold text-neutral-700 mb-1`}>
            {name}
          </h3>
          <p className={`${dosageSize} text-neutral-500 mb-0.5`}>
            {dosage}
          </p>
          <div className="flex items-center gap-1.5">
            <Clock className={`${isSimplified ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-neutral-400`} />
            <span className={`${timeSize} text-neutral-400`}>{time}</span>
          </div>
        </div>

        {/* Status Indicator / Action */}
        {status === 'taken' && (
          <div className="flex-shrink-0">
            <div className={`${isSimplified ? 'w-12 h-12' : 'w-10 h-10'} rounded-full bg-success-main flex items-center justify-center`}>
              <Check className={`${isSimplified ? 'w-6 h-6' : 'w-5 h-5'} text-white`} />
            </div>
          </div>
        )}

        {status === 'missed' && (
          <div className="flex-shrink-0">
            <AlertCircle className={`${isSimplified ? 'w-6 h-6' : 'w-5 h-5'} text-error-main`} />
          </div>
        )}

        {(status === 'upcoming' || status === 'time-to-take') && onMarkTaken && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkTaken(id);
            }}
            className={`
              ${buttonSize}
              bg-healing-sage-500 text-white
              rounded-xl font-medium
              hover:bg-healing-sage-600
              active:bg-healing-sage-700
              active:scale-95
              transition-all duration-150
              shadow-sm hover:shadow-md
              flex-shrink-0
            `}
          >
            Mark Taken
          </button>
        )}
      </div>
    </div>
  );
}
