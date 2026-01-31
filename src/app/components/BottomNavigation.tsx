import { Home, HelpCircle, Users, Calendar, Settings } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavigationProps {
  mode?: 'simplified' | 'balanced';
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function BottomNavigation({ 
  mode = 'simplified', 
  activeTab, 
  onTabChange 
}: BottomNavigationProps) {
  const isSimplified = mode === 'simplified';

  const simplifiedItems: NavItem[] = [
    { id: 'today', label: 'Today', icon: <Home /> },
    { id: 'help', label: 'Help', icon: <HelpCircle /> },
    { id: 'family', label: 'Family', icon: <Users /> },
  ];

  const balancedItems: NavItem[] = [
    { id: 'today', label: 'Today', icon: <Home /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar /> },
    { id: 'family', label: 'Family', icon: <Users /> },
    { id: 'help', label: 'Help', icon: <HelpCircle /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
  ];

  const items = isSimplified ? simplifiedItems : balancedItems;
  const height = isSimplified ? 'h-[72px]' : 'h-[64px]';
  const iconSize = isSimplified ? 'w-8 h-8' : 'w-6 h-6';
  const labelSize = isSimplified ? 'text-xs' : 'text-[11px]';

  return (
    <nav className={`${height} bg-neutral-white border-t border-neutral-200 shadow-[0_-4px_16px_rgba(45,62,62,0.16)] fixed bottom-0 left-0 right-0 z-50`}>
      <div className="h-full flex items-center justify-around px-2">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                flex flex-col items-center justify-center gap-1
                min-w-[60px] h-full
                transition-colors duration-200
                ${isActive ? 'text-healing-sage-500' : 'text-neutral-400'}
                hover:text-healing-sage-600
                active:scale-95
              `}
            >
              <div className={iconSize}>
                {item.icon}
              </div>
              <span className={`${labelSize} font-medium`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
