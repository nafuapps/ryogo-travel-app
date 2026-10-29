import { getActualTotalPrice, getEstimatedTotalPrice } from "@/lib/utils"
import {
  AgencyStatusEnum,
  BookingStatusEnum,
  BookingTypeEnum,
  DriverStatusEnum,
  InsertBookingType,
  SubscriptionPlanEnum,
  TransactionTypesEnum,
  TripLogTypesEnum,
  UserRolesEnum,
  UserStatusEnum,
  VehicleStatusEnum,
} from "@ryogo-travel-app/db/schema"
import crypto from "crypto"
import { addDays, differenceInDays, subDays } from "date-fns"
import {
  APP_TRIAL_MODE,
  BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_LIMIT,
  BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS,
  BASIC_SEARCH_LIMIT_DAYS,
  BOOKING_SCHEDULE_DEFAULT_DAYS,
  DASHBOARD_FETCH_DAYS,
  UPDATE_PRICE_DISTANCE_FACTOR,
} from "../apiConfig"
import { agencyRepository } from "../repositories/agency.repo"
import { bookingRepository } from "../repositories/booking.repo"
import { customerRepository } from "../repositories/customer.repo"
import { driverRepository } from "../repositories/driver.repo"
import { driverLeaveRepository } from "../repositories/driverLeave.repo"
import { expenseRepository } from "../repositories/expense.repo"
import { locationRepository } from "../repositories/location.repo"
import { transactionRepository } from "../repositories/transaction.repo"
import { tripLogRepository } from "../repositories/tripLog.repo"
import { userRepository } from "../repositories/user.repo"
import { vehicleRepository } from "../repositories/vehicle.repo"
import { vehicleRepairRepository } from "../repositories/vehicleRepair.repo"
import {
  ConfirmBookingRequestType,
  NewBookingRequestDataType,
  RateBookingByCustomerType,
  RateBookingByDriverType,
} from "../types/booking.types"
import { routeServices } from "./route.services"

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

    return bookings
      .filter(
        (booking) =>
          booking.finalInvoiceAmount !== null ||
          booking.actualTotalAmount !== null,
      )
      .map((booking) => {
        const totalAmount =
          booking.finalInvoiceAmount ??
          booking.actualTotalAmount ??
          booking.estimatedTotalAmount
        const customerPaidAmount = booking.transactions.reduce((acc, curr) => {
          if (
            [
              TransactionTypesEnum.RECEIVED_PAYMENT_FROM_CUSTOMER,
              TransactionTypesEnum.CUSTOMER_HANDED_TO_DRIVER,
            ].includes(curr.type)
          ) {
            return acc + curr.amount
          }
          if (
            [
              TransactionTypesEnum.DRIVER_HANDED_TO_CUSTOMER,
              TransactionTypesEnum.SENT_TO_CUSTOMER,
            ].includes(curr.type)
          ) {
            return acc - curr.amount
          }
          return acc
        }, 0)

        return {
          ...booking,
          totalAmount: totalAmount,
          pendingAmount: totalAmount - customerPaidAmount,
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
    const queryStartDate = subDays(new Date(), days)

    const bookings = await bookingRepository.readCompletedBookingsData({
      agencyId,
      queryStartDate,
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
    const booking = await bookingRepository.readBookingStatusById(bookingId)
    if (!booking) {
      console.error(`Booking doesn't exist: ${bookingId}`)
      return
    }
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
    const agency = await agencyRepository.readAgencyById(data.agencyId)
    if (!agency || agency.status === AgencyStatusEnum.SUSPENDED) {
      console.error(`Agency doesn't exist or suspended: ${data.agencyId}`)
      return
    }

    //SUBSCRIPTION CHECK: Check if basic plan has reached weekly confirmed bookings limit
    if (
      !APP_TRIAL_MODE &&
      (agency.subscriptionPlan === SubscriptionPlanEnum.BASIC ||
        //Check if premium expired more than X days ago
        differenceInDays(new Date(), agency.subscriptionExpiresOn) >
          BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS)
    ) {
      const confirmedBookings =
        await bookingRepository.readCreatedBookingsByStatusDateRange({
          agencyId: data.agencyId,
          queryStartDate: subDays(
            new Date(),
            BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS,
          ),
          queryEndDate: new Date(),
          status: [
            BookingStatusEnum.CONFIRMED,
            BookingStatusEnum.IN_PROGRESS,
            BookingStatusEnum.COMPLETED,
          ],
        })

      if (
        confirmedBookings.length >= BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_LIMIT
      ) {
        console.error(`Basic plan booking limit reached: ${agency.id}`)
        return
      }
    }

    //Step1: Get trip sourceId and destinationId from city & state
    let sourceId = data.sourceId
    if (!sourceId) {
      const source = await locationRepository.readLocationByCityState({
        city: data.source.city,
        state: data.source.state,
      })
      if (!source) {
        console.error(
          `No source location found for new booking: ${agency.id} ${data.source.city},${data.source.state}`,
        )
        return
      }
      sourceId = source.id
    }
    let destinationId = data.destinationId
    if (!destinationId) {
      const destination = await locationRepository.readLocationByCityState({
        city: data.destination.city,
        state: data.destination.state,
      })
      if (!destination) {
        console.error(
          `No destination location found for new booking: ${agency.id} ${data.destination.city},${data.destination.state}`,
        )
        return
      }
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
        console.error(
          `Route could not be created for new booking: ${agency.id} ${sourceId} - ${destinationId} ${data.citydistance}`,
        )
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
  async confirmBooking(data: ConfirmBookingRequestType) {
    const booking = await bookingRepository.readBookingStatusById(
      data.bookingId,
    )
    if (!booking || booking.status !== BookingStatusEnum.LEAD) {
      console.error(`Booking not found or not a lead: ${data.bookingId}`)
      return
    }

    if (data.updateCustomerAddress && data.pickupAddress && data.customerId) {
      await customerRepository.updateCustomerAddress({
        customerId: data.customerId,
        address: data.pickupAddress,
      })
    }
    const [updatedBooking] =
      await bookingRepository.updateBookingToConfirmed(data)
    if (!updatedBooking) {
      console.error(`Could not update booking status to confirmed: ${data}`)
      return
    }
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
    const booking = await bookingRepository.readBookingStatusById(bookingId)
    if (!booking || booking.status !== BookingStatusEnum.CONFIRMED) {
      console.error(`Booking not found or not confirmed: ${bookingId}`)
      return
    }
    //Check if the driver is available
    const driverStatus = await driverRepository.readDriverById(driverId)
    if (!driverStatus || driverStatus.status !== DriverStatusEnum.AVAILABLE) {
      console.error(`Driver not found or not available: ${driverId}`)
      return
    }
    //Check if the vehicle is available
    const vehicleStatus = await vehicleRepository.readVehicleById(vehicleId)
    if (
      !vehicleStatus ||
      vehicleStatus.status !== VehicleStatusEnum.AVAILABLE
    ) {
      console.error(`Vehicle not found or not available: ${vehicleId}`)
      return
    }

    //Atomic transaction to change booking to in progress and driver, vehicle to on trip
    const updatedBooking =
      await bookingRepository.startBookingAtomicTransaction({
        bookingId,
        driverId,
        vehicleId,
      })

    if (
      !updatedBooking ||
      updatedBooking.status !== BookingStatusEnum.IN_PROGRESS
    ) {
      console.error(
        `Booking could not be updated to in-progress: ${bookingId} ${driverId} ${vehicleId}`,
      )
      return
    }
    return {
      ...updatedBooking,
      driverName: driverStatus.name,
      vehicleNumber: vehicleStatus.vehicleNumber,
      assignedUserId: booking.assignedUserId,
    }
  },

  //Update booking values on trip completion like total distance, total amount etc
  async updateBookingActualValues(bookingId: string) {
    const booking = await bookingRepository.readBookingDetailsById(bookingId)
    if (!booking || booking.status !== BookingStatusEnum.COMPLETED) {
      console.error(`Booking not found or not completed: ${bookingId}`)
      return
    }

    let actualStartDate = booking.actualStartDate
    let actualEndDate = booking.actualEndDate

    const logs = await tripLogRepository.readTripLogsByBookingId(bookingId)
    const startLog = logs.find((log) => log.type === TripLogTypesEnum.STARTED)
    const endLog = logs.find((log) => log.type === TripLogTypesEnum.ENDED)
    if (!startLog) {
      console.error(`Started trip log not found: ${bookingId}`)
      return
    }
    if (!endLog) {
      console.error(`Ended trip log not found: ${bookingId}`)
      return
    }
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
    const bookingStatus =
      await bookingRepository.readBookingStatusById(bookingId)
    if (
      !bookingStatus ||
      bookingStatus.status !== BookingStatusEnum.IN_PROGRESS
    ) {
      console.error(`Booking not found or not in-progress: ${bookingId}`)
      return
    }
    //Check if the driver is on trip
    const driverStatus = await driverRepository.readDriverById(driverId)
    if (!driverStatus || driverStatus.status !== DriverStatusEnum.ON_TRIP) {
      console.error(`Driver not found or not on-trip: ${driverId}`)
      return
    }
    //Check if the vehicle is on trip
    const vehicleStatus = await vehicleRepository.readVehicleById(vehicleId)
    if (!vehicleStatus || vehicleStatus.status !== VehicleStatusEnum.ON_TRIP) {
      console.error(`Vehicle not found or not on-trip: ${vehicleId}`)
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
      console.error(`Booking could not be updated to completed: ${bookingId}`)
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
      console.error(
        `Booking not found, not completed, no assigned driver or already rated by driver: ${data.bookingId}`,
      )
      return
    }
    const updatedBooking =
      await bookingRepository.updateBookingRatingByDriver(data)
    if (!updatedBooking) {
      console.error(`Could not change booking rating by driver: ${data}`)
      return
    }
    return updatedBooking
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
      console.error(
        `Booking not found, not completed, has no secret code or already rated by customer: ${data.bookingId}`,
      )
      return
    }

    //Check if the secret code is valid
    if (data.code !== booking.secretCode && data.code !== SUPER_CODE) {
      return { error: "invalidCode" }
    }

    const updatedBooking =
      await bookingRepository.updateBookingRatingByCustomer(data)
    if (!updatedBooking) {
      console.error(`Could not change booking rating by customer: ${data}`)
      return
    }
    return updatedBooking
  },

  async addSecretCode(bookingId: string) {
    const secretCode = generateSecretCode()
    const [updatedBooking] = await bookingRepository.updateSecretCode({
      bookingId,
      secretCode,
    })
    if (!updatedBooking) {
      console.error(
        `Could not update booking secret code: ${bookingId} ${secretCode}`,
      )
      return
    }
    return updatedBooking
  },

  //update secret code resend timestamp
  async changeSecretCodeSentOn(bookingId: string) {
    const [updatedBooking] = await bookingRepository.updateCodeSentOn(bookingId)
    if (!updatedBooking) {
      console.error(`Could not update booking codeSentOn: ${bookingId}`)
      return
    }
    return updatedBooking
  },

  //Cancel a booking
  async cancelBooking(bookingId: string) {
    const booking = await bookingRepository.readBookingStatusById(bookingId)
    //Only lead or confirmed booking can be cancelled
    if (
      !booking ||
      ![BookingStatusEnum.LEAD, BookingStatusEnum.CONFIRMED].includes(
        booking.status,
      )
    ) {
      console.error(`Booking not found or not lead or confirmed: ${bookingId}`)
      return
    }

    //remove assigned vehicle and driver also
    const [updatedBooking] =
      await bookingRepository.updateBookingToCancel(bookingId)
    if (!updatedBooking) {
      console.error(`Could not cancel booking: ${bookingId}`)
      return
    }
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
    if (!driver || driver.status === DriverStatusEnum.SUSPENDED) {
      console.error(`Driver not found or suspended: ${assignedDriverId}`)
      return
    }

    const booking = await bookingRepository.readBookingStatusById(bookingId)
    if (
      !booking ||
      ![BookingStatusEnum.LEAD, BookingStatusEnum.CONFIRMED].includes(
        booking.status,
      )
    ) {
      console.error(`Booking not found or not lead or confirmed: ${bookingId}`)
      return
    }

    const [updatedBooking] = await bookingRepository.updateAssignedDriver({
      bookingId,
      assignedDriverId,
    })
    if (!updatedBooking) {
      console.error(
        `Could not update assignedDriver for the booking: ${bookingId} ${assignedDriverId}`,
      )
      return
    }

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
    if (!vehicle || vehicle.status === VehicleStatusEnum.SUSPENDED) {
      console.error(`Vehicle not found or suspended: ${assignedVehicleId}`)
      return
    }

    const booking = await bookingRepository.readBookingById(bookingId)
    if (
      !booking ||
      ![BookingStatusEnum.LEAD, BookingStatusEnum.CONFIRMED].includes(
        booking.status,
      )
    ) {
      console.error(`Booking not found or not lead or confirmed: ${bookingId}`)
      return
    }

    const [updatedBooking] = await bookingRepository.updateAssignedVehicle({
      bookingId,
      assignedVehicleId,
    })
    if (!updatedBooking) {
      console.error(
        `Could not update assignedVehicle for the booking: ${bookingId} ${assignedVehicleId}`,
      )
      return
    }

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
    if (
      !user ||
      user.status === UserStatusEnum.SUSPENDED ||
      user.userRole === UserRolesEnum.DRIVER
    ) {
      console.error(
        `User not found or suspended or role mismatch: ${assignedUserId}`,
      )
      return
    }

    const booking = await bookingRepository.readBookingById(bookingId)
    if (!booking || booking.status === BookingStatusEnum.CANCELLED) {
      console.error(`Booking not found or is cancelled: ${bookingId}`)
      return
    }

    const [updatedBooking] = await bookingRepository.updateAssignedUser({
      bookingId,
      assignedUserId,
    })
    if (!updatedBooking) {
      console.error(
        `Could not update assignedUser for the booking: ${bookingId} ${assignedUserId}`,
      )
      return
    }
    return {
      ...updatedBooking,
      assignedUserName: user.name,
      startDate: booking.startDate,
    }
  },

  //Close a booking after review, add expenses and update total amount
  async closeBooking(bookingId: string) {
    const expenses = await expenseRepository.readExpensesByBookingId(bookingId)
    const actualExpensesAmount = expenses.reduce((acc, curr) => {
      if (curr.isApproved) {
        return acc + curr.amount
      }
      return acc
    }, 0)

    const [updatedBooking] = await bookingRepository.addClosedAt({
      bookingId,
      actualExpensesAmount,
    })
    if (!updatedBooking) {
      console.error(`Could not update booking closedAt: ${bookingId}`)
      return
    }
    return updatedBooking
  },

  //Reopen a closed booking for review, remove expenses and adjust total amount
  async reopenBooking(bookingId: string) {
    const booking = await bookingRepository.readBookingStatusById(bookingId)
    if (
      !booking ||
      booking.status !== BookingStatusEnum.COMPLETED ||
      !booking.closedAt
    ) {
      console.error(
        `Booking not found or not completed or not closed yet: ${bookingId}`,
      )
      return
    }

    const [updatedBooking] = await bookingRepository.deleteClosedAt(bookingId)
    if (!updatedBooking) {
      console.error(`Could not reopen booking closedAt: ${bookingId}`)
      return
    }
    return updatedBooking
  },

  //Reconcile a booking
  async reconcileBooking(bookingId: string) {
    const booking = await bookingRepository.readBookingStatusById(bookingId)
    if (
      !booking ||
      booking.status !== BookingStatusEnum.COMPLETED ||
      !booking.closedAt ||
      booking.reconciledAt
    ) {
      console.error(
        `Booking not found or not completed or not closed yet or already reconciled: ${bookingId}`,
      )
      return
    }

    const [updatedBooking] =
      await bookingRepository.updateReconciledAt(bookingId)
    if (!updatedBooking) {
      console.error(`Could not update booking reconciledAt: ${bookingId}`)
      return
    }
    return updatedBooking
  },

  async addBookingQuoteSent({
    bookingId,
    quoteUrl,
  }: {
    bookingId: string
    quoteUrl?: string
  }) {
    const [updatedBooking] = await bookingRepository.updateQuoteUrl({
      bookingId,
      quoteUrl,
    })
    return updatedBooking
  },

  async addBookingConfirmationSent({
    bookingId,
    confirmationUrl,
  }: {
    bookingId: string
    confirmationUrl?: string
  }) {
    const [updatedBooking] = await bookingRepository.updateConfirmationUrl({
      bookingId,
      confirmationUrl,
    })
    return updatedBooking
  },

  async addBookingInvoiceSent({
    bookingId,
    invoiceUrl,
  }: {
    bookingId: string
    invoiceUrl?: string
  }) {
    const [updatedBooking] = await bookingRepository.updateInvoiceUrl({
      bookingId,
      invoiceUrl,
    })
    return updatedBooking
  },

  async changeStartTime(bookingId: string, startTime: string) {
    const booking = await bookingRepository.readBookingStatusById(bookingId)
    if (!booking || booking.status !== BookingStatusEnum.CONFIRMED) {
      console.error(`Booking not found or not confirmed: ${bookingId}`)
      return
    }
    const [updatedBooking] = await bookingRepository.updateStartTime({
      bookingId,
      startTime,
    })
    if (!updatedBooking) {
      console.error(
        `Could not update booking start time: ${bookingId} ${startTime}`,
      )
      return
    }
    return updatedBooking
  },

  async changeBookingRemarks(bookingId: string, remarks: string) {
    const [updatedBooking] = await bookingRepository.updateRemarks({
      bookingId,
      remarks,
    })
    if (!updatedBooking) {
      console.error(`Could not update booking remarks: ${bookingId} ${remarks}`)
      return
    }
    return updatedBooking
  },

  async changePickupAddress(bookingId: string, pickupAddress: string) {
    const booking = await bookingRepository.readBookingStatusById(bookingId)
    if (!booking || booking.status !== BookingStatusEnum.CONFIRMED) {
      console.error(`Booking not found or not confirmed: ${bookingId}`)
      return
    }
    const [updatedBooking] = await bookingRepository.updatePickupAddress({
      bookingId,
      pickupAddress,
    })
    if (!updatedBooking) {
      console.error(
        `Could not update booking pickup address: ${bookingId} ${pickupAddress}`,
      )
      return
    }
    return updatedBooking
  },

  async changeDropAddress(bookingId: string, dropAddress: string) {
    const booking = await bookingRepository.readBookingStatusById(bookingId)
    if (!booking || booking.status !== BookingStatusEnum.CONFIRMED) {
      console.error(`Booking not found or not confirmed: ${bookingId}`)
      return
    }
    const [updatedBooking] = await bookingRepository.updateDropAddress({
      bookingId,
      dropAddress,
    })
    if (!updatedBooking) {
      console.error(
        `Could not update booking drop address: ${bookingId} ${dropAddress}`,
      )
      return
    }
    return updatedBooking
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
