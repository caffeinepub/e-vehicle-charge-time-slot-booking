import { useEffect, useState } from 'react';
import { StationCard } from '../components/StationCard';
import { Button } from '../components/ui/button';
import { useActor } from '../hooks/useActor';
import { useGetAvailableSlots } from '../hooks/useQueries';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Station {
  stationId: string;
  name: string;
  location: string;
  ports: number;
  hours: [number, number];
}

export function StationsPage() {
  const { actor } = useActor();
  const [stations, setStations] = useState<Station[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  const today = BigInt(new Date().setHours(0, 0, 0, 0) * 1000000);

  useEffect(() => {
    const initializeStations = async () => {
      if (!actor) return;

      try {
        // Check if stations exist by trying to get slots for station "1"
        const slots = await actor.getAvailableSlots('1', today);

        if (slots.length === 0) {
          // Initialize demo stations
          const station1 = await actor.addStation('Downtown Charging Hub', '123 Main Street, City Center', 4n, 6n, 22n);
          const station2 = await actor.addStation('Green Valley Station', '456 Oak Avenue, Green Valley', 6n, 0n, 24n);
          const station3 = await actor.addStation('Tech Park Chargers', '789 Innovation Drive, Tech District', 8n, 7n, 20n);

          setStations([
            { stationId: station1, name: 'Downtown Charging Hub', location: '123 Main Street, City Center', ports: 4, hours: [6, 22] },
            { stationId: station2, name: 'Green Valley Station', location: '456 Oak Avenue, Green Valley', ports: 6, hours: [0, 24] },
            { stationId: station3, name: 'Tech Park Chargers', location: '789 Innovation Drive, Tech District', ports: 8, hours: [7, 20] },
          ]);
        } else {
          // Stations already exist
          setStations([
            { stationId: '1', name: 'Downtown Charging Hub', location: '123 Main Street, City Center', ports: 4, hours: [6, 22] },
            { stationId: '2', name: 'Green Valley Station', location: '456 Oak Avenue, Green Valley', ports: 6, hours: [0, 24] },
            { stationId: '3', name: 'Tech Park Chargers', location: '789 Innovation Drive, Tech District', ports: 8, hours: [7, 20] },
          ]);
        }
      } catch (error) {
        console.error('Error initializing stations:', error);
        toast.error('Failed to load stations');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeStations();
  }, [actor, today]);

  if (isInitializing) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-12 h-12 animate-spin text-[oklch(0.65_0.20_165)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.65_0.20_165)]/90 to-[oklch(0.55_0.22_175)]/90 z-10" />
        <img
          src="/assets/generated/ev-station.dim_800x600.png"
          alt="EV Charging Station"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Charge Your Future
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl drop-shadow-md">
            Book your EV charging slot in seconds. Fast, convenient, and eco-friendly.
          </p>
          <div className="flex gap-4 text-sm md:text-base">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              ⚡ 30-min slots
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              🌱 100% Green Energy
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              📱 Easy Booking
            </div>
          </div>
        </div>
      </div>

      {/* Stations Grid */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Available Charging Stations</h2>
        <p className="text-muted-foreground">Find and book your nearest charging station</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((station) => (
          <StationCardWithSlots key={station.stationId} station={station} today={today} />
        ))}
      </div>
    </div>
  );
}

function StationCardWithSlots({ station, today }: { station: Station; today: bigint }) {
  const { data: availableSlots } = useGetAvailableSlots(station.stationId, today);

  return (
    <StationCard
      stationId={station.stationId}
      name={station.name}
      location={station.location}
      ports={station.ports}
      hours={station.hours}
      availableSlots={availableSlots?.length || 0}
    />
  );
}
