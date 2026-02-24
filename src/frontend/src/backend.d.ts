import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type BookingId = bigint;
export type UserId = Principal;
export type StationId = string;
export type Time = bigint;
export interface Booking {
    startTime: Time;
    bookingId: BookingId;
    endTime: Time;
    userId: UserId;
    stationId: StationId;
    portNumber: bigint;
}
export interface backendInterface {
    addStation(name: string, location: string, ports: bigint, openHour: bigint, closeHour: bigint): Promise<StationId>;
    bookSlot(stationId: StationId, portNumber: bigint, startTime: Time): Promise<BookingId>;
    cancelBooking(bookingId: BookingId): Promise<void>;
    getAvailableSlots(stationId: StationId, date: Time): Promise<Array<Time>>;
    getMyBookings(): Promise<Array<Booking>>;
}
