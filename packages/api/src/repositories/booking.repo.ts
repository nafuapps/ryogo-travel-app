import { db } from "@ryogo-travel-app/db"
import {
  bookings,
  BookingStatusEnum,
  InsertBookingType,
  tripLogs,
  TripLogTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { eq, and, gte, lte, inArray } from "drizzle-orm"

export const bookingRepository = {
  async readBookingsByStatusCreatedDateRange(
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
      )
  },

  async readBookingsByUpdatedDateRange(
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
      )
  },

  async readBookingsByStatus(status: BookingStatusEnum, agencyId: string) {
    return await db
      .select()
      .from(bookings)
      .where(and(eq(bookings.status, status), eq(bookings.agencyId, agencyId)))
  },

  async readOngoingBookingsData(agencyId: string) {
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
    })
  },

  async readCompletedBookingsData(
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
    })
  },

  async readUpcomingBookingsData(
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
    })
  },

  async readLeadBookingsData(agencyId: string, startDate: Date, endDate: Date) {
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
    })
  },

  async readBookingById(id: string) {
    return await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
      with: {
        agency: {
          columns: {
            id: true,
          },
        },
        assignedUser: {
          columns: {
            id: true,
            userRole: true,
            name: true,
          },
        },
        assignedDriver: {
          columns: {
            id: true,
            name: true,
          },
        },
        assignedVehicle: {
          columns: {
            id: true,
            vehicleNumber: true,
          },
        },
        bookedByUser: {
          columns: {
            id: true,
            name: true,
          },
        },
        source: {
          columns: {
            city: true,
            state: true,
          },
        },
        destination: {
          columns: {
            city: true,
            state: true,
          },
        },
        customer: {
          columns: {
            id: true,
            name: true,
            remarks: true,
            phone: true,
            address: true,
          },
          with: {
            location: {
              columns: {
                city: true,
                state: true,
              },
            },
            bookings: {
              columns: {
                id: true,
                status: true,
              },
            },
          },
        },
        route: {
          columns: {
            id: true,
            distance: true,
          },
        },
      },
    })
  },

  async readBookingStatusById(id: string) {
    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
      columns: {
        id: true,
        status: true,
        agencyId: true,
      },
    })
    return booking
  },

  async readBookingDetailsById(id: string) {
    return await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
      with: {
        agency: {
          columns: {
            id: true,
          },
        },
        assignedUser: {
          columns: {
            id: true,
            userRole: true,
            name: true,
          },
        },
        assignedDriver: {
          columns: {
            id: true,
            name: true,
          },
        },
        assignedVehicle: {
          columns: {
            id: true,
            vehicleNumber: true,
          },
        },
        bookedByUser: {
          columns: {
            id: true,
            name: true,
          },
        },
        source: {
          columns: {
            city: true,
            state: true,
          },
        },
        destination: {
          columns: {
            city: true,
            state: true,
          },
        },
        customer: {
          columns: {
            id: true,
            name: true,
            remarks: true,
            phone: true,
            address: true,
          },
          with: {
            location: {
              columns: {
                city: true,
                state: true,
              },
            },
            bookings: {
              columns: {
                id: true,
                status: true,
              },
            },
          },
        },
        route: {
          columns: {
            id: true,
            distance: true,
          },
        },
      },
    })
  },

  async createBooking(data: InsertBookingType) {
    return await db.insert(bookings).values(data).returning()
  },

  async updateBookingToConfirmed(
    id: string,
    startTime?: string,
    pickupAddress?: string,
    dropAddress?: string
  ) {
    return await db
      .update(bookings)
      .set({
        status: BookingStatusEnum.CONFIRMED,
        startTime: startTime,
        pickupAddress: pickupAddress,
        dropAddress: dropAddress,
      })
      .where(eq(bookings.id, id))
      .returning({ id: bookings.id })
  },

  async updateBookingToCancel(id: string) {
    return await db
      .update(bookings)
      .set({
        status: BookingStatusEnum.CANCELLED,
        assignedDriverId: null,
        assignedVehicleId: null,
      })
      .where(eq(bookings.id, id))
      .returning()
  },

  async updateAssignedDriver(bookingId: string, driverId: string) {
    return await db
      .update(bookings)
      .set({
        assignedDriverId: driverId,
      })
      .where(eq(bookings.id, bookingId))
      .returning()
  },

  async updateAssignedVehicle(bookingId: string, vehicleId: string) {
    return await db
      .update(bookings)
      .set({
        assignedVehicleId: vehicleId,
      })
      .where(eq(bookings.id, bookingId))
      .returning()
  },
}
