import { TreePine, TreeDeciduous, Leaf, Sprout } from 'lucide-react';
export interface TreeIconProps {
  size?: number;
  color?: string;
  variant?: 'pine' | 'evergreen' | 'deciduous' | 'sprout';
  health?: number; // 0-100, affects appearance
  className?: string;
}

export function TreeIcon({ 
  size = 48, 
  color = 'currentColor', 
  variant = 'pine',
  health = 100,
  className = ''
}: TreeIconProps) {
  // Determine tree health state
  const getHealthColor = () => {
    if (health >= 90) return '#22c55e'; // Green
    if (health >= 60) return '#eab308'; // Yellow
    return '#6b7280'; // Gray
  };

  const getOpacity = () => {
    if (health >= 90) return 1;
    if (health >= 60) return 0.8;
    return 0.5;
  };

  const treeColor = color === 'currentColor' ? getHealthColor() : color;
  const opacity = getOpacity();

   const TreeComponent = {
    pine: TreePine,
    evergreen: Leaf,
    deciduous: TreeDeciduous,
    sprout: Sprout
  }[variant] || TreePine;

  return (
    <div className={className} style={{ opacity }}>
      <TreeComponent 
        size={size} 
        color={treeColor}
        style={{ 
          filter: health < 60 ? 'grayscale(100%)' : 'none',
          transform: `scale(${0.8 + (health / 100) * 0.2})`
        }}
      />
    </div>
  );
}

// Forest component that shows multiple trees
export interface ForestProps {
  trees: Array<{ name: string; adherence: number }>;
  className?: string;
}

export function Forest({ trees, className = '' }: ForestProps) {
  const treeVariants = ['pine', 'evergreen', 'deciduous', 'sprout'] as const;
  
  return (
    <div className={`flex items-end justify-center gap-4 flex-wrap ${className}`}>
      {trees.map((tree, index) => (
        <div key={tree.name} className="flex flex-col items-center group relative">
          {/* Tooltip */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            {tree.name}: {tree.adherence}%
          </div>
          
          {/* Tree */}
          <TreeIcon
            variant={treeVariants[index % treeVariants.length]}
            health={tree.adherence}
            size={48 + (index % 2) * 16} // Vary sizes
            className="transition-all duration-500 hover:scale-110"
          />
          
          {/* Label */}
          <p className="text-xs font-medium text-neutral-600 mt-2 max-w-[80px] text-center truncate">
            {tree.name}
          </p>
        </div>
      ))}
      
      {trees.length === 0 && (
        <p className="text-neutral-500 text-center col-span-full">
          No active prescriptions to track. Start adding medications to grow your forest! 🌱
        </p>
      )}
    </div>
  );
}