import { Button } from './ui/button';
import { Clock, Loader2 } from 'lucide-react';
import { useGetAvailableSlots } from '../hooks/useQueries';
import type { StationId, Time } from '../backend';

interface TimeSlotPickerProps {
  stationId: StationId;
  selectedDate: Date;
  selectedSlot: Time | null;
  onSelectSlot: (slot: Time) => void;
}

export function TimeSlotPicker({ stationId, selectedDate, selectedSlot, onSelectSlot }: TimeSlotPickerProps) {
  const dateTime = BigInt(selectedDate.getTime() * 1000000);
  const { data: availableSlots, isLoading } = useGetAvailableSlots(stationId, dateTime);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.65_0.20_165)]" />
      </div>
    );
  }

  if (!availableSlots || availableSlots.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No available slots for this date</p>
      </div>
    );
  }

  // Group slots by time
  const uniqueSlots = Array.from(new Set(availableSlots.map((s) => s.toString()))).map((s) => BigInt(s));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>Select a 30-minute charging slot</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {uniqueSlots.map((slot) => {
          const slotDate = new Date(Number(slot) / 1000000);
          const isSelected = selectedSlot?.toString() === slot.toString();

          return (
            <Button
              key={slot.toString()}
              onClick={() => onSelectSlot(slot)}
              variant={isSelected ? 'default' : 'outline'}
              className={
                isSelected
                  ? 'bg-gradient-to-r from-[oklch(0.65_0.20_165)] to-[oklch(0.55_0.22_175)] text-white border-0'
                  : 'hover:border-[oklch(0.65_0.20_165)]'
              }
            >
              {slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
