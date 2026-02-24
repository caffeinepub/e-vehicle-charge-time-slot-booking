import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Zap, Clock } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface StationCardProps {
  stationId: string;
  name: string;
  location: string;
  ports: number;
  hours: [number, number];
  availableSlots: number;
}

export function StationCard({ stationId, name, location, ports, hours, availableSlots }: StationCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm hover:border-[oklch(0.65_0.20_165)]/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[oklch(0.65_0.20_165)]" />
              {name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-base">
              <MapPin className="w-4 h-4" />
              {location}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Charging Ports</span>
            <span className="text-2xl font-bold text-[oklch(0.65_0.20_165)]">{ports}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Available Today</span>
            <span className="text-2xl font-bold text-[oklch(0.75_0.18_155)]">{availableSlots}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border/50">
          <Clock className="w-4 h-4" />
          <span>
            Open {hours[0]}:00 - {hours[1]}:00
          </span>
        </div>

        <Button
          onClick={() => navigate({ to: '/booking/$stationId', params: { stationId } })}
          className="w-full bg-gradient-to-r from-[oklch(0.65_0.20_165)] to-[oklch(0.55_0.22_175)] hover:from-[oklch(0.60_0.20_165)] hover:to-[oklch(0.50_0.22_175)] text-white shadow-lg"
        >
          Book Charging Slot
        </Button>
      </CardContent>
    </Card>
  );
}
