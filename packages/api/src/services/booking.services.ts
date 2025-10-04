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
};
