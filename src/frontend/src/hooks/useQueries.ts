import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Booking, StationId, Time, BookingId } from '../backend';

export function useGetAvailableSlots(stationId: StationId | null, date: Time | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Time[]>({
    queryKey: ['availableSlots', stationId, date?.toString()],
    queryFn: async () => {
      if (!actor || !stationId || date === null) return [];
      return actor.getAvailableSlots(stationId, date);
    },
    enabled: !!actor && !isFetching && !!stationId && date !== null,
  });
}

export function useGetMyBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<Booking[]>({
    queryKey: ['myBookings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookSlot() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      stationId,
      portNumber,
      startTime,
    }: {
      stationId: StationId;
      portNumber: bigint;
      startTime: Time;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.bookSlot(stationId, portNumber, startTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availableSlots'] });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    },
  });
}

export function useCancelBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: BookingId) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.cancelBooking(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availableSlots'] });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    },
  });
}

export function useAddStation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      location,
      ports,
      openHour,
      closeHour,
    }: {
      name: string;
      location: string;
      ports: bigint;
      openHour: bigint;
      closeHour: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addStation(name, location, ports, openHour, closeHour);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
  });
}
