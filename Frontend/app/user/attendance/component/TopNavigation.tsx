"use client";

import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { id: 'attendance', label: 'ATTENDANCE', active: true },
  { id: 'leave', label: 'LEAVE', active: false },
  { id: 'performance', label: 'PERFORMANCE', active: false },
  { id: 'expenses', label: 'EXPENSES & TRAVEL', active: false },
  { id: 'helpdesk', label: 'HELPDESK', active: false },
  { id: 'apps', label: 'APPS', active: false },
];

export const TopNavigation = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={cn(
                "relative py-4 text-sm font-medium transition-colors",
                item.active 
                  ? "text-purple-600" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {item.label}
              {item.active && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
