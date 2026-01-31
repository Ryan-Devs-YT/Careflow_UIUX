import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Menu } from 'lucide-react';

interface NavLink {
  label: string;
  ariaLabel?: string;
  onClick?: () => void;
}

interface NavItem {
  label: string;
  bgColor: string;
  textColor: string;
  links: NavLink[];
}

interface CardNavProps {
  logo?: string;
  logoAlt?: string;
  items: NavItem[];
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  ease?: string;
  theme?: 'light' | 'dark';
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt,
  items,
  buttonBgColor = "#111",
  buttonTextColor = "#fff",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full transition-transform active:scale-95"
        style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-8">
              {logo ? (
                <img src={logo} alt={logoAlt} className="h-8 w-auto" />
              ) : (
                <span className="text-2xl font-bold text-white">CareFlow</span>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 flex flex-col gap-4 overflow-y-auto"
            >
              {items.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  className="rounded-3xl p-6 flex flex-col justify-between min-h-[160px]"
                  style={{ backgroundColor: item.bgColor, color: item.textColor }}
                >
                  <h3 className="text-2xl font-bold mb-4">{item.label}</h3>
                  <div className="flex flex-wrap gap-3">
                    {item.links.map((link, lIdx) => (
                      <button
                        key={lIdx}
                        onClick={() => {
                          link.onClick?.();
                          setIsOpen(false);
                        }}
                        aria-label={link.ariaLabel}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CardNav;
