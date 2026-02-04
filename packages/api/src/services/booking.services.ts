import {
  BookingStatusEnum,
  DriverStatusEnum,
  InsertBookingType,
  VehicleStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { bookingRepository } from "../repositories/booking.repo"
import { CreateNewBookingRequestType } from "../types/booking.types"
import { locationRepository } from "../repositories/location.repo"
import { customerServices } from "./customer.services"
import { routeServices } from "./route.services"
import { customerRepository } from "../repositories/customer.repo"
import { expenseRepository } from "../repositories/expense.repo"
import { tripLogRepository } from "../repositories/tripLog.repo"
import { transactionRepository } from "../repositories/transaction.repo"
import { driverRepository } from "../repositories/driver.repo"
import { vehicleRepository } from "../repositories/vehicle.repo"

export const bookingServices = {
  //Bookings dashboard
  async findConfirmedBookingsPreviousDays(agencyId: string, days: number = 1) {
    //Day N days ago
    const startDate = new Date(
      new Date().getTime() - days * 24 * 60 * 60 * 1000,
    )
    //Day today
    const endDate = new Date()
    const bookings =
      await bookingRepository.readBookingsByStatusCreatedDateRange(
        agencyId,
        startDate,
        endDate,
        BookingStatusEnum.CONFIRMED,
      )
    return bookings.map((booking) => {
      return {
        id: booking.id,
        status: booking.status,
        createdAt: booking.createdAt,
      }
    })
  },

  async findBookingsRevenuePreviousDays(agencyId: string, days: number = 1) {
    //Day N days ago
    const startDate = new Date(
      new Date().getTime() - days * 24 * 60 * 60 * 1000,
    )
    //Day today
    const endDate = new Date()

    const bookings =
      await bookingRepository.readBookingsByStatusCreatedDateRange(
        agencyId,
        startDate,
        endDate,
        BookingStatusEnum.CONFIRMED,
      )
    return bookings.map((booking) => {
      return {
        id: booking.id,
        createdAt: booking.createdAt,
        totalAmount: booking.totalAmount,
        commissionRate: booking.commissionRate,
      }
    })
  },

  async findBookingsUpdatedPreviousDays(agencyId: string, days: number = 1) {
    //Day N days ago
    const startDate = new Date(
      new Date().getTime() - days * 24 * 60 * 60 * 1000,
    )
    //Day today
    const endDate = new Date()

    const bookings = await bookingRepository.readBookingsByUpdatedDateRange(
      startDate,
      endDate,
      agencyId,
    )

    return bookings.map((booking) => {
      return {
        id: booking.id,
        status: booking.status,
        updatedAt: booking.updatedAt,
      }
    })
  },

  async findInProgressBookings(agencyId: string) {
    const bookings = await bookingRepository.readBookingsByStatus(
      BookingStatusEnum.IN_PROGRESS,
      agencyId,
    )
    return bookings.map((booking) => {
      return {
        id: booking.id,
      }
    })
  },

  async findOngoingTrips(agencyId: string) {
    const bookings = await bookingRepository.readOngoingBookingsData(agencyId)
    return bookings.map((booking) => {
      return {
        type: booking.type.toString(),
        route: booking.source.city + " - " + booking.destination.city,
        vehicle: booking.assignedVehicle?.vehicleNumber,
        driver: booking.assignedDriver?.name,
        customerName: booking.customer.name,
        bookingId: booking.id,
        status: booking.tripLogs[0]?.type.toString(),
      }
    })
  },

  async findCompletedBookingsPreviousDays(agencyId: string, days: number = 1) {
    //Day N days ago
    const startDate = new Date(
      new Date().getTime() - days * 24 * 60 * 60 * 1000,
    )
    //Day today
    const endDate = new Date()
    const bookings = await bookingRepository.readCompletedBookingsData(
      agencyId,
      startDate,
      endDate,
    )
    return bookings.map((booking) => {
      return {
        status: booking.status.toString(),
        updatedAt: booking.updatedAt,
        type: booking.type.toString(),
        route: booking.source.city + " - " + booking.destination.city,
        vehicle: booking.assignedVehicle?.vehicleNumber,
        driver: booking.assignedDriver?.name,
        customerName: booking.customer?.name,
        bookingId: booking.id,
        createdAt: booking.tripLogs[0]?.createdAt,
      }
    })
  },

  async findUpcomingBookingsNextDays(agencyId: string, days: number = 1) {
    //Day today
    const startDate = new Date()
    //Day N days later
    const endDate = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000)
    const bookings = await bookingRepository.readUpcomingBookingsData(
      agencyId,
      startDate,
      endDate,
    )
    return bookings.map((booking) => {
      return {
        type: booking.type.toString(),
        route: booking.source.city + " - " + booking.destination.city,
        vehicle: booking.assignedVehicle?.vehicleNumber,
        driver: booking.assignedDriver?.name,
        customerName: booking.customer?.name,
        bookingId: booking.id,
        startDate: booking.startDate,
        startTime: booking.startTime,
        endDate: booking.endDate,
      }
    })
  },

  async findBookingsScheduleNextDays(agencyId: string, days: number = 7) {
    //Day today
    const startDate = new Date()
    //Day N days later
    const endDate = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000)
    const bookings = await bookingRepository.readBookingsScheduleData(
      agencyId,
      startDate,
      endDate,
    )
    return bookings.map((booking) => {
      return {
        type: booking.type.toString(),
        route: booking.source.city + " - " + booking.destination.city,
        vehicle: booking.assignedVehicle?.vehicleNumber,
        driver: booking.assignedDriver?.name,
        customerName: booking.customer?.name,
        bookingId: booking.id,
        startDate: booking.startDate,
        endDate: booking.endDate,
        status: booking.status,
      }
    })
  },

  async findLeadBookingsPreviousDays(agencyId: string, days: number = 1) {
    const startDate = new Date(
      new Date().getTime() - days * 24 * 60 * 60 * 1000,
    )
    //Day today
    const endDate = new Date()
    const bookings = await bookingRepository.readLeadBookingsData(
      agencyId,
      startDate,
      endDate,
    )
    return bookings.map((booking) => {
      return {
        type: booking.type.toString(),
        route: booking.source.city + " - " + booking.destination.city,
        customerName: booking.customer.name,
        bookingId: booking.id,
        createdAt: booking.createdAt,
        assignedUser: booking.assignedUser.name,
        passengers: booking.passengers,
        amount: booking.totalAmount,
      }
    })
  },

  //Get assigned user id by booking id
  async findAssignedUserIdByBookingId(bookingId: string) {
    const booking = await bookingRepository.readBookingById(bookingId)
    if (!booking) return
    return booking.assignedUserId
  },

  //Get (lead) booking by id
  async findLeadBookingById(bookingId: string) {
    const booking = await bookingRepository.readBookingById(bookingId)
    return booking
  },

  //Get booking status by id
  async findBookingStatusById(bookingId: string) {
    const booking = await bookingRepository.readBookingStatusById(bookingId)
    return booking
  },

  //Get booking details by id
  async findBookingDetailsById(bookingId: string) {
    const booking = await bookingRepository.readBookingDetailsById(bookingId)
    return booking
  },

  //Get transactions by booking id
  async findBookingTransactionsById(bookingId: string) {
    const bookingTransactions =
      await transactionRepository.readTransactionsByBookingId(bookingId)
    return bookingTransactions
  },

  //Get booking expenses by id
  async findBookingExpensesById(bookingId: string) {
    const bookingExpenses =
      await expenseRepository.readExpensesByBookingId(bookingId)
    return bookingExpenses
  },

  //Get booking trip logs by id
  async findBookingTripLogsById(bookingId: string) {
    const bookingTripLogs =
      await tripLogRepository.readTripLogsByBookingId(bookingId)
    return bookingTripLogs
  },

  //Create a new Booking
  async addNewBooking(data: CreateNewBookingRequestType) {
    //Step1: If no existing customer, create a new customer
    let customerId = data.existingCustomerId
    if (!customerId) {
      if (
        !data.newCustomerName ||
        !data.newCustomerLocationCity ||
        !data.newCustomerLocationState
      )
        return
      const newCustomer = await customerServices.addNewCustomer(
        data.newCustomerName,
        data.customerPhone,
        data.newCustomerLocationCity,
        data.newCustomerLocationState,
        data.agencyId,
        data.userId,
      )
      if (!newCustomer) return
      customerId = newCustomer.id
    }

    //Step2: Get trip sourceId and destinationId from city & state
    let sourceId = data.sourceId
    if (!sourceId) {
      const source = await locationRepository.readLocationByCityState(
        data.tripSourceLocationCity,
        data.tripSourceLocationState,
      )
      if (!source) return
      sourceId = source.id
    }
    let destinationId = data.destinationId
    if (!destinationId) {
      const destination = await locationRepository.readLocationByCityState(
        data.tripDestinationLocationCity,
        data.tripDestinationLocationState,
      )
      if (!destination) return
      destinationId = destination.id
    }

    //Step3: Check if a route exists.. if not create a new one
    let routeId = data.routeId
    if (!routeId) {
      const newRoute = await routeServices.addNewRouteWithDistance(
        sourceId,
        destinationId,
        data.selectedDistance,
      )
      if (!newRoute) {
        return
      }
      routeId = newRoute.id
    }

    //Step4: Prepare data
    const newBookingData: InsertBookingType = {
      agencyId: data.agencyId,
      customerId: customerId,
      bookedByUserId: data.userId,
      assignedUserId: data.userId,
      sourceId: sourceId,
      destinationId: destinationId,
      routeId: routeId,
      startDate: data.tripStartDate,
      endDate: data.tripEndDate,
      type: data.tripType,
      status: BookingStatusEnum.LEAD,
      remarks: data.tripRemarks,
      assignedVehicleId: data.assignedVehicleId,
      assignedDriverId: data.assignedDriverId,
      passengers: data.tripPassengers,
      needsAc: data.tripNeedsAC,
      citydistance: data.selectedDistance,
      totalDistance: data.totalDistance,
      acChargePerDay: data.selectedAcChargePerDay,
      totalAcCharge: data.totalAcCharge,
      ratePerKm: data.selectedRatePerKm,
      totalVehicleRate: data.totalVehicleRate,
      allowancePerDay: data.selectedAllowancePerDay,
      totalDriverAllowance: data.totalDriverAllowance,
      commissionRate: data.selectedCommissionRate,
      totalCommission: data.totalCommission,
      totalAmount: data.finalAmount,
    }

    //Step5: Create a new booking
    const newBooking = await bookingRepository.createBooking(newBookingData)
    return newBooking[0]
  },

  //Confirm a booking lead
  async confirmBooking(
    bookingId: string,
    startTime?: string,
    pickupAddress?: string,
    dropAddress?: string,
    updateCustomerAddress?: boolean,
    customerId?: string,
  ) {
    if (updateCustomerAddress && pickupAddress && customerId) {
      await customerRepository.updateCustomerAddress(customerId, pickupAddress)
    }
    const updatedBooking = await bookingRepository.updateBookingToConfirmed(
      bookingId,
      startTime,
      pickupAddress,
      dropAddress,
    )
    return updatedBooking[0]
  },

  //Start booking to mark it in progress
  async changeBookingToInProgress(
    bookingId: string,
    driverId: string,
    vehicleId: string,
  ) {
    //Check if the booking is confirmed
    const bookingStatus = await this.findBookingStatusById(bookingId)
    if (
      !bookingStatus ||
      bookingStatus.status !== BookingStatusEnum.CONFIRMED
    ) {
      return
    }
    //Check if the driver is available
    const driverStatus = await driverRepository.readDriverById(driverId)
    if (!driverStatus || driverStatus.status !== DriverStatusEnum.AVAILABLE) {
      return
    }
    //Check if the vehicle is available
    const vehicleStatus = await vehicleRepository.readVehicleById(vehicleId)
    if (
      !vehicleStatus ||
      vehicleStatus.status !== VehicleStatusEnum.AVAILABLE
    ) {
      return
    }

    //Atomic transaction to change booking to in progress and driver, vehicle to on trip
    const booking = await bookingRepository.startBookingTransaction(
      bookingId,
      driverId,
      vehicleId,
    )

    if (!booking[0] || booking[0].status !== BookingStatusEnum.IN_PROGRESS) {
      return
    }
    return booking[0]
  },

  //End booking to mark it completed
  async changeBookingToCompleted(
    bookingId: string,
    driverId: string,
    vehicleId: string,
  ) {
    //Check if the booking is in progress
    const bookingStatus = await this.findBookingStatusById(bookingId)
    if (
      !bookingStatus ||
      bookingStatus.status !== BookingStatusEnum.IN_PROGRESS
    ) {
      return
    }
    //Check if the driver is on trip
    const driverStatus = await driverRepository.readDriverById(driverId)
    if (!driverStatus || driverStatus.status !== DriverStatusEnum.ON_TRIP) {
      return
    }
    //Check if the vehicle is on trip
    const vehicleStatus = await vehicleRepository.readVehicleById(vehicleId)
    if (!vehicleStatus || vehicleStatus.status !== VehicleStatusEnum.ON_TRIP) {
      return
    }

    //Atomic transaction to change booking to completed and driver, vehicle to available
    const booking = await bookingRepository.completeBookingTransaction(
      bookingId,
      driverId,
      vehicleId,
    )
    if (!booking[0] || booking[0].status !== BookingStatusEnum.COMPLETED) {
      return
    }
    return booking[0]
  },

  //Cancel a booking
  async cancelBooking(id: string) {
    const updatedBooking = await bookingRepository.updateBookingToCancel(id)
    return updatedBooking[0]
  },

  //Assign driver to booking
  async assignDriverToBooking(bookingId: string, driverId: string) {
    const updatedBooking = await bookingRepository.updateAssignedDriver(
      bookingId,
      driverId,
    )
    return updatedBooking[0]
  },

  //Assign vehicle to booking
  async assignVehicleToBooking(bookingId: string, vehicleId: string) {
    const updatedBooking = await bookingRepository.updateAssignedVehicle(
      bookingId,
      vehicleId,
    )
    return updatedBooking[0]
  },

  //Assign user to booking
  async assignUserToBooking(bookingId: string, userId: string) {
    const updatedBooking = await bookingRepository.updateAssignedUser(
      bookingId,
      userId,
    )
    return updatedBooking[0]
  },

  // TODO: Send booking quote to customer over whatsapp
  async sendQuote(id: string) {
    return true
  },

  // TODO: Send booking invoice to customer over whatsapp
  async sendInvoice(id: string) {
    return true
  },
}

export type FindConfirmedBookingsPreviousDaysType = Awaited<
  ReturnType<typeof bookingServices.findConfirmedBookingsPreviousDays>
>

export type FindBookingsRevenuePreviousDaysType = Awaited<
  ReturnType<typeof bookingServices.findBookingsRevenuePreviousDays>
>

export type FindBookingsUpdatedPreviousDaysType = Awaited<
  ReturnType<typeof bookingServices.findBookingsUpdatedPreviousDays>
>

export type FindInProgressBookingsType = Awaited<
  ReturnType<typeof bookingServices.findInProgressBookings>
>

export type FindOngoingTripsType = Awaited<
  ReturnType<typeof bookingServices.findOngoingTrips>
>

export type FindCompletedBookingsPreviousDaysType = Awaited<
  ReturnType<typeof bookingServices.findCompletedBookingsPreviousDays>
>

export type FindUpcomingBookingsNextDaysType = Awaited<
  ReturnType<typeof bookingServices.findUpcomingBookingsNextDays>
>

export type FindScheduleNextDaysType = Awaited<
  ReturnType<typeof bookingServices.findBookingsScheduleNextDays>
>

export type FindLeadBookingsPreviousDaysType = Awaited<
  ReturnType<typeof bookingServices.findLeadBookingsPreviousDays>
>

export type FindAssignedUserIdByBookingIdType = Awaited<
  ReturnType<typeof bookingServices.findAssignedUserIdByBookingId>
>

export type FindLeadBookingByIdType = Awaited<
  ReturnType<typeof bookingServices.findLeadBookingById>
>

export type FindBookingStatusByIdType = Awaited<
  ReturnType<typeof bookingServices.findBookingStatusById>
>

export type FindBookingDetailsByIdType = Awaited<
  ReturnType<typeof bookingServices.findBookingDetailsById>
>

export type FindBookingTransactionsByIdType = Awaited<
  ReturnType<typeof bookingServices.findBookingTransactionsById>
>

export type FindBookingExpensesByIdType = Awaited<
  ReturnType<typeof bookingServices.findBookingExpensesById>
>

export type FindBookingTripLogsByIdType = Awaited<
  ReturnType<typeof bookingServices.findBookingTripLogsById>
>
