import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMyBookings } from '../hooks/useQueries';
import { BookingCard } from '../components/BookingCard';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Calendar, Loader2, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

const STATIONS = {
  '1': { name: 'Downtown Charging Hub', location: '123 Main Street, City Center' },
  '2': { name: 'Green Valley Station', location: '456 Oak Avenue, Green Valley' },
  '3': { name: 'Tech Park Chargers', location: '789 Innovation Drive, Tech District' },
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { data: bookings, isLoading } = useGetMyBookings();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      login();
    }
  }, [isAuthenticated, isLoading, login]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6">Please login to view your bookings</p>
            <Button
              onClick={login}
              className="bg-gradient-to-r from-[oklch(0.65_0.20_165)] to-[oklch(0.55_0.22_175)] text-white"
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-12 h-12 animate-spin text-[oklch(0.65_0.20_165)]" />
        </div>
      </div>
    );
  }

  const sortedBookings = [...(bookings || [])].sort(
    (a, b) => Number(a.startTime) - Number(b.startTime)
  );

  const upcomingBookings = sortedBookings.filter(
    (b) => new Date(Number(b.startTime) / 1000000) >= new Date()
  );
  const pastBookings = sortedBookings.filter(
    (b) => new Date(Number(b.startTime) / 1000000) < new Date()
  );

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

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
        <p className="text-muted-foreground">Manage your charging slot reservations</p>
      </div>

      {sortedBookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No Bookings Yet</h2>
            <p className="text-muted-foreground mb-6">Start by booking a charging slot</p>
            <Button
              onClick={() => navigate({ to: '/' })}
              className="bg-gradient-to-r from-[oklch(0.65_0.20_165)] to-[oklch(0.55_0.22_175)] text-white"
            >
              Browse Stations
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {upcomingBookings.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Upcoming Bookings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingBookings.map((booking) => {
                  const station = STATIONS[booking.stationId as keyof typeof STATIONS];
                  return (
                    <BookingCard
                      key={booking.bookingId.toString()}
                      booking={booking}
                      stationName={station?.name}
                      stationLocation={station?.location}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Past Bookings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastBookings.map((booking) => {
                  const station = STATIONS[booking.stationId as keyof typeof STATIONS];
                  return (
                    <BookingCard
                      key={booking.bookingId.toString()}
                      booking={booking}
                      stationName={station?.name}
                      stationLocation={station?.location}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
