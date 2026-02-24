import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Calendar, Clock, Zap, AlertCircle } from 'lucide-react';
import { useCancelBooking } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { Booking } from '../backend';

interface BookingCardProps {
  booking: Booking;
  stationName?: string;
  stationLocation?: string;
}

export function BookingCard({ booking, stationName, stationLocation }: BookingCardProps) {
  const cancelMutation = useCancelBooking();

  const startDate = new Date(Number(booking.startTime) / 1000000);
  const endDate = new Date(Number(booking.endTime) / 1000000);
  const now = new Date();
  const timeUntilStart = startDate.getTime() - now.getTime();
  const canCancel = timeUntilStart > 3600000; // More than 1 hour
  const isPast = startDate < now;

  const handleCancel = async () => {
    if (!canCancel) {
      toast.error('Cannot cancel within 1 hour of start time');
      return;
    }

    try {
      await cancelMutation.mutateAsync(booking.bookingId);
      toast.success('Booking cancelled successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to cancel booking');
    }
  };

  return (
    <Card className={`border-border/50 ${isPast ? 'opacity-60' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-[oklch(0.65_0.20_165)]" />
              {stationName || `Station ${booking.stationId}`}
            </CardTitle>
            {stationLocation && (
              <CardDescription className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4" />
                {stationLocation}
              </CardDescription>
            )}
          </div>
          {isPast && (
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
              Completed
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Date</span>
              <span className="text-sm font-medium">{startDate.toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Time</span>
              <span className="text-sm font-medium">
                {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <span className="text-sm text-muted-foreground">Port Number:</span>
          <span className="text-sm font-bold text-[oklch(0.65_0.20_165)]">
            #{booking.portNumber.toString()}
          </span>
        </div>

        {!isPast && (
          <>
            {!canCancel && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm">
                <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Cancellation not available within 1 hour of start time
                </span>
              </div>
            )}

            <Button
              onClick={handleCancel}
              disabled={!canCancel || cancelMutation.isPending}
              variant="destructive"
              className="w-full"
            >
              {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
