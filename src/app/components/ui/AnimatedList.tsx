import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface AnimatedListProps<T> {
  items: T[];
  onItemSelect: (item: T, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean; // Implemented as just a visual arrow for now
  displayScrollbar?: boolean;
  // Custom render prop to make it flexible
  renderItem?: (item: T, index: number, isSelected: boolean) => React.ReactNode;
}

const AnimatedList = <T extends { id: string } | string>({
  items,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  displayScrollbar = true,
  renderItem
}: AnimatedListProps<T>) => {
  return (
    <div className={`relative ${showGradients ? 'mask-gradient' : ''} ${displayScrollbar ? 'overflow-y-auto' : 'overflow-hidden'}`}>
      <motion.ul 
        className="space-y-3 p-1"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } }
        }}
      >
        <AnimatePresence>
          {items.map((item, index) => {
             const id = typeof item === 'string' ? item : item.id;
             const label = typeof item === 'string' ? item : (item as any).label || (item as any).name || id;

             return (
              <motion.li
                key={id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onItemSelect(item, index)}
                className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden cursor-pointer"
              >
                {renderItem ? (
                  renderItem(item, index, false)
                ) : (
                  <div className="flex items-center justify-between p-4">
                    <span className="font-medium text-neutral-700">{label}</span>
                    {enableArrowNavigation && <ChevronRight className="w-5 h-5 text-neutral-400" />}
                  </div>
                )}
              </motion.li>
             );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
};

export default AnimatedList;
