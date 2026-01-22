import { db } from "@ryogo-travel-app/db"
import {
  bookings,
  BookingStatusEnum,
  InsertBookingType,
  tripLogs,
  TripLogTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { eq, and, or, gte, lte } from "drizzle-orm"

export const bookingRepository = {
  async readBookingsByStatusCreatedDateRange(
    agencyId: string,
    queryStartDate: Date,
    queryEndDate: Date,
    status: BookingStatusEnum,
  ) {
    return await db
      .select()
      .from(bookings)
      .where(
        and(
          gte(bookings.createdAt, queryStartDate),
          lte(bookings.createdAt, queryEndDate),
          eq(bookings.agencyId, agencyId),
          eq(bookings.status, status),
        ),
      )
  },

  async readBookingsByUpdatedDateRange(
    queryStartDate: Date,
    queryEndDate: Date,
    agencyId: string,
  ) {
    return await db
      .select()
      .from(bookings)
      .where(
        and(
          gte(bookings.createdAt, queryStartDate),
          lte(bookings.createdAt, queryEndDate),
          eq(bookings.agencyId, agencyId),
        ),
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
        eq(bookings.status, BookingStatusEnum.IN_PROGRESS),
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
    queryStartDate: Date,
    queryEndDate: Date,
  ) {
    return await db.query.bookings.findMany({
      where: and(
        eq(bookings.agencyId, agencyId),
        eq(bookings.status, BookingStatusEnum.COMPLETED),
        gte(bookings.updatedAt, queryStartDate),
        lte(bookings.updatedAt, queryEndDate),
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

  //Read Completed bookings by driver id
  async readCompletedBookingsByDriverId(driverId: string) {
    return await db.query.bookings.findMany({
      limit: 100,
      where: and(
        eq(bookings.assignedDriverId, driverId),
        eq(bookings.status, BookingStatusEnum.COMPLETED),
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

  //Read Completed bookings by vehicle id
  async readCompletedBookingsByVehicleId(vehicleId: string) {
    return await db.query.bookings.findMany({
      limit: 100,
      where: and(
        eq(bookings.assignedVehicleId, vehicleId),
        eq(bookings.status, BookingStatusEnum.COMPLETED),
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

  //Read Completed bookings by customer id
  async readCompletedBookingsByCustomerId(customerId: string) {
    return await db.query.bookings.findMany({
      limit: 100,
      where: and(
        eq(bookings.customerId, customerId),
        eq(bookings.status, BookingStatusEnum.COMPLETED),
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
    queryStartDate: Date,
    queryEndDate: Date,
  ) {
    return await db.query.bookings.findMany({
      where: and(
        eq(bookings.agencyId, agencyId),
        eq(bookings.status, BookingStatusEnum.CONFIRMED),
        lte(bookings.startDate, queryEndDate),
        gte(bookings.endDate, queryStartDate),
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

  //Read Assigned bookings by vehicle id
  async readAssignedBookingsByVehicleId(vehicleId: string) {
    return await db.query.bookings.findMany({
      where: and(
        eq(bookings.assignedVehicleId, vehicleId),
        eq(bookings.status, BookingStatusEnum.CONFIRMED),
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

  //Read Assigned bookings by driver id
  async readAssignedBookingsByDriverId(driverId: string) {
    return await db.query.bookings.findMany({
      where: and(
        eq(bookings.assignedDriverId, driverId),
        eq(bookings.status, BookingStatusEnum.CONFIRMED),
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

  //Read Upcoming bookings by customer id
  async readUpcomingBookingsByCustomerId(customerId: string) {
    return await db.query.bookings.findMany({
      where: and(
        eq(bookings.customerId, customerId),
        eq(bookings.status, BookingStatusEnum.CONFIRMED),
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

  async readBookingsScheduleData(
    agencyId: string,
    queryStartDate: Date,
    queryEndDate: Date,
  ) {
    return await db.query.bookings.findMany({
      where: and(
        eq(bookings.agencyId, agencyId),
        or(
          and(
            eq(bookings.status, BookingStatusEnum.CONFIRMED),
            gte(bookings.endDate, queryStartDate),
            lte(bookings.startDate, queryEndDate),
          ),
          eq(bookings.status, BookingStatusEnum.IN_PROGRESS),
        ),
      ),
      columns: {
        startDate: true,
        endDate: true,
        updatedAt: true,
        type: true,
        id: true,
        status: true,
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

  async readLeadBookingsData(
    agencyId: string,
    queryStartDate: Date,
    queryEndDate: Date,
  ) {
    return await db.query.bookings.findMany({
      where: and(
        eq(bookings.agencyId, agencyId),
        eq(bookings.status, BookingStatusEnum.LEAD),
        gte(bookings.createdAt, queryStartDate),
        lte(bookings.createdAt, queryEndDate),
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
    dropAddress?: string,
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

  async updateAssignedUser(bookingId: string, userId: string) {
    return await db
      .update(bookings)
      .set({
        assignedUserId: userId,
      })
      .where(eq(bookings.id, bookingId))
      .returning()
  },
}
