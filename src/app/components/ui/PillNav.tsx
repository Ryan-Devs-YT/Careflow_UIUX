import { motion } from 'motion/react';
import { useState } from 'react';

interface NavItem {
  label: string;
  href?: string;
  id?: string;
  onClick?: () => void;
}

interface PillNavProps {
  items: NavItem[];
  activeId?: string; // Changed from activeHref to support ID selection
  onSelect?: (id: string) => void;
  className?: string;
  baseColor?: string;
  pillColor?: string;
  pillTextColor?: string;
  hoveredPillTextColor?: string;
  // Ignored props
  logo?: string;
  logoAlt?: string;
  ease?: string;
  theme?: string;
  initialLoadAnimation?: boolean;
}

const PillNav = ({
  items,
  activeId,
  onSelect,
  className = '',
  baseColor = '#000000',
  pillColor = '#ffffff',
  pillTextColor = '#000000',
  hoveredPillTextColor = '#ffffff'
}: PillNavProps) => {
  // Internal state if uncontrolled, but we prefer controlled for integration
  const [internalActive, setInternalActive] = useState(items[0]?.id || items[0]?.label);
  
  const currentActive = activeId || internalActive;

  return (
    <nav className={`flex items-center justify-center ${className}`}>
      <div className="flex gap-1 bg-neutral-100/50 p-1 rounded-full backdrop-blur-sm">
        {items.map((item) => {
          const id = item.id || item.label; // Fallback to label as ID
          const isActive = currentActive === id;

          return (
            <button
              key={id}
              onClick={() => {
                if (onSelect) onSelect(id);
                setInternalActive(id);
                item.onClick?.();
              }}
              className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors z-10"
              style={{
                color: isActive ? pillTextColor : baseColor
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full -z-10"
                  style={{ backgroundColor: pillColor }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default PillNav;
