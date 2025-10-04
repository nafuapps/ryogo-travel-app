import { db } from "@ryogo-travel-app/db";
import { bookings, BookingStatusEnum } from "@ryogo-travel-app/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export const bookingRepository = {
  async getBookingsByStatusCreatedDateRange(
    agencyId: string,
    startDate: Date,
    endDate: Date,
    status: BookingStatusEnum
  ) {
    return await db
      .select()
      .from(bookings)
      .where(
        and(
          gte(bookings.createdAt, startDate),
          lte(bookings.createdAt, endDate),
          eq(bookings.agencyId, agencyId),
          eq(bookings.status, status)
        )
      );
  },

  async getBookingsByUpdatedDateRange(
    startDate: Date,
    endDate: Date,
    agencyId: string
  ) {
    return await db
      .select()
      .from(bookings)
      .where(
        and(
          gte(bookings.createdAt, startDate),
          lte(bookings.createdAt, endDate),
          eq(bookings.agencyId, agencyId)
        )
      );
  },

  async getBookingsByStatus(status: BookingStatusEnum, agencyId: string) {
    return await db
      .select()
      .from(bookings)
      .where(and(eq(bookings.status, status), eq(bookings.agencyId, agencyId)));
  },
};
