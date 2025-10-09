import { BookingStatusEnum } from "@ryogo-travel-app/db/schema";
import { bookingRepository } from "../repositories/booking.repo";

export const bookingServices = {
  async findConfirmedBookingsPreviousDays(agencyId: string, days: number = 1) {
    //Day N days ago
    const startDate = new Date(
      new Date().getTime() - days * 24 * 60 * 60 * 1000
    );
    //Day today
    const endDate = new Date();
    const bookings =
      await bookingRepository.getBookingsByStatusCreatedDateRange(
        agencyId,
        startDate,
        endDate,
        BookingStatusEnum.CONFIRMED
      );
    return bookings.map((booking) => {
      return {
        id: booking.id,
        status: booking.status,
        createdAt: booking.createdAt,
      };
    });
  },

  async findBookingsRevenuePreviousDays(agencyId: string, days: number = 1) {
    //Day N days ago
    const startDate = new Date(
      new Date().getTime() - days * 24 * 60 * 60 * 1000
    );
    //Day today
    const endDate = new Date();

    const bookings =
      await bookingRepository.getBookingsByStatusCreatedDateRange(
        agencyId,
        startDate,
        endDate,
        BookingStatusEnum.CONFIRMED
      );
    return bookings.map((booking) => {
      return {
        id: booking.id,
        createdAt: booking.createdAt,
        totalAmount: booking.totalAmount,
        commissionRate: booking.commissionRate,
      };
    });
  },

  async findBookingsUpdatedPreviousDays(agencyId: string, days: number = 1) {
    //Day N days ago
    const startDate = new Date(
      new Date().getTime() - days * 24 * 60 * 60 * 1000
    );
    //Day today
    const endDate = new Date();

    const bookings = await bookingRepository.getBookingsByUpdatedDateRange(
      startDate,
      endDate,
      agencyId
    );

    return bookings.map((booking) => {
      return {
        id: booking.id,
        status: booking.status,
        updatedAt: booking.updatedAt,
      };
    });
  },

  async findInProgressBookings(agencyId: string) {
    const bookings = await bookingRepository.getBookingsByStatus(
      BookingStatusEnum.IN_PROGRESS,
      agencyId
    );
    return bookings.map((booking) => {
      return {
        id: booking.id,
      };
    });
  },

  async findOngoingTrips(agencyId: string) {
    const bookings = await bookingRepository.getOngoingBookingsData(agencyId);
    return bookings.map((booking) => {
      return {
        type: booking.type.toString(),
        route: booking.source?.city + " - " + booking.destination?.city,
        vehicle: booking.assignedVehicle?.vehicleNumber,
        driver: booking.assignedDriver?.name,
        customerName: booking.customer?.name,
        bookingId: booking.id,
        status: booking.tripLogs[0]?.type.toString(),
      };
    });
  },

  async findCompletedBookingsPreviousDays(agencyId: string, days: number = 1) {
    //Day N days ago
    const startDate = new Date(
      new Date().getTime() - days * 24 * 60 * 60 * 1000
    );
    //Day today
    const endDate = new Date();
    const bookings = await bookingRepository.getCompletedBookingsData(
      agencyId,
      startDate,
      endDate
    );
    return bookings.map((booking) => {
      return {
        status: booking.status.toString(),
        updatedAt: booking.updatedAt,
        type: booking.type.toString(),
        route: booking.source?.city + " - " + booking.destination?.city,
        vehicle: booking.assignedVehicle?.vehicleNumber,
        driver: booking.assignedDriver?.name,
        customerName: booking.customer?.name,
        bookingId: booking.id,
        createdAt: booking.tripLogs[0]?.createdAt,
      };
    });
  },

  async findUpcomingBookingsNextDays(agencyId: string, days: number = 1) {
    //Day today
    const startDate = new Date();
    //Day N days later
    const endDate = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000);
    const bookings = await bookingRepository.getUpcomingBookingsData(
      agencyId,
      startDate,
      endDate
    );
    return bookings.map((booking) => {
      return {
        type: booking.type.toString(),
        route: booking.source?.city + " - " + booking.destination?.city,
        vehicle: booking.assignedVehicle?.vehicleNumber,
        driver: booking.assignedDriver?.name,
        customerName: booking.customer?.name,
        bookingId: booking.id,
        startDate: booking.startDate,
        startTime: booking.startTime,
        endDate: booking.endDate,
      };
    });
  },

  async findLeadBookingsPreviousDays(agencyId: string, days: number = 1) {
    const startDate = new Date(
      new Date().getTime() - days * 24 * 60 * 60 * 1000
    );
    //Day today
    const endDate = new Date();
    const bookings = await bookingRepository.getLeadBookingsData(
      agencyId,
      startDate,
      endDate
    );
    return bookings.map((booking) => {
      return {
        type: booking.type.toString(),
        route: booking.source?.city + " - " + booking.destination?.city,
        customerName: booking.customer?.name,
        bookingId: booking.id,
        createdAt: booking.createdAt,
        assignedUser: booking.assignedUser.name,
        passengers: booking.passengers,
        amount: booking.totalAmount,
      };
    });
  },
};
