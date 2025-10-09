import { db } from "@ryogo-travel-app/db";
import {
  bookings,
  BookingStatusEnum,
  tripLogs,
  TripLogTypesEnum,
} from "@ryogo-travel-app/db/schema";
import { eq, and, gte, lte, inArray } from "drizzle-orm";

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

  async getOngoingBookingsData(agencyId: string) {
    return await db.query.bookings.findMany({
      where: and(
        eq(bookings.agencyId, agencyId),
        eq(bookings.status, BookingStatusEnum.IN_PROGRESS)
      ),
      columns: {
        type: true,
        id: true,
      },
      with: {
        assignedDriver: {
          columns: {
            name: true,
          },
        },
        assignedVehicle: {
          columns: {
            vehicleNumber: true,
          },
        },
        customer: {
          columns: {
            name: true,
          },
        },
        source: {
          columns: {
            city: true,
          },
        },
        destination: {
          columns: {
            city: true,
          },
        },
        tripLogs: {
          orderBy: (tripLogs, { desc }) => [desc(tripLogs.createdAt)],
          columns: {
            type: true,
          },
          limit: 1,
        },
      },
    });
  },

  async getCompletedBookingsData(
    agencyId: string,
    startDate: Date,
    endDate: Date
  ) {
    return await db.query.bookings.findMany({
      where: and(
        eq(bookings.agencyId, agencyId),
        inArray(bookings.status, [
          BookingStatusEnum.COMPLETED,
          BookingStatusEnum.RECONCILED,
        ]),
        gte(bookings.createdAt, startDate),
        lte(bookings.createdAt, endDate)
      ),
      columns: {
        status: true,
        updatedAt: true,
        type: true,
        id: true,
      },
      with: {
        assignedDriver: {
          columns: {
            name: true,
          },
        },
        assignedVehicle: {
          columns: {
            vehicleNumber: true,
          },
        },
        customer: {
          columns: {
            name: true,
          },
        },
        source: {
          columns: {
            city: true,
          },
        },
        destination: {
          columns: {
            city: true,
          },
        },
        tripLogs: {
          where: eq(tripLogs.type, TripLogTypesEnum.END_TRIP),
          columns: {
            createdAt: true,
          },
          limit: 1,
        },
      },
    });
  },

  async getUpcomingBookingsData(
    agencyId: string,
    startDate: Date,
    endDate: Date
  ) {
    return await db.query.bookings.findMany({
      where: and(
        eq(bookings.agencyId, agencyId),
        eq(bookings.status, BookingStatusEnum.CONFIRMED),
        gte(bookings.createdAt, startDate),
        lte(bookings.createdAt, endDate)
      ),
      columns: {
        startDate: true,
        startTime: true,
        endDate: true,
        updatedAt: true,
        type: true,
        id: true,
      },
      with: {
        assignedDriver: {
          columns: {
            name: true,
          },
        },
        assignedVehicle: {
          columns: {
            vehicleNumber: true,
          },
        },
        customer: {
          columns: {
            name: true,
          },
        },
        source: {
          columns: {
            city: true,
          },
        },
        destination: {
          columns: {
            city: true,
          },
        },
      },
    });
  },

  async getLeadBookingsData(agencyId: string, startDate: Date, endDate: Date) {
    return await db.query.bookings.findMany({
      where: and(
        eq(bookings.agencyId, agencyId),
        eq(bookings.status, BookingStatusEnum.LEAD),
        gte(bookings.createdAt, startDate),
        lte(bookings.createdAt, endDate)
      ),
      columns: {
        totalAmount: true,
        passengers: true,
        createdAt: true,
        type: true,
        id: true,
      },
      with: {
        customer: {
          columns: {
            name: true,
          },
        },
        source: {
          columns: {
            city: true,
          },
        },
        destination: {
          columns: {
            city: true,
          },
        },
        assignedUser: {
          columns: {
            name: true,
          },
        },
      },
    });
  },
};
