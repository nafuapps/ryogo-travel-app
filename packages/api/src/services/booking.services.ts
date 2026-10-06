import {
  BookingStatusEnum,
  BookingTypeEnum,
  DriverStatusEnum,
  InsertBookingType,
  TransactionPartiesEnum,
  TransactionTypesEnum,
  TripLogTypesEnum,
  UserStatusEnum,
  VehicleStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { bookingRepository } from "../repositories/booking.repo"
import {
  ConfirmBookingRequestType,
  NewBookingRequestDataType,
  RateBookingByCustomerType,
  RateBookingByDriverType,
} from "../types/booking.types"
import { locationRepository } from "../repositories/location.repo"
import { routeServices } from "./route.services"
import { customerRepository } from "../repositories/customer.repo"
import { expenseRepository } from "../repositories/expense.repo"
import { tripLogRepository } from "../repositories/tripLog.repo"
import { transactionRepository } from "../repositories/transaction.repo"
import { driverRepository } from "../repositories/driver.repo"
import { vehicleRepository } from "../repositories/vehicle.repo"
import {
  BASIC_SEARCH_LIMIT_DAYS,
  BOOKING_SCHEDULE_DEFAULT_DAYS,
  DASHBOARD_FETCH_DAYS,
  UPDATE_PRICE_DISTANCE_FACTOR,
} from "../apiConfig"
import { getEstimatedTotalPrice, getActualTotalPrice } from "@/lib/utils"
import { userRepository } from "../repositories/user.repo"
import { addDays, subDays } from "date-fns"
import { driverLeaveRepository } from "../repositories/driverLeave.repo"
import { vehicleRepairRepository } from "../repositories/vehicleRepair.repo"
import crypto from "crypto"

const SUPER_CODE = process.env.SUPER_CODE

function generateSecretCode() {
  // Generates a random integer between 100,000 and 999,999 inclusive
  return crypto.randomInt(100000, 1000000).toString()
}

export const bookingServices = {
  async findDashboardTrips(agencyId: string) {
    const bookings =
      await bookingRepository.readDashboardTripsByAgencyId(agencyId)
    return bookings
  },

  async findDashboardLeads(
    agencyId: string,
    days: number = DASHBOARD_FETCH_DAYS,
  ) {
    const bookings = await bookingRepository.readDashboardLeadsByAgencyId(
      agencyId,
      days,
    )
    return bookings
  },

  async findDashboardPendingPayments(agencyId: string) {
    const bookings =
      await bookingRepository.readPendingPaymentBookings(agencyId)
    return bookings.map((booking) => {
      return {
        ...booking,
        customerPaidAmount: booking.transactions.reduce((acc, curr) => {
          if (curr.otherParty === TransactionPartiesEnum.CUSTOMER) {
            if (curr.type === TransactionTypesEnum.CREDIT) {
              return acc + curr.amount
            } else {
              return acc - curr.amount
            }
          }
          return acc
        }, 0),
      }
    })
  },

  //Find bookings created in last N days which are accountable for revenue (atleast confirmed)
  async findAccountableBookingsPreviousDays(
    agencyId: string,
    days: number = 1,
  ) {
    const queryEndDate = new Date()
    const queryStartDate = subDays(queryEndDate, days)

    const bookings =
      await bookingRepository.readCreatedBookingsByStatusDateRange({
        agencyId,
        queryStartDate,
        queryEndDate,
        status: [
          BookingStatusEnum.CONFIRMED,
          BookingStatusEnum.IN_PROGRESS,
          BookingStatusEnum.COMPLETED,
        ],
      })
    return bookings
  },

  async findDashboardScheduleConflicts(
    agencyId: string,
    days: number = DASHBOARD_FETCH_DAYS,
  ) {
    const queryEndDate = addDays(new Date(), days)
    const bookings = await bookingRepository.readUpcomingBookingsSchedule(
      agencyId,
      queryEndDate,
    )

    const leaves = await driverLeaveRepository.readUpcomingDriverLeavesSchedule(
      {
        agencyId,
        queryEndDate,
      },
    )
    const repairs =
      await vehicleRepairRepository.readUpcomingVehicleRepairsSchedule({
        agencyId,
        queryEndDate,
      })

    const bookingsSchedule = bookings.map((item) => {
      return {
        id: item.id,
        startDate: item.startDate,
        endDate: item.endDate,
        userId: item.assignedUserId,
        assignedVehicle: {
          id: item.assignedVehicle?.id,
          label: item.assignedVehicle?.vehicleNumber,
          photoUrl: item.assignedVehicle?.vehiclePhotoUrl,
        },
        assignedDriver: {
          id: item.assignedDriver?.id,
          label: item.assignedDriver?.name,
          photoUrl: item.assignedDriver?.user.photoUrl,
        },
      }
    })

    const repairsSchedule = repairs.map((item) => {
      return {
        id: item.id,
        startDate: item.startDate,
        endDate: item.endDate,
        userId: item.addedByUserId,
        vehicle: {
          id: item.vehicle.id,
          label: item.vehicle.vehicleNumber,
          photoUrl: item.vehicle.vehiclePhotoUrl,
        },
      }
    })
    const leavesSchedule = leaves.map((item) => {
      return {
        id: item.id,
        startDate: item.startDate,
        endDate: item.endDate,
        userId: item.addedByUserId,
        driver: {
          id: item.driver.id,
          label: item.driver.name,
          photoUrl: item.driver.user.photoUrl,
        },
      }
    })

    return {
      bookingsSchedule,
      leavesSchedule,
      repairsSchedule,
    }
  },

  async findOngoingTrips(agencyId: string) {
    const bookings = await bookingRepository.readOngoingBookingsData(agencyId)
    return bookings
  },

  async findCompletedBookingsPreviousDays(
    agencyId: string,
    days: number = BASIC_SEARCH_LIMIT_DAYS,
  ) {
    const queryEndDate = new Date()
    const queryStartDate = subDays(queryEndDate, days)

    const bookings = await bookingRepository.readCompletedBookingsData({
      agencyId,
      queryStartDate,
      queryEndDate,
    })
    return bookings
  },

  async findCancelledBookingsPreviousDays(
    agencyId: string,
    days: number = BASIC_SEARCH_LIMIT_DAYS,
  ) {
    const queryEndDate = new Date()
    const queryStartDate = subDays(queryEndDate, days)

    const bookings = await bookingRepository.readCancelledBookingsData({
      agencyId,
      queryStartDate,
      queryEndDate,
    })
    return bookings
  },

  async findUpcomingBookingsNextDays(
    agencyId: string,
    days: number = BASIC_SEARCH_LIMIT_DAYS,
  ) {
    const queryEndDate = addDays(new Date(), days)

    const bookings = await bookingRepository.readUpcomingBookingsData({
      agencyId,
      queryEndDate,
    })
    return bookings
  },

  async findBookingsScheduleNextDays(
    agencyId: string,
    days: number = BOOKING_SCHEDULE_DEFAULT_DAYS,
  ) {
    const queryEndDate = addDays(new Date(), days)

    const bookings = await bookingRepository.readBookingsScheduleData({
      agencyId,
      queryEndDate,
    })
    return bookings
  },

  async findBookingsHistoryLastDays(
    agencyId: string,
    days: number = BOOKING_SCHEDULE_DEFAULT_DAYS,
  ) {
    const queryStartDate = subDays(new Date(), days)

    const bookings = await bookingRepository.readBookingsHistoryData({
      agencyId,
      queryStartDate,
    })
    return bookings
  },

  async findLeadBookingsNextDays(
    agencyId: string,
    days: number = BASIC_SEARCH_LIMIT_DAYS,
  ) {
    const queryStartDate = new Date()
    const queryEndDate = addDays(queryStartDate, days)

    const bookings = await bookingRepository.readLeadBookingsData({
      agencyId,
      queryStartDate,
      queryEndDate,
    })
    return bookings
  },

  //Get assigned user id by booking id
  async findAssignedUserIdByBookingId(bookingId: string) {
    const booking = await bookingRepository.readBookingById(bookingId)
    if (!booking) return
    return booking.assignedUserId
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
  async addNewBooking(data: NewBookingRequestDataType) {
    //Step1: Get trip sourceId and destinationId from city & state
    let sourceId = data.sourceId
    if (!sourceId) {
      const source = await locationRepository.readLocationByCityState({
        city: data.source.city,
        state: data.source.state,
      })
      if (!source) return
      sourceId = source.id
    }
    let destinationId = data.destinationId
    if (!destinationId) {
      const destination = await locationRepository.readLocationByCityState({
        city: data.destination.city,
        state: data.destination.state,
      })
      if (!destination) return
      destinationId = destination.id
    }

    //Step3: Check if a route exists.. if not create a new one
    let routeId = data.routeId
    if (!routeId) {
      const newRoute = await routeServices.addNewRouteWithDistance({
        sourceId,
        destinationId,
        distance: data.citydistance,
      })
      if (!newRoute) {
        return
      }
      routeId = newRoute.id
    }

    const finalPrice = getEstimatedTotalPrice(data)

    //Step4: Prepare data
    const newBookingData: InsertBookingType = {
      agencyId: data.agencyId,
      customerId: data.customerId,
      bookedByUserId: data.userId,
      assignedUserId: data.userId,
      sourceId: sourceId,
      destinationId: destinationId,
      routeId: routeId,
      startDate: data.startDate,
      endDate: data.endDate,
      type: data.type,
      status: BookingStatusEnum.LEAD,
      remarks: data.remarks,
      assignedVehicleId: data.assignedVehicleId,
      assignedDriverId: data.assignedDriverId,
      passengers: data.passengers,
      needsAc: data.needsAc,
      citydistance: data.citydistance,
      estimatedTotalDistance: finalPrice.totalDistance,
      acChargePerDay: data.selectedAcChargePerDay,
      estimatedTotalAcCharge: finalPrice.totalAcPrice,
      ratePerKm: data.selectedRatePerKm,
      estimatedTotalVehicleRate: finalPrice.totalVehiclePrice,
      allowancePerDay: data.selectedAllowancePerDay,
      estimatedTotalDriverAllowance: finalPrice.totalDriverAllowance,
      commissionRate: data.selectedCommissionRate,
      estimatedCommissionAmount: finalPrice.totalCommission,
      estimatedTotalAmount: finalPrice.totalAmount,
    }

    //Step5: Create a new booking
    const [newBooking] = await bookingRepository.createBooking(newBookingData)
    return newBooking
  },

  //Confirm a booking
  async confirmBooking({
    id,
    startTime,
    pickupAddress,
    dropAddress,
    updateCustomerAddress,
    customerId,
  }: ConfirmBookingRequestType) {
    if (updateCustomerAddress && pickupAddress && customerId) {
      await customerRepository.updateCustomerAddress({
        customerId,
        address: pickupAddress,
      })
    }
    const [updatedBooking] = await bookingRepository.updateBookingToConfirmed({
      id,
      startTime,
      pickupAddress,
      dropAddress,
    })
    return updatedBooking
  },

  //Start booking to mark it in progress
  async changeBookingToInProgress({
    bookingId,
    driverId,
    vehicleId,
  }: {
    bookingId: string
    driverId: string
    vehicleId: string
  }) {
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
    const booking = await bookingRepository.startBookingAtomicTransaction({
      bookingId,
      driverId,
      vehicleId,
    })

    if (!booking || booking.status !== BookingStatusEnum.IN_PROGRESS) {
      return
    }
    return {
      ...booking,
      driverName: driverStatus.name,
      vehicleNumber: vehicleStatus.vehicleNumber,
      assignedUserId: bookingStatus.assignedUserId,
    }
  },

  //Update booking values on trip completion like total distance, total amount etc
  async updateBookingActualValues(bookingId: string) {
    const booking = await bookingRepository.readBookingDetailsById(bookingId)
    if (!booking) return

    let actualStartDate = booking.actualStartDate
    let actualEndDate = booking.actualEndDate

    const logs = await tripLogRepository.readTripLogsByBookingId(bookingId)
    const startLog = logs.find((log) => log.type === TripLogTypesEnum.STARTED)
    const endLog = logs.find((log) => log.type === TripLogTypesEnum.ENDED)
    if (!startLog || !endLog) return
    if (!actualStartDate) {
      actualStartDate = startLog.createdAt
    }
    if (!actualEndDate) {
      actualEndDate = endLog.createdAt
    }

    //Get actual distance from trip log odometer readings
    const actualTotalDistance = Math.max(
      startLog.odometerReading && endLog.odometerReading
        ? endLog.odometerReading - startLog.odometerReading
        : 0,
      booking.estimatedTotalDistance * UPDATE_PRICE_DISTANCE_FACTOR,
    )

    //Calculate actual total price based on actual distance and trip duration for driver allowance and ac charge
    const actualTotals = getActualTotalPrice(
      booking.type,
      actualStartDate,
      actualEndDate,
      booking.ratePerKm,
      booking.acChargePerDay,
      booking.commissionRate,
      booking.allowancePerDay,
      actualTotalDistance,
    )

    //Update actuals in DB
    await bookingRepository.updateBookingTotals({
      bookingId,
      actualStartDate,
      actualEndDate,
      actualTotalDistance,
      actualTotalVehicleRate: actualTotals.totalVehiclePrice,
      actualTotalAcCharge: actualTotals.totalACPrice,
      actualTotalDriverAllowance: actualTotals.totalDriverAllowance,
      actualCommissionAmount: actualTotals.totalCommission,
      actualTotalAmount: actualTotals.totalAmount,
    })
  },

  //End booking to mark it completed
  async changeBookingToCompleted({
    bookingId,
    driverId,
    vehicleId,
    customerId,
    customerRatingByDriver,
    bookingRatingByDriver,
  }: {
    bookingId: string
    driverId: string
    vehicleId: string
    customerId: string
    customerRatingByDriver?: number
    bookingRatingByDriver?: number
  }) {
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

    const visitingLocationId =
      bookingStatus.type === BookingTypeEnum.OneWay
        ? bookingStatus.destinationId
        : bookingStatus.sourceId
    const secretCode = generateSecretCode()

    //Atomic transaction to change booking to completed and driver, vehicle to available
    const completedBooking =
      await bookingRepository.completeBookingAtomicTransaction({
        bookingId,
        driverId,
        vehicleId,
        customerId,
        visitingLocationId,
        secretCode,
        customerRatingByDriver,
        bookingRatingByDriver,
      })
    if (
      !completedBooking ||
      completedBooking.status !== BookingStatusEnum.COMPLETED
    ) {
      return
    }
    return {
      ...completedBooking,
      driverName: driverStatus.name,
      vehicleNumber: vehicleStatus.vehicleNumber,
      assignedUserId: bookingStatus.assignedUserId,
    }
  },

  //Update booking rating by driver
  async changeBookingRatingByDriver(data: RateBookingByDriverType) {
    const booking = await bookingRepository.readBookingById(data.bookingId)

    //Only completed bookings can be rated by driver
    if (
      !booking ||
      booking.status !== BookingStatusEnum.COMPLETED ||
      !booking.assignedDriver ||
      booking.assignedDriver.userId !== data.userId ||
      booking.ratingByDriver
    ) {
      return
    }
    return await bookingRepository.updateBookingRatingByDriver(data)
  },

  //Update booking rating by customer
  async changeBookingRatingByCustomer(data: RateBookingByCustomerType) {
    const booking = await bookingRepository.readBookingById(data.bookingId)

    //Only completed bookings with secret code can be rated by customer
    if (
      !booking ||
      booking.status !== BookingStatusEnum.COMPLETED ||
      booking.ratingByCustomer ||
      !booking.secretCode
    ) {
      return
    }

    //Check if the secret code is valid
    if (data.code !== booking.secretCode && data.code !== SUPER_CODE) {
      return { error: "invalidCode" }
    }

    return await bookingRepository.updateBookingRatingByCustomer(data)
  },

  async addSecretCode(id: string) {
    const secretCode = generateSecretCode()
    const [updatedBooking] = await bookingRepository.updateSecretCode({
      id,
      secretCode,
    })
    return updatedBooking
  },

  //update secret code resend timestamp
  async changeSecretCodeSentOn(bookingId: string) {
    const [updatedBooking] = await bookingRepository.updateCodeSentOn(bookingId)
    return updatedBooking
  },

  //Cancel a booking
  async cancelBooking(bookingId: string) {
    const booking = await bookingRepository.readBookingById(bookingId)
    //Only lead or confirmed booking can be cancelled
    if (
      !booking ||
      ![BookingStatusEnum.LEAD, BookingStatusEnum.CONFIRMED].includes(
        booking.status,
      )
    ) {
      return
    }

    //remove assigned vehicle and driver also
    const [updatedBooking] =
      await bookingRepository.updateBookingToCancel(bookingId)
    return updatedBooking
  },

  //Assign driver to booking
  async assignDriverToBooking({
    bookingId,
    assignedDriverId,
  }: {
    bookingId: string
    assignedDriverId: string
  }) {
    const driver = await driverRepository.readDriverById(assignedDriverId)
    if (!driver || driver.status === DriverStatusEnum.SUSPENDED) return

    const booking = await bookingRepository.readBookingById(bookingId)
    if (
      !booking ||
      ![BookingStatusEnum.LEAD, BookingStatusEnum.CONFIRMED].includes(
        booking.status,
      )
    )
      return

    const [updatedBooking] = await bookingRepository.updateAssignedDriver({
      bookingId,
      assignedDriverId,
    })
    return {
      ...updatedBooking,
      driverUserId: driver.userId,
      driverName: driver.name,
      startDate: booking.startDate,
    }
  },

  //Assign vehicle to booking
  async assignVehicleToBooking({
    bookingId,
    assignedVehicleId,
  }: {
    bookingId: string
    assignedVehicleId: string
  }) {
    const vehicle = await vehicleRepository.readVehicleById(assignedVehicleId)
    if (!vehicle || vehicle.status === VehicleStatusEnum.SUSPENDED) return

    const booking = await bookingRepository.readBookingById(bookingId)
    if (
      !booking ||
      ![BookingStatusEnum.LEAD, BookingStatusEnum.CONFIRMED].includes(
        booking.status,
      )
    )
      return

    const [updatedBooking] = await bookingRepository.updateAssignedVehicle({
      bookingId,
      assignedVehicleId,
    })

    return {
      ...updatedBooking,
      vehicleNumber: vehicle.vehicleNumber,
      driverUserId: booking.assignedDriver?.userId,
    }
  },

  //Assign user to booking
  async assignUserToBooking({
    bookingId,
    assignedUserId,
  }: {
    bookingId: string
    assignedUserId: string
  }) {
    const user = await userRepository.readUserById(assignedUserId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) return

    const booking = await bookingRepository.readBookingById(bookingId)
    if (!booking) return

    const [updatedBooking] = await bookingRepository.updateAssignedUser({
      bookingId,
      assignedUserId,
    })
    return {
      ...updatedBooking,
      assignedUserName: user.name,
      startDate: booking.startDate,
    }
  },

  //Close a booking after review, add expenses and update total amount
  async closeBooking(id: string) {
    const expenses = await expenseRepository.readExpensesByBookingId(id)
    const actualExpensesAmount = expenses.reduce((acc, curr) => {
      if (curr.isApproved) {
        return acc + curr.amount
      }
      return acc
    }, 0)

    const [updatedBooking] = await bookingRepository.addClosedAt({
      id,
      actualExpensesAmount,
    })
    return updatedBooking
  },

  //Reopen a closed booking for review, remove expenses and adjust total amount
  async reopenBooking(bookingId: string) {
    const bookingDetails =
      await bookingServices.findBookingDetailsById(bookingId)
    if (
      !bookingDetails ||
      bookingDetails.status !== BookingStatusEnum.COMPLETED ||
      !bookingDetails.closedAt
    ) {
      return
    }

    const [updatedBooking] = await bookingRepository.deleteClosedAt(bookingId)
    return updatedBooking
  },

  async addQuoteUrl({
    bookingId,
    quoteUrl,
  }: {
    bookingId: string
    quoteUrl: string
  }) {
    return await bookingRepository.updateQuoteUrl({
      bookingId,
      quoteUrl,
    })
  },

  async changeQuoteSent(bookingId: string) {
    return await bookingRepository.updateQuoteSent(bookingId)
  },

  async addConfirmationUrl({
    bookingId,
    confirmationUrl,
  }: {
    bookingId: string
    confirmationUrl: string
  }) {
    return await bookingRepository.updateConfirmationUrl({
      bookingId,
      confirmationUrl,
    })
  },

  async changeConfirmationSent(bookingId: string) {
    return await bookingRepository.updateConfirmationSent(bookingId)
  },

  async addInvoiceUrl({
    bookingId,
    invoiceUrl,
  }: {
    bookingId: string
    invoiceUrl: string
  }) {
    return await bookingRepository.updateInvoiceUrl({ bookingId, invoiceUrl })
  },

  async changeInvoiceSent(bookingId: string) {
    return await bookingRepository.updateInvoiceSent(bookingId)
  },

  async changeStartTime(id: string, startTime: string) {
    return await bookingRepository.updateStartTime({ id, startTime })
  },

  async changeBookingRemarks(id: string, remarks: string) {
    return await bookingRepository.updateRemarks({ id, remarks })
  },

  async changePickupAddress(id: string, pickupAddress: string) {
    return await bookingRepository.updatePickupAddress({ id, pickupAddress })
  },

  async changeDropAddress(id: string, dropAddress: string) {
    return await bookingRepository.updateDropAddress({ id, dropAddress })
  },
}

export type FindDashboardTripsType = Awaited<
  ReturnType<typeof bookingServices.findDashboardTrips>
>

export type FindDashboardLeadsType = Awaited<
  ReturnType<typeof bookingServices.findDashboardLeads>
>

export type FindDashboardPendingPaymentsType = Awaited<
  ReturnType<typeof bookingServices.findDashboardPendingPayments>
>

export type FindAccountableBookingsPreviousDaysType = Awaited<
  ReturnType<typeof bookingServices.findAccountableBookingsPreviousDays>
>

export type FindDashboardScheduleConflictsType = Awaited<
  ReturnType<typeof bookingServices.findDashboardScheduleConflicts>
>

export type FindOngoingTripsType = Awaited<
  ReturnType<typeof bookingServices.findOngoingTrips>
>

export type FindCompletedBookingsPreviousDaysType = Awaited<
  ReturnType<typeof bookingServices.findCompletedBookingsPreviousDays>
>

export type FindCancelledBookingsPreviousDaysType = Awaited<
  ReturnType<typeof bookingServices.findCancelledBookingsPreviousDays>
>

export type FindUpcomingBookingsNextDaysType = Awaited<
  ReturnType<typeof bookingServices.findUpcomingBookingsNextDays>
>

export type FindBookingScheduleNextDaysType = Awaited<
  ReturnType<typeof bookingServices.findBookingsScheduleNextDays>
>

export type FindBookingHistoryLastDaysType = Awaited<
  ReturnType<typeof bookingServices.findBookingsHistoryLastDays>
>

export type FindLeadBookingsType = Awaited<
  ReturnType<typeof bookingServices.findLeadBookingsNextDays>
>

export type FindAssignedUserIdByBookingIdType = Awaited<
  ReturnType<typeof bookingServices.findAssignedUserIdByBookingId>
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
