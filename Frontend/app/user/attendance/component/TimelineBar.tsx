import { TimeSlot } from '../types/attendanceTypes';
import { cn } from '@/lib/utils';

interface TimelineBarProps {
  slots: TimeSlot[];
  className?: string;
}

// Convert time string to percentage of day (9AM - 7PM = 10 hours)
const timeToPercent = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const startOfDay = 9 * 60; // 9:00 AM
  const endOfDay = 19 * 60; // 7:00 PM
  const dayDuration = endOfDay - startOfDay;
  
  return Math.max(0, Math.min(100, ((totalMinutes - startOfDay) / dayDuration) * 100));
};

export const TimelineBar = ({ slots, className }: TimelineBarProps) => {
  if (slots.length === 0) {
    return <div className={cn("h-3 bg-gray-200 rounded-full", className)} />;
  }
  
  return (
    <div className={cn("relative h-3 bg-gray-200 rounded-full overflow-hidden", className)}>
      {/* Hour markers */}
      {Array.from({ length: 11 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 w-px h-full bg-gray-300"
          style={{ left: `${(i / 10) * 100}%` }}
        />
      ))}
      
      {/* Time slots */}
      {slots.map((slot, index) => {
        const left = timeToPercent(slot.start);
        const right = timeToPercent(slot.end);
        const width = right - left;
        
        return (
          <div
            key={index}
            className={cn(
              "absolute top-0 h-full",
              slot.type === 'work' && "bg-teal-400",
              slot.type === 'break' && "bg-teal-300",
              slot.type === 'overtime' && "bg-teal-500",
            )}
            style={{
              left: `${left}%`,
              width: `${width}%`,
            }}
          />
        );
      })}
    </div>
  );
};
