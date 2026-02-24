import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import { TimeSlotPicker } from '../components/TimeSlotPicker';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useBookSlot } from '../hooks/useQueries';
import { ArrowLeft, Calendar as CalendarIcon, Zap } from 'lucide-react';
import { toast } from 'sonner';
import type { Time } from '../backend';

const STATIONS = {
  '1': { name: 'Downtown Charging Hub', location: '123 Main Street, City Center', ports: 4 },
  '2': { name: 'Green Valley Station', location: '456 Oak Avenue, Green Valley', ports: 6 },
  '3': { name: 'Tech Park Chargers', location: '789 Innovation Drive, Tech District', ports: 8 },
};

export function BookingPage() {
  const { stationId } = useParams({ from: '/booking/$stationId' });
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const bookMutation = useBookSlot();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Time | null>(null);

  const station = STATIONS[stationId as keyof typeof STATIONS];
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  if (!station) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Station not found</p>
            <Button onClick={() => navigate({ to: '/' })} className="mt-4">
              Back to Stations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a slot');
      login();
      return;
    }

    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }

    try {
      const portNumber = BigInt(Math.floor(Math.random() * station.ports));
      const bookingId = await bookMutation.mutateAsync({
        stationId,
        portNumber,
        startTime: selectedSlot,
      });

      toast.success('Booking confirmed!');
      navigate({ to: '/booking-success/$bookingId', params: { bookingId: bookingId.toString() } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to book slot');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Stations
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Station Info */}
        <Card className="lg:col-span-1 h-fit border-border/50 bg-gradient-to-br from-card to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[oklch(0.65_0.20_165)]" />
              {station.name}
            </CardTitle>
            <CardDescription>{station.location}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">Available Ports</span>
              <p className="text-2xl font-bold text-[oklch(0.65_0.20_165)]">{station.ports}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Slot Duration</span>
              <p className="text-lg font-medium">30 minutes</p>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Select Date & Time
            </CardTitle>
            <CardDescription>Choose your preferred charging slot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date Picker */}
            <div>
              <h3 className="text-sm font-medium mb-3">Select Date</h3>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }
                  }}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-lg border border-border/50"
                />
              </div>
            </div>

            {/* Time Slot Picker */}
            <div>
              <h3 className="text-sm font-medium mb-3">Select Time Slot</h3>
              <TimeSlotPicker
                stationId={stationId}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
              />
            </div>

            {/* Booking Summary */}
            {selectedSlot && (
              <div className="p-4 rounded-lg bg-accent/10 border border-[oklch(0.65_0.20_165)]/20 space-y-2">
                <h3 className="font-medium">Booking Summary</h3>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-muted-foreground">Date:</span>{' '}
                    {selectedDate.toLocaleDateString()}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Time:</span>{' '}
                    {new Date(Number(selectedSlot) / 1000000).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    - {new Date(Number(selectedSlot) / 1000000 + 1800000).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Duration:</span> 30 minutes
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleBooking}
                disabled={!selectedSlot || bookMutation.isPending}
                className="flex-1 bg-gradient-to-r from-[oklch(0.65_0.20_165)] to-[oklch(0.55_0.22_175)] hover:from-[oklch(0.60_0.20_165)] hover:to-[oklch(0.50_0.22_175)] text-white shadow-lg"
              >
                {bookMutation.isPending ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>

            {!isAuthenticated && (
              <p className="text-sm text-center text-muted-foreground">
                You'll need to login to complete the booking
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
