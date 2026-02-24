import { useNavigate, useParams } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle, Calendar, Home } from 'lucide-react';

export function BookingSuccessPage() {
  const { bookingId } = useParams({ from: '/booking-success/$bookingId' });
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="border-[oklch(0.65_0.20_165)]/30 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[oklch(0.75_0.18_155)] to-[oklch(0.65_0.20_165)] flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-3xl">Booking Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-muted-foreground text-lg">
              Your charging slot has been successfully reserved.
            </p>

            <div className="p-4 rounded-lg bg-accent/10 border border-[oklch(0.65_0.20_165)]/20">
              <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
              <p className="text-2xl font-bold text-[oklch(0.65_0.20_165)]">#{bookingId}</p>
            </div>

            <div className="space-y-3 pt-4">
              <p className="text-sm text-muted-foreground">
                You can view and manage your booking in your dashboard.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => navigate({ to: '/dashboard' })}
                  className="flex-1 gap-2 bg-gradient-to-r from-[oklch(0.65_0.20_165)] to-[oklch(0.55_0.22_175)] text-white"
                >
                  <Calendar className="w-4 h-4" />
                  View My Bookings
                </Button>
                <Button
                  onClick={() => navigate({ to: '/' })}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Home className="w-4 h-4" />
                  Back to Home
                </Button>
              </div>
            </div>

            <div className="pt-6 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Remember: You can cancel your booking up to 1 hour before the scheduled time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
