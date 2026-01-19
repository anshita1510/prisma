import { cn } from '@/lib/utils';

interface BackendTimeSlot {
  checkIn: string;
  checkOut?: string;
}

interface TimelineBarProps {
  slots: BackendTimeSlot[];
  className?: string;
}

// Convert time string to percentage of day (9AM - 7PM = 10 hours)
const timeToPercent = (timeString: string): number => {
  const date = new Date(timeString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  
  const startOfDay = 9 * 60 + 30; // 9:30 AM
  const endOfDay = 18 * 60 + 30; // 6:30 PM
  const dayDuration = endOfDay - startOfDay;
  
  return Math.max(0, Math.min(100, ((totalMinutes - startOfDay) / dayDuration) * 100));
};

const formatTime = (timeString: string): string => {
  return new Date(timeString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const TimelineBar = ({ slots, className }: TimelineBarProps) => {
  if (!slots || slots.length === 0) {
    return (
      <div className={cn("h-3 bg-gray-200 rounded-full relative", className)}>
        <div className="text-xs text-gray-500 text-center mt-1">No entries</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {/* Timeline bar */}
      <div className={cn("relative h-3 bg-gray-200 rounded-full overflow-hidden", className)}>
        {/* Hour markers (9:30 AM to 6:30 PM) */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 w-px h-full bg-gray-300 opacity-50"
            style={{ left: `${(i / 9) * 100}%` }}
          />
        ))}
        
        {/* Time slots */}
        {slots.map((slot, index) => {
          const startPercent = timeToPercent(slot.checkIn);
          const endPercent = slot.checkOut ? timeToPercent(slot.checkOut) : 100;
          const width = Math.max(2, endPercent - startPercent); // Minimum 2% width for visibility
          
          return (
            <div
              key={index}
              className={cn(
                "absolute top-0 h-full transition-all duration-300",
                slot.checkOut 
                  ? "bg-teal-400 hover:bg-teal-500" 
                  : "bg-green-400 animate-pulse hover:bg-green-500"
              )}
              style={{
                left: `${startPercent}%`,
                width: `${width}%`,
              }}
              title={`Session ${index + 1}: ${formatTime(slot.checkIn)} - ${
                slot.checkOut ? formatTime(slot.checkOut) : 'Active'
              }`}
            />
          );
        })}
      </div>
      
      {/* Time labels */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>9:30</span>
        <span className="text-center">
          {slots.length} session{slots.length !== 1 ? 's' : ''}
        </span>
        <span>18:30</span>
      </div>
    </div>
  );
};
