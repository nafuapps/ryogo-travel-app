import {
  BookingStatusEnum,
  DriverStatusEnum,
  InsertBookingType,
  TransactionsPartiesEnum,
  TransactionTypesEnum,
  TripLogTypesEnum,
  UserStatusEnum,
  VehicleStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { bookingRepository } from "../repositories/booking.repo"
import { NewBookingRequestDataType } from "../types/booking.types"
import { locationRepository } from "../repositories/location.repo"
import { routeServices } from "./route.services"
import { customerRepository } from "../repositories/customer.repo"
import { expenseRepository } from "../repositories/expense.repo"
import { tripLogRepository } from "../repositories/tripLog.repo"
import { transactionRepository } from "../repositories/transaction.repo"
import { driverRepository } from "../repositories/driver.repo"
import { vehicleRepository } from "../repositories/vehicle.repo"
import { UPDATE_PRICE_DISTANCE_FACTOR } from "../apiConfig"
import { getEstimatedTotalPrice, getActualTotalPrice } from "@/lib/utils"
import { userRepository } from "../repositories/user.repo"
import { addDays, subDays } from "date-fns"
import { driverLeaveRepository } from "../repositories/driverLeave.repo"
import { vehicleRepairRepository } from "../repositories/vehicleRepair.repo"

export const bookingServices = {
  async findDashboardTrips(agencyId: string) {
    const bookings =
      await bookingRepository.readDashboardTripsByAgencyId(agencyId)
    return bookings
  },

  async findDashboardLeads(agencyId: string, days: number = 7) {
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
          if (curr.otherParty === TransactionsPartiesEnum.CUSTOMER) {
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
    const endDate = new Date()
    const startDate = subDays(endDate, days)

    const bookings =
      await bookingRepository.readCreatedBookingsByStatusDateRange(
        agencyId,
        startDate,
        endDate,
        [
          BookingStatusEnum.CONFIRMED,
          BookingStatusEnum.IN_PROGRESS,
          BookingStatusEnum.COMPLETED,
        ],
      )
    return bookings
  },

  async findDashboardScheduleConflicts(agencyId: string, days: number = 7) {
    const queryDate = addDays(new Date(), days)
    const bookings = await bookingRepository.readUpcomingBookingsSchedule(
      agencyId,
      queryDate,
    )

    const leaves = await driverLeaveRepository.readUpcomingDriverLeavesSchedule(
      agencyId,
      queryDate,
    )
    const repairs =
      await vehicleRepairRepository.readUpcomingVehicleRepairsSchedule(
        agencyId,
        queryDate,
      )

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
    return bookings.map((booking) => {
      return {
        type: booking.type.toString(),
        route: booking.source.city + " - " + booking.destination.city,
        vehicle: booking.assignedVehicle?.vehicleNumber,
        driver: booking.assignedDriver?.name,
        customerName: booking.customer.name,
        bookingId: booking.id,
        status: booking.tripLogs[0]?.type,
        assignedUserId: booking.assignedUser.id,
        assignedUserName: booking.assignedUser.name,
        startDate: booking.startDate,
        endDate: booking.endDate,
      }
    })
  },

  async findCompletedBookingsPreviousDays(agencyId: string, days: number = 1) {
    const endDate = new Date()
    const startDate = subDays(endDate, days)

    const bookings = await bookingRepository.readCompletedBookingsData(
      agencyId,
      startDate,
      endDate,
    )
    return bookings.map((booking) => {
      return {
        status: booking.status.toString(),
        updatedAt: booking.completedAt ?? booking.updatedAt,
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
    const queryDate = addDays(new Date(), days)

    const bookings = await bookingRepository.readUpcomingBookingsData(
      agencyId,
      queryDate,
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
    const queryDate = addDays(new Date(), days)

    const bookings = await bookingRepository.readBookingsScheduleData(
      agencyId,
      queryDate,
    )
    return bookings.map((booking) => {
      return {
        type: booking.type.toString(),
        route: booking.source.city + " - " + booking.destination.city,
        vehicle: booking.assignedVehicle?.vehicleNumber,
        driver: booking.assignedDriver?.name,
        customerName: booking.customer?.name,
        customerPhotoUrl: booking.customer?.photoUrl,
        bookingId: booking.id,
        startDate: booking.startDate,
        endDate: booking.endDate,
        status: booking.status,
      }
    })
  },

  async findBookingsHistoryLastDays(agencyId: string, days: number = 7) {
    const startDate = subDays(new Date(), days)

    const bookings = await bookingRepository.readBookingsHistoryData(
      agencyId,
      startDate,
    )
    return bookings.map((booking) => {
      return {
        type: booking.type.toString(),
        route: booking.source.city + " - " + booking.destination.city,
        vehicle: booking.assignedVehicle?.vehicleNumber,
        driver: booking.assignedDriver?.name,
        customerName: booking.customer?.name,
        customerPhotoUrl: booking.customer?.photoUrl,
        bookingId: booking.id,
        startDate: booking.startDate,
        endDate: booking.endDate,
        status: booking.status,
      }
    })
  },

  async findLeadBookingsNextDays(agencyId: string, days: number = 1) {
    const startDate = new Date()
    //Day today
    const endDate = addDays(startDate, days)
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
        startDate: booking.startDate,
        assignedUser: booking.assignedUser.name,
        passengers: booking.passengers,
        amount: booking.estimatedTotalAmount,
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
  async addNewBooking(
    agencyId: string,
    userId: string,
    customerId: string,
    data: NewBookingRequestDataType,
  ) {
    //Step1: Get trip sourceId and destinationId from city & state
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

    const finalPrice = getEstimatedTotalPrice(data)

    //Step4: Prepare data
    const newBookingData: InsertBookingType = {
      agencyId: agencyId,
      customerId: customerId,
      bookedByUserId: userId,
      assignedUserId: userId,
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
    const newBooking = await bookingRepository.createBooking(newBookingData)
    return newBooking[0]
  },

  //Confirm a booking
  async confirmBooking(
    bookingId: string,
    startTime: string,
    pickupAddress: string,
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
      startLog && endLog
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
    await bookingRepository.updateBookingTotals(
      bookingId,
      actualStartDate,
      actualEndDate,
      actualTotalDistance,
      actualTotals.totalVehiclePrice,
      actualTotals.totalACPrice,
      actualTotals.totalDriverAllowance,
      actualTotals.totalCommission,
      actualTotals.totalAmount,
    )
  },

  //End booking to mark it completed
  async changeBookingToCompleted(
    bookingId: string,
    driverId: string,
    vehicleId: string,
    customerId: string,
    customerRating?: number,
    bookingRating?: number,
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
    const completedBooking = await bookingRepository.completeBookingTransaction(
      bookingId,
      driverId,
      vehicleId,
      customerId,
      customerRating,
      bookingRating,
    )
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

    const updatedBooking =
      await bookingRepository.updateBookingToCancel(bookingId)
    return updatedBooking[0]
  },

  //Assign driver to booking
  async assignDriverToBooking(bookingId: string, driverId: string) {
    const driver = await driverRepository.readDriverById(driverId)
    if (!driver || driver.status === DriverStatusEnum.SUSPENDED) return

    const booking = await bookingRepository.readBookingById(bookingId)
    if (
      !booking ||
      ![BookingStatusEnum.LEAD, BookingStatusEnum.CONFIRMED].includes(
        booking.status,
      )
    )
      return

    const updatedBooking = await bookingRepository.updateAssignedDriver(
      bookingId,
      driverId,
    )
    return {
      ...updatedBooking[0],
      driverUserId: driver.userId,
      driverName: driver.name,
      startDate: booking.startDate,
    }
  },

  //Assign vehicle to booking
  async assignVehicleToBooking(bookingId: string, vehicleId: string) {
    const vehicle = await vehicleRepository.readVehicleById(vehicleId)
    if (!vehicle || vehicle.status === VehicleStatusEnum.SUSPENDED) return

    const booking = await bookingRepository.readBookingById(bookingId)
    if (
      !booking ||
      ![BookingStatusEnum.LEAD, BookingStatusEnum.CONFIRMED].includes(
        booking.status,
      )
    )
      return

    const updatedBooking = await bookingRepository.updateAssignedVehicle(
      bookingId,
      vehicleId,
    )

    return {
      ...updatedBooking[0],
      vehicleNumber: vehicle.vehicleNumber,
      driverUserId: booking.assignedDriver?.userId,
    }
  },

  //Assign user to booking
  async assignUserToBooking(bookingId: string, userId: string) {
    const user = await userRepository.readUserById(userId)
    if (!user || user.status === UserStatusEnum.SUSPENDED) return

    const booking = await bookingRepository.readBookingById(bookingId)
    if (!booking) return

    const updatedBooking = await bookingRepository.updateAssignedUser(
      bookingId,
      userId,
    )
    return {
      ...updatedBooking[0],
      assignedUserName: user.name,
      startDate: booking.startDate,
    }
  },

  async changeReviewedByAgency(bookingId: string) {
    //TODO: Update total amount with added expenses as well

    const updatedBooking =
      await bookingRepository.updateReviewCompletedAt(bookingId)
    return updatedBooking[0]
  },

  async addQuoteUrl(bookingId: string, url: string) {
    return await bookingRepository.updateQuoteUrl(bookingId, url)
  },

  async changeQuoteSent(bookingId: string) {
    return await bookingRepository.updateQuoteSent(bookingId)
  },

  async addConfirmationUrl(bookingId: string, url: string) {
    return await bookingRepository.updateConfirmationUrl(bookingId, url)
  },

  async changeConfirmationSent(bookingId: string) {
    return await bookingRepository.updateConfirmationSent(bookingId)
  },

  async addInvoiceUrl(bookingId: string, url: string) {
    return await bookingRepository.updateInvoiceUrl(bookingId, url)
  },

  async changeInvoiceSent(bookingId: string) {
    return await bookingRepository.updateInvoiceSent(bookingId)
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

export type FindUpcomingBookingsNextDaysType = Awaited<
  ReturnType<typeof bookingServices.findUpcomingBookingsNextDays>
>

export type FindBookingScheduleNextDaysType = Awaited<
  ReturnType<typeof bookingServices.findBookingsScheduleNextDays>
>

export type FindBookingHistoryLastDaysType = Awaited<
  ReturnType<typeof bookingServices.findBookingsHistoryLastDays>
>

export type FindLeadBookingsNextDaysType = Awaited<
  ReturnType<typeof bookingServices.findLeadBookingsNextDays>
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
