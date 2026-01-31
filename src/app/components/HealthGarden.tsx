import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface Plant {
  id: string;
  type: 'flower' | 'tree' | 'bush';
  earned: boolean;
  milestone: string;
  position: { x: number; y: number };
}

interface HealthGardenProps {
  plants: Plant[];
  daysStreak: number;
  onPlantClick?: (plant: Plant) => void;
  mini?: boolean;
}

export function HealthGarden({ plants, daysStreak, onPlantClick, mini = false }: HealthGardenProps) {
  const containerHeight = mini ? 'h-48' : 'h-[400px]';

  return (
    <div className={`${containerHeight} w-full rounded-[20px] overflow-hidden relative`}>
      {/* Sky Background - gradient based on time */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E8F5E9] via-[#C8E6C9] to-[#A5D6A7]" />
      
      {/* Ground Layer */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3">
        <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
          <path
            d="M0,100 Q100,80 200,100 T400,100 L400,150 L0,150 Z"
            fill="#8BC34A"
            opacity="0.6"
          />
          <path
            d="M0,120 Q100,100 200,120 T400,120 L400,150 L0,150 Z"
            fill="#7CB342"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Plants */}
      <div className="absolute inset-0">
        {plants.map((plant, index) => (
          <motion.div
            key={plant.id}
            className={`absolute cursor-pointer ${plant.earned ? 'opacity-100' : 'opacity-30'}`}
            style={{
              left: `${plant.position.x}%`,
              bottom: `${plant.position.y}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: plant.earned ? 1 : 0.5,
              opacity: plant.earned ? 1 : 0.3,
            }}
            transition={{
              delay: index * 0.1,
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
            whileHover={plant.earned ? { scale: 1.1 } : {}}
            onClick={() => plant.earned && onPlantClick?.(plant)}
          >
            {plant.type === 'flower' && <FlowerIcon earned={plant.earned} />}
            {plant.type === 'tree' && <TreeIcon earned={plant.earned} />}
            {plant.type === 'bush' && <BushIcon earned={plant.earned} />}
          </motion.div>
        ))}
      </div>

      {/* Streak Badge */}
      {!mini && (
        <motion.div
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Sparkles className="w-5 h-5 text-warm-comfort-500" />
          <span className="text-sm font-semibold text-neutral-700">
            {daysStreak} day{daysStreak !== 1 ? 's' : ''} streak
          </span>
        </motion.div>
      )}
    </div>
  );
}

function FlowerIcon({ earned }: { earned: boolean }) {
  return (
    <svg width="48" height="56" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stem */}
      <path
        d="M24 56 L24 24"
        stroke={earned ? '#7CB342' : '#C5CBCB'}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Leaves */}
      <path
        d="M24 40 Q18 38 16 35"
        stroke={earned ? '#7CB342' : '#C5CBCB'}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M24 35 Q30 33 32 30"
        stroke={earned ? '#7CB342' : '#C5CBCB'}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Petals */}
      <circle cx="24" cy="16" r="6" fill={earned ? '#E91E63' : '#E5E8E7'} />
      <circle cx="16" cy="20" r="6" fill={earned ? '#E91E63' : '#E5E8E7'} />
      <circle cx="32" cy="20" r="6" fill={earned ? '#E91E63' : '#E5E8E7'} />
      <circle cx="20" cy="10" r="6" fill={earned ? '#E91E63' : '#E5E8E7'} />
      <circle cx="28" cy="10" r="6" fill={earned ? '#E91E63' : '#E5E8E7'} />
      {/* Center */}
      <circle cx="24" cy="16" r="4" fill={earned ? '#FFC107' : '#C5CBCB'} />
    </svg>
  );
}

function TreeIcon({ earned }: { earned: boolean }) {
  return (
    <svg width="56" height="72" viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Trunk */}
      <rect
        x="22"
        y="40"
        width="12"
        height="32"
        rx="2"
        fill={earned ? '#8D6E63' : '#C5CBCB'}
      />
      {/* Foliage layers */}
      <path
        d="M28 40 L10 25 L18 25 L5 10 L28 10 L51 10 L38 25 L46 25 Z"
        fill={earned ? '#66BB6A' : '#E5E8E7'}
      />
    </svg>
  );
}

function BushIcon({ earned }: { earned: boolean }) {
  return (
    <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="25" r="12" fill={earned ? '#81C784' : '#E5E8E7'} />
      <circle cx="30" cy="18" r="14" fill={earned ? '#66BB6A' : '#E5E8E7'} />
      <circle cx="45" cy="25" r="12" fill={earned ? '#81C784' : '#E5E8E7'} />
      <ellipse cx="30" cy="35" rx="25" ry="5" fill={earned ? '#7CB342' : '#C5CBCB'} opacity="0.5" />
    </svg>
  );
}
