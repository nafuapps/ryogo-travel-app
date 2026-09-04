import { db } from "@ryogo-travel-app/db"
import {
  bookings,
  BookingStatusEnum,
  customers,
  drivers,
  DriverStatusEnum,
  InsertBookingType,
  tripLogs,
  TripLogTypesEnum,
  vehicles,
  VehicleStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { eq, and, or, gte, lte, inArray, sql, isNull, not } from "drizzle-orm"
import { addDays, subDays } from "date-fns"

export const bookingRepository = {
  async readDashboardTripsByAgencyId(agencyId: string) {
    return await db.query.bookings.findMany({
      orderBy: (bookings, { asc }) => [asc(bookings.startDate)],
      where: and(
        eq(bookings.agencyId, agencyId),
        or(
          eq(bookings.status, BookingStatusEnum.IN_PROGRESS),
          and(
            eq(bookings.status, BookingStatusEnum.CONFIRMED),
            eq(bookings.startDate, new Date()),
          ),
        ),
      ),
      columns: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
        startTime: true,
        type: true,
      },
      with: {
        assignedDriver: {
          columns: {
            name: true,
          },
          with: {
            user: {
              columns: {
                photoUrl: true,
              },
            },
          },
        },
        assignedVehicle: {
          columns: {
            vehicleNumber: true,
            vehiclePhotoUrl: true,
            type: true,
          },
        },
        assignedUser: {
          columns: {
            id: true,
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

  async readDashboardLeadsByAgencyId(agencyId: string, days: number) {
    return await db.query.bookings.findMany({
      orderBy: (bookings, { asc }) => [asc(bookings.startDate)],
      where: and(
        eq(bookings.agencyId, agencyId),
        and(
          eq(bookings.status, BookingStatusEnum.LEAD),
          or(
            gte(bookings.createdAt, subDays(new Date(), days)),
            lte(bookings.startDate, addDays(new Date(), days)),
          ),
        ),
      ),
      columns: {
        type: true,
        id: true,
        createdAt: true,
        startDate: true,
        endDate: true,
        status: true,
        startTime: true,
        estimatedTotalAmount: true,
      },
      with: {
        assignedUser: {
          columns: {
            id: true,
            name: true,
          },
        },
        customer: {
          columns: {
            name: true,
            phone: true,
            photoUrl: true,
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

  async readPendingPaymentBookings(agencyId: string) {
    return await db.query.bookings.findMany({
      columns: {
        id: true,
        status: true,
        startDate: true,
        endDate: true,
        type: true,
        actualStartDate: true,
        actualEndDate: true,
        estimatedTotalAmount: true,
        actualTotalAmount: true,
      },
      where: and(
        eq(bookings.agencyId, agencyId),
        or(
          eq(bookings.status, BookingStatusEnum.IN_PROGRESS),
          and(
            eq(bookings.status, BookingStatusEnum.COMPLETED),
            isNull(bookings.reviewCompletedByAgencyAt),
          ),
        ),
      ),
      with: {
        assignedUser: {
          columns: {
            id: true,
            name: true,
          },
        },
        transactions: {
          columns: {
            id: true,
            otherParty: true,
            type: true,
            amount: true,
            isApproved: true,
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
        customer: {
          columns: {
            name: true,
            phone: true,
            photoUrl: true,
          },
        },
      },
    })
  },

  async readUpcomingBookingsSchedule(agencyId: string, queryDate: Date) {
    return await db.query.bookings.findMany({
      columns: {
        id: true,
        status: true,
        startDate: true,
        endDate: true,
        assignedUserId: true,
      },
      with: {
        assignedDriver: {
          columns: {
            id: true,
            name: true,
          },
          with: {
            user: {
              columns: {
                photoUrl: true,
              },
            },
          },
        },
        assignedVehicle: {
          columns: {
            id: true,
            vehicleNumber: true,
            vehiclePhotoUrl: true,
          },
        },
      },
      where: and(
        eq(bookings.agencyId, agencyId),
        or(
          eq(bookings.status, BookingStatusEnum.IN_PROGRESS),
          and(
            eq(bookings.status, BookingStatusEnum.CONFIRMED),
            or(
              and(
                lte(bookings.startDate, queryDate),
                gte(bookings.startDate, new Date()),
              ),
              and(
                lte(bookings.endDate, queryDate),
                gte(bookings.endDate, new Date()),
              ),
              and(
                lte(bookings.startDate, new Date()),
                gte(bookings.endDate, queryDate),
              ),
            ),
          ),
        ),
      ),
    })
  },

  async readBookingsSearchData(agencyId: string, queryStartDate: Date) {
    return await db.query.bookings.findMany({
      where: and(
        gte(bookings.createdAt, queryStartDate),
        eq(bookings.agencyId, agencyId),
      ),
      with: {
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
        assignedDriver: {
          columns: {
            name: true,
            phone: true,
          },
        },
        assignedUser: {
          columns: {
            name: true,
            phone: true,
          },
        },
        assignedVehicle: {
          columns: {
            vehicleNumber: true,
          },
        },
        bookedByUser: {
          columns: {
            name: true,
            phone: true,
          },
        },
        customer: {
          columns: {
            name: true,
            phone: true,
          },
        },
      },
    })
  },

  async readCreatedBookingsByStatusDateRange(
    agencyId: string,
    queryStartDate: Date,
    queryEndDate: Date,
    status: BookingStatusEnum[],
  ) {
    return await db.query.bookings.findMany({
      columns: {
        id: true,
        status: true,
        createdAt: true,
        estimatedTotalAmount: true,
        actualTotalAmount: true,
        estimatedCommissionAmount: true,
        actualCommissionAmount: true,
      },
      where: and(
        gte(bookings.createdAt, queryStartDate),
        lte(bookings.createdAt, queryEndDate),
        eq(bookings.agencyId, agencyId),
        inArray(bookings.status, status),
      ),
    })
  },

  async readOngoingBookingsData(agencyId: string) {
    return await db.query.bookings.findMany({
      orderBy: (bookings, { asc }) => [asc(bookings.startDate)],
      where: and(
        eq(bookings.agencyId, agencyId),
        eq(bookings.status, BookingStatusEnum.IN_PROGRESS),
      ),
      columns: {
        type: true,
        id: true,
        startDate: true,
        endDate: true,
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
        assignedUser: {
          columns: {
            id: true,
            name: true,
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
          where: not(eq(tripLogs.type, TripLogTypesEnum.OTHER)),
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
      orderBy: (bookings, { desc }) => [desc(bookings.startDate)],
      where: and(
        eq(bookings.agencyId, agencyId),
        eq(bookings.status, BookingStatusEnum.COMPLETED),
        gte(bookings.completedAt, queryStartDate),
        lte(bookings.completedAt, queryEndDate),
      ),
      columns: {
        status: true,
        completedAt: true,
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

  async readCancelledBookingsData(
    agencyId: string,
    queryStartDate: Date,
    queryEndDate: Date,
  ) {
    return await db.query.bookings.findMany({
      orderBy: (bookings, { desc }) => [desc(bookings.startDate)],
      where: and(
        eq(bookings.agencyId, agencyId),
        eq(bookings.status, BookingStatusEnum.CANCELLED),
        gte(bookings.completedAt, queryStartDate),
        lte(bookings.completedAt, queryEndDate),
      ),
      columns: {
        id: true,
        type: true,
        status: true,
        updatedAt: true,
        remarks: true,
        estimatedTotalAmount: true,
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

  //Read Completed bookings by driver id
  async readCompletedBookingsByDriverId(driverId: string) {
    return await db.query.bookings.findMany({
      limit: 100,
      orderBy: (bookings, { desc }) => [desc(bookings.startDate)],
      where: and(
        eq(bookings.assignedDriverId, driverId),
        eq(bookings.status, BookingStatusEnum.COMPLETED),
      ),
      columns: {
        status: true,
        completedAt: true,
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
          where: eq(tripLogs.type, TripLogTypesEnum.ENDED),
          columns: {
            createdAt: true,
          },
          limit: 1,
        },
      },
    })
  },

  //Read Completed bookings by user id
  async readCompletedBookingsByUserId(userId: string) {
    return await db.query.bookings.findMany({
      limit: 100,
      orderBy: (bookings, { desc }) => [desc(bookings.startDate)],
      where: and(
        eq(bookings.assignedUserId, userId),
        eq(bookings.status, BookingStatusEnum.COMPLETED),
      ),
      columns: {
        status: true,
        completedAt: true,
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
          where: eq(tripLogs.type, TripLogTypesEnum.ENDED),
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
      orderBy: (bookings, { desc }) => [desc(bookings.startDate)],
      where: and(
        eq(bookings.assignedVehicleId, vehicleId),
        eq(bookings.status, BookingStatusEnum.COMPLETED),
      ),
      columns: {
        status: true,
        completedAt: true,
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
          where: eq(tripLogs.type, TripLogTypesEnum.ENDED),
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
      orderBy: (bookings, { desc }) => [desc(bookings.startDate)],
      where: and(
        eq(bookings.customerId, customerId),
        eq(bookings.status, BookingStatusEnum.COMPLETED),
      ),
      columns: {
        status: true,
        completedAt: true,
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
          where: eq(tripLogs.type, TripLogTypesEnum.ENDED),
          columns: {
            createdAt: true,
          },
          limit: 1,
        },
      },
    })
  },

  async readUpcomingBookingsData(agencyId: string, queryStartDate: Date) {
    return await db.query.bookings.findMany({
      orderBy: (bookings, { asc }) => [asc(bookings.startDate)],
      where: and(
        eq(bookings.agencyId, agencyId),
        eq(bookings.status, BookingStatusEnum.CONFIRMED),
        lte(bookings.startDate, queryStartDate),
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
  async readAllAssignedBookingsByVehicleId(vehicleId: string) {
    return await db.query.bookings.findMany({
      orderBy: (bookings, { asc }) => [asc(bookings.startDate)],
      where: and(
        eq(bookings.assignedVehicleId, vehicleId),
        inArray(bookings.status, [
          BookingStatusEnum.CONFIRMED,
          BookingStatusEnum.IN_PROGRESS,
        ]),
      ),
      columns: {
        startDate: true,
        actualStartDate: true,
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
        tripLogs: {
          orderBy: (tripLogs, { desc }) => [desc(tripLogs.createdAt)],
          columns: {
            type: true,
          },
          where: not(eq(tripLogs.type, TripLogTypesEnum.OTHER)),
          limit: 1,
        },
      },
    })
  },

  //Read Assigned bookings by driver id
  async readAllAssignedBookingsByDriverId(driverId: string) {
    return await db.query.bookings.findMany({
      orderBy: (bookings, { asc }) => [asc(bookings.startDate)],
      where: and(
        eq(bookings.assignedDriverId, driverId),
        inArray(bookings.status, [
          BookingStatusEnum.CONFIRMED,
          BookingStatusEnum.IN_PROGRESS,
        ]),
      ),
      columns: {
        startDate: true,
        actualStartDate: true,
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
        tripLogs: {
          orderBy: (tripLogs, { desc }) => [desc(tripLogs.createdAt)],
          columns: {
            type: true,
          },
          where: not(eq(tripLogs.type, TripLogTypesEnum.OTHER)),
          limit: 1,
        },
      },
    })
  },

  //Read Ongoing booking by driver id
  async readOngoingBookingByDriverId(driverId: string) {
    return await db.query.bookings.findFirst({
      orderBy: (bookings, { asc }) => [asc(bookings.startDate)],
      where: and(
        eq(bookings.assignedDriverId, driverId),
        eq(bookings.status, BookingStatusEnum.IN_PROGRESS),
      ),
    })
  },

  //Read First Assigned booking by driver id
  async readFirstAssignedBookingByDriverId(driverId: string) {
    return await db.query.bookings.findFirst({
      orderBy: (bookings, { asc }) => [asc(bookings.startDate)],
      where: and(
        eq(bookings.assignedDriverId, driverId),
        eq(bookings.status, BookingStatusEnum.CONFIRMED),
      ),
    })
  },

  //Read Assigned bookings by user id
  async readAssignedBookingsByUserId(userId: string) {
    return await db.query.bookings.findMany({
      orderBy: (bookings, { asc }) => [asc(bookings.startDate)],
      where: and(
        eq(bookings.assignedUserId, userId),
        inArray(bookings.status, [
          BookingStatusEnum.CONFIRMED,
          BookingStatusEnum.IN_PROGRESS,
        ]),
      ),
      columns: {
        startDate: true,
        actualStartDate: true,
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
        tripLogs: {
          orderBy: (tripLogs, { desc }) => [desc(tripLogs.createdAt)],
          columns: {
            type: true,
          },
          where: not(eq(tripLogs.type, TripLogTypesEnum.OTHER)),
          limit: 1,
        },
      },
    })
  },

  //Read Upcoming bookings by customer id
  async readUpcomingBookingsByCustomerId(customerId: string) {
    return await db.query.bookings.findMany({
      orderBy: (bookings, { asc }) => [asc(bookings.startDate)],
      where: and(
        eq(bookings.customerId, customerId),
        inArray(bookings.status, [
          BookingStatusEnum.CONFIRMED,
          BookingStatusEnum.IN_PROGRESS,
        ]),
      ),
      columns: {
        startDate: true,
        actualStartDate: true,
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
        tripLogs: {
          orderBy: (tripLogs, { desc }) => [desc(tripLogs.createdAt)],
          columns: {
            type: true,
          },
          where: not(eq(tripLogs.type, TripLogTypesEnum.OTHER)),
          limit: 1,
        },
      },
    })
  },

  async readBookingsScheduleData(agencyId: string, queryStartDate: Date) {
    return await db.query.bookings.findMany({
      orderBy: (bookings, { asc }) => [asc(bookings.startDate)],
      where: and(
        eq(bookings.agencyId, agencyId),
        or(
          and(
            eq(bookings.status, BookingStatusEnum.CONFIRMED),
            lte(bookings.startDate, queryStartDate),
          ),
          eq(bookings.status, BookingStatusEnum.IN_PROGRESS),
        ),
      ),
      columns: {
        startDate: true,
        actualStartDate: true,
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
            photoUrl: true,
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

  async readBookingsHistoryData(agencyId: string, queryStartDate: Date) {
    return await db.query.bookings.findMany({
      orderBy: (bookings, { asc }) => [asc(bookings.startDate)],
      where: and(
        eq(bookings.agencyId, agencyId),
        or(
          and(
            eq(bookings.status, BookingStatusEnum.COMPLETED),
            gte(bookings.endDate, queryStartDate),
          ),
          eq(bookings.status, BookingStatusEnum.IN_PROGRESS),
        ),
      ),
      columns: {
        startDate: true,
        actualStartDate: true,
        endDate: true,
        actualEndDate: true,
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
            photoUrl: true,
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
      orderBy: (bookings, { asc }) => [asc(bookings.startDate)],
      where: and(
        eq(bookings.agencyId, agencyId),
        eq(bookings.status, BookingStatusEnum.LEAD),
        gte(bookings.startDate, queryStartDate),
        lte(bookings.startDate, queryEndDate),
      ),
      columns: {
        estimatedTotalAmount: true,
        passengers: true,
        startDate: true,
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

  async readBookingsByBookedUserId(userId: string) {
    return await db.query.bookings.findMany({
      orderBy: (bookings, { desc }) => [desc(bookings.createdAt)],
      limit: 20,
      where: eq(bookings.bookedByUserId, userId),
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

  async readBookingById(id: string) {
    return await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
      with: {
        agency: {
          columns: {
            id: true,
            businessName: true,
            businessPhone: true,
            businessEmail: true,
            businessAddress: true,
            logoUrl: true,
            qrCodeUrl: true,
          },
        },
        assignedUser: {
          columns: {
            id: true,
            userRole: true,
            name: true,
            phone: true,
          },
        },
        assignedDriver: {
          columns: {
            id: true,
            name: true,
            phone: true,
            userId: true,
          },
        },
        assignedVehicle: {
          columns: {
            id: true,
            vehicleNumber: true,
            brand: true,
            model: true,
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
            email: true,
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
        assignedUserId: true,
        assignedDriverId: true,
        assignedVehicleId: true,
        passengers: true,
        needsAc: true,
        startDate: true,
        actualStartDate: true,
        endDate: true,
        actualEndDate: true,
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
            businessName: true,
            businessPhone: true,
            businessEmail: true,
            businessAddress: true,
            logoUrl: true,
            qrCodeUrl: true,
          },
        },
        assignedUser: {
          columns: {
            id: true,
            userRole: true,
            name: true,
            phone: true,
            photoUrl: true,
          },
        },
        assignedDriver: {
          columns: {
            id: true,
            name: true,
            phone: true,
            userId: true,
            canDriveVehicleTypes: true,
          },
          with: {
            user: {
              columns: {
                photoUrl: true,
              },
            },
          },
        },
        assignedVehicle: {
          columns: {
            id: true,
            vehicleNumber: true,
            odometerReading: true,
            brand: true,
            model: true,
            type: true,
            capacity: true,
            hasAC: true,
            color: true,
            vehiclePhotoUrl: true,
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
            email: true,
            photoUrl: true,
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
        tripLogs: {
          orderBy: (tripLogs, { asc }) => [asc(tripLogs.createdAt)],
          columns: {
            id: true,
            type: true,
            odometerReading: true,
            tripLogPhotoUrl: true,
            remarks: true,
            latLong: true,
            createdAt: true,
          },
        },
        expenses: {
          columns: {
            id: true,
            addedByUserId: true,
            amount: true,
            expensePhotoUrl: true,
            isApproved: true,
            type: true,
            remarks: true,
            createdAt: true,
          },
          with: {
            addedByUser: {
              columns: {
                name: true,
                userRole: true,
                id: true,
              },
            },
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
    startTime: string,
    pickupAddress: string,
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
      .returning({
        id: bookings.id,
        status: bookings.status,
        startTime: bookings.startTime,
        pickupAddress: bookings.pickupAddress,
        dropAddress: bookings.dropAddress,
      })
  },

  async startBookingTransaction(
    bookingId: string,
    driverId: string,
    vehicleId: string,
  ) {
    return await db.transaction(async (tx) => {
      await tx
        .update(bookings)
        .set({
          status: BookingStatusEnum.IN_PROGRESS,
          actualStartDate: new Date(),
        })
        .where(eq(bookings.id, bookingId))
      await tx
        .update(drivers)
        .set({
          status: DriverStatusEnum.ON_TRIP,
        })
        .where(eq(drivers.id, driverId))
      await tx
        .update(vehicles)
        .set({
          status: VehicleStatusEnum.ON_TRIP,
        })
        .where(eq(vehicles.id, vehicleId))

      return await tx.query.bookings.findFirst({
        columns: {
          id: true,
          status: true,
        },
        where: eq(bookings.id, bookingId),
      })
    })
  },

  async completeBookingTransaction(
    bookingId: string,
    driverId: string,
    vehicleId: string,
    customerId: string,
    customerRating?: number,
    bookingRating?: number,
  ) {
    return await db.transaction(async (tx) => {
      await tx
        .update(bookings)
        .set({
          status: BookingStatusEnum.COMPLETED,
          actualEndDate: new Date(),
          completedAt: new Date(),
          ratingByDriver: bookingRating,
        })
        .where(eq(bookings.id, bookingId))
      await tx
        .update(drivers)
        .set({
          status: DriverStatusEnum.AVAILABLE,
        })
        .where(eq(drivers.id, driverId))
      await tx
        .update(vehicles)
        .set({
          status: VehicleStatusEnum.AVAILABLE,
        })
        .where(eq(vehicles.id, vehicleId))
      if (customerRating) {
        await tx
          .update(customers)
          .set({
            driverRatings: sql`array_append(${customers.driverRatings}, ${customerRating})`,
          })
          .where(eq(customers.id, customerId))
      }
      return await tx.query.bookings.findFirst({
        columns: {
          id: true,
          status: true,
        },
        where: eq(bookings.id, bookingId),
      })
    })
  },

  async updateStatus(id: string, status: BookingStatusEnum) {
    return await db
      .update(bookings)
      .set({
        status,
      })
      .where(eq(bookings.id, id))
      .returning({
        id: bookings.id,
        status: bookings.status,
      })
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
      .returning({
        id: bookings.id,
        status: bookings.status,
        assignedDriverId: bookings.assignedDriverId,
        assignedVehicleId: bookings.assignedVehicleId,
      })
  },

  async updateAssignedDriver(bookingId: string, driverId: string) {
    return await db
      .update(bookings)
      .set({
        assignedDriverId: driverId,
      })
      .where(eq(bookings.id, bookingId))
      .returning({
        id: bookings.id,
        assignedDriverId: bookings.assignedDriverId,
      })
  },

  async updateAssignedVehicle(bookingId: string, vehicleId: string) {
    return await db
      .update(bookings)
      .set({
        assignedVehicleId: vehicleId,
      })
      .where(eq(bookings.id, bookingId))
      .returning({
        id: bookings.id,
        assignedVehicleId: bookings.assignedVehicleId,
        startDate: bookings.startDate,
        status: bookings.status,
        assignedDriverId: bookings.assignedDriverId,
      })
  },

  async updateAssignedUser(bookingId: string, userId: string) {
    return await db
      .update(bookings)
      .set({
        assignedUserId: userId,
      })
      .where(eq(bookings.id, bookingId))
      .returning({ id: bookings.id, assignedUserId: bookings.assignedUserId })
  },

  async updateQuoteUrl(id: string, url: string) {
    return await db
      .update(bookings)
      .set({
        quoteSentOn: new Date(),
        quoteUrl: url,
      })
      .where(eq(bookings.id, id))
      .returning({
        id: bookings.id,
        quoteSent: bookings.quoteSentOn,
        quoteUrl: bookings.quoteUrl,
      })
  },

  async updateQuoteSent(id: string) {
    return await db
      .update(bookings)
      .set({
        quoteSentOn: new Date(),
      })
      .where(eq(bookings.id, id))
      .returning({
        id: bookings.id,
        quoteSent: bookings.quoteSentOn,
      })
  },

  async updateConfirmationUrl(id: string, url: string) {
    return await db
      .update(bookings)
      .set({
        confirmationSentOn: new Date(),
        confirmationUrl: url,
      })
      .where(eq(bookings.id, id))
      .returning({
        id: bookings.id,
        confirmationSent: bookings.confirmationSentOn,
        confirmationUrl: bookings.confirmationUrl,
      })
  },

  async updateConfirmationSent(id: string) {
    return await db
      .update(bookings)
      .set({
        confirmationSentOn: new Date(),
      })
      .where(eq(bookings.id, id))
      .returning({
        id: bookings.id,
        confirmationSent: bookings.confirmationSentOn,
      })
  },

  async updateInvoiceUrl(id: string, url: string) {
    return await db
      .update(bookings)
      .set({
        invoiceSentOn: new Date(),
        invoiceUrl: url,
      })
      .where(eq(bookings.id, id))
      .returning({
        id: bookings.id,
        invoiceSent: bookings.invoiceSentOn,
        invoiceUrl: bookings.invoiceUrl,
      })
  },

  async updateInvoiceSent(id: string) {
    return await db
      .update(bookings)
      .set({
        invoiceSentOn: new Date(),
      })
      .where(eq(bookings.id, id))
      .returning({
        id: bookings.id,
        invoiceSentOn: bookings.invoiceSentOn,
      })
  },

  async updateStartTime(id: string, startTime: string) {
    return await db
      .update(bookings)
      .set({
        startTime,
      })
      .where(eq(bookings.id, id))
      .returning({
        id: bookings.id,
        startTime: bookings.startTime,
      })
  },

  async updateRemarks(id: string, remarks: string) {
    return await db
      .update(bookings)
      .set({
        remarks,
      })
      .where(eq(bookings.id, id))
      .returning({
        id: bookings.id,
        remarks: bookings.remarks,
      })
  },

  async updatePickupAddress(id: string, pickupAddress: string) {
    return await db
      .update(bookings)
      .set({
        pickupAddress,
      })
      .where(eq(bookings.id, id))
      .returning({
        id: bookings.id,
        pickupAddress: bookings.pickupAddress,
      })
  },

  async updateDropAddress(id: string, dropAddress: string) {
    return await db
      .update(bookings)
      .set({
        dropAddress,
      })
      .where(eq(bookings.id, id))
      .returning({
        id: bookings.id,
        dropAddress: bookings.dropAddress,
      })
  },

  async updateReviewCompletedAt(id: string) {
    return await db
      .update(bookings)
      .set({
        reviewCompletedByAgencyAt: new Date(),
      })
      .where(eq(bookings.id, id))
      .returning({
        id: bookings.id,
        reviewCompletedByAgencyAt: bookings.reviewCompletedByAgencyAt,
      })
  },

  async updateBookingTotals(
    bookingId: string,
    startDate: Date,
    endDate: Date,
    actualTotalDistance: number,
    actualTotalVehicleRate: number,
    actualTotalAcCharge: number,
    actualTotalDriverAllowance: number,
    actualCommissionAmount: number,
    actualTotalAmount: number,
  ) {
    return await db
      .update(bookings)
      .set({
        startDate,
        endDate,
        actualTotalDistance,
        actualTotalVehicleRate,
        actualTotalAcCharge,
        actualTotalDriverAllowance,
        actualCommissionAmount,
        actualTotalAmount,
      })
      .where(eq(bookings.id, bookingId))
  },
}
