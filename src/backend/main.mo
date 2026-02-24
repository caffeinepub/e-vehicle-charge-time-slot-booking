import List "mo:core/List";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

actor {
  type StationId = Text;
  type BookingId = Nat;
  type UserId = Principal;

  type ChargingStation = {
    stationId : StationId;
    name : Text;
    location : Text;
    ports : Nat;
    hours : (Nat, Nat);
  };

  type Booking = {
    bookingId : BookingId;
    stationId : StationId;
    userId : UserId;
    portNumber : Nat;
    startTime : Time.Time;
    endTime : Time.Time;
  };

  module Booking {
    public func compare(b1 : Booking, b2 : Booking) : Order.Order {
      Nat.compare(b1.bookingId, b2.bookingId);
    };
  };

  let bookingCounter = List.singleton<BookingId>(0);

  let stations = Map.empty<StationId, ChargingStation>();
  let bookings = Map.empty<BookingId, Booking>();
  let userBookings = Map.empty<UserId, Set.Set<BookingId>>();

  public shared ({ caller }) func addStation(name : Text, location : Text, ports : Nat, openHour : Nat, closeHour : Nat) : async StationId {
    let stationId = (stations.size() + 1).toText();
    let station : ChargingStation = {
      stationId;
      name;
      location;
      ports;
      hours = (openHour, closeHour);
    };
    stations.add(stationId, station);
    stationId;
  };

  public query ({ caller }) func getAvailableSlots(stationId : StationId, date : Time.Time) : async [Time.Time] {
    let slotDuration = 30 * 60 * 1000000000 : Time.Time;
    let station = switch (stations.get(stationId)) {
      case (null) { Runtime.trap("Station not found") };
      case (?s) { s };
    };

    let slots = List.empty<Time.Time>();
    let dayStart = (date / 24 * 60 * 60 * 1000000000 : Time.Time) * 24 * 60 * 60 * 1000000000 : Time.Time;

    var portNum = 0;
    while (portNum < station.ports) {
      var currentTime = dayStart + (station.hours.0 : Nat) * 60 * 60 * 1000000000 : Time.Time;
      let endOfDay = dayStart + (station.hours.1 : Nat) * 60 * 60 * 1000000000 : Time.Time;

      while (currentTime < endOfDay) {
        var isAvailable = true;
        for (booking in bookings.values()) {
          if (booking.stationId == stationId and booking.portNumber == portNum) {
            if (
              booking.startTime <= currentTime and booking.endTime > currentTime
            ) {
              isAvailable := false;
            };
          };
        };

        if (isAvailable) {
          slots.add(currentTime);
        };

        currentTime += slotDuration;
      };
      portNum += 1;
    };

    slots.toArray();
  };

  public shared ({ caller }) func bookSlot(stationId : StationId, portNumber : Nat, startTime : Time.Time) : async BookingId {
    let bookingId = bookingCounter.size();
    bookingCounter.add(bookingId);
    let endTime = startTime + 30 * 60 * 1000000000 : Time.Time;

    let station = switch (stations.get(stationId)) {
      case (null) { Runtime.trap("Station not found") };
      case (?s) { s };
    };

    if (portNumber >= station.ports) {
      Runtime.trap("Invalid port number");
    };

    let availableSlots = await getAvailableSlots(stationId, startTime);
    var isAvailable = false;
    for (slot in availableSlots.values()) {
      if (slot == startTime) {
        isAvailable := true;
      };
    };

    if (not isAvailable) {
      Runtime.trap("Slot not available");
    };

    let booking : Booking = {
      bookingId;
      stationId;
      userId = caller;
      portNumber;
      startTime;
      endTime;
    };

    bookings.add(bookingId, booking);

    switch (userBookings.get(caller)) {
      case (null) {
        let newSet = Set.empty<BookingId>();
        newSet.add(bookingId);
        userBookings.add(caller, newSet);
      };
      case (?bookingSet) {
        bookingSet.add(bookingId);
      };
    };

    bookingId;
  };

  public shared ({ caller }) func cancelBooking(bookingId : BookingId) : async () {
    let booking = switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?b) { b };
    };

    if (booking.userId != caller) {
      Runtime.trap("Unauthorized cancellation");
    };

    let currentTime = Time.now();

    if (booking.startTime - currentTime <= 3600000000000) {
      Runtime.trap("Cannot cancel within 1 hour of start time");
    };

    bookings.remove(bookingId);

    switch (userBookings.get(caller)) {
      case (null) { () };
      case (?bookingSet) {
        bookingSet.remove(bookingId);
      };
    };
  };

  public query ({ caller }) func getMyBookings() : async [Booking] {
    let myBookingIds = switch (userBookings.get(caller)) {
      case (null) { Set.empty<BookingId>() };
      case (?ids) { ids };
    };

    let myBookings = List.empty<Booking>();

    for (bookingId in myBookingIds.values()) {
      switch (bookings.get(bookingId)) {
        case (null) {};
        case (?booking) {
          myBookings.add(booking);
        };
      };
    };

    myBookings.toArray().sort();
  };
};
