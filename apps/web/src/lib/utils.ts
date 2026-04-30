import { NewBookingFormDataType } from "@/app/dashboard/bookings/new/newBookingCommon"
import { CreateNewBookingRequestType } from "@ryogo-travel-app/api/types/booking.types"
import { BookingTypeEnum } from "@ryogo-travel-app/db/schema"
import { clsx, type ClassValue } from "clsx"
import { differenceInDays, startOfDay } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getEnumValueDisplayPairs<T extends object>(
  enumType: T,
): { display: string; value: T[keyof T] }[] {
  return Object.keys(enumType).map((key) => ({
    value: enumType[key as keyof T],
    display: key,
  }))
}

export function getArrayValueDisplayPairs<T extends object>(
  arrayType: T,
): { display: string; value: string }[] {
  return Object.keys(arrayType).map((key) => ({
    value: key,
    display: key,
  }))
}

export function getStringValueDisplayPairs(
  stringType: string[],
): { display: string; value: string }[] {
  return stringType.map((key) => ({
    value: key,
    display: key,
  }))
}

export function getCombinedDateTime(date: Date, time: string | null) {
  if (!time) {
    return date
  }
  // 1. Ensure dateObj is a Date object (make a copy to avoid mutation)
  const combinedDateTime = new Date(date.getTime())

  // 2. Parse the time string (assuming "HH:MM" or "HH:MM:SS" format)
  const timeParts = time.split(":")
  if (!timeParts[0] || !timeParts[1]) {
    return date
  }
  const hours = parseInt(timeParts[0], 10)
  const minutes = parseInt(timeParts[1], 10)
  const seconds = parseInt(timeParts[2] || "0", 10) // Default to 0 seconds if not provided

  // 3. Set the time components on the combined date object (local time)
  combinedDateTime.setHours(hours)
  combinedDateTime.setMinutes(minutes)
  combinedDateTime.setSeconds(seconds)
  combinedDateTime.setMilliseconds(0) // Optional: reset milliseconds

  return combinedDateTime
}

export function generateAgencyLogoPathName(agencyId: string, logo: File) {
  return `agencies/${agencyId}/logo/${Date.now()}-${logo.name}`
}

export function generateUserPhotoPathName(userId: string, photo: File) {
  return `users/${userId}/photo/${Date.now()}-${photo.name}`
}

export function generateInsurancePhotoPathName(vehicleId: string, photo: File) {
  return `vehicles/${vehicleId}/insurancePhoto/${Date.now()}-${photo.name}`
}

export function generateRCPhotoPathName(vehicleId: string, photo: File) {
  return `vehicles/${vehicleId}/rcPhoto/${Date.now()}-${photo.name}`
}

export function generatePUCPhotoPathName(vehicleId: string, photo: File) {
  return `vehicles/${vehicleId}/pucPhoto/${Date.now()}-${photo.name}`
}

export function generateVehiclePhotoPathName(vehicleId: string, photo: File) {
  return `vehicles/${vehicleId}/vehiclePhoto/${Date.now()}-${photo.name}`
}

export function generateLicensePhotoPathName(driverId: string, photo: File) {
  return `drivers/${driverId}/licensePhoto/${Date.now()}-${photo.name}`
}

export function generateCustomerPhotoPathName(customerId: string, photo: File) {
  return `customers/${customerId}/photo/${Date.now()}-${photo.name}`
}

export function generateExpensePhotoPathName(
  bookingId: string,
  expenseId: string,
  photo: File,
) {
  return `bookings/${bookingId}/expenses/${expenseId}/photo/${Date.now()}-${photo.name}`
}

export function generateTransactionPhotoPathName(
  bookingId: string,
  txnId: string,
  photo: File,
) {
  return `bookings/${bookingId}/transactions/${txnId}/photo/${Date.now()}-${photo.name}`
}

export function generateTripLogPhotoPathName(
  bookingId: string,
  tripLogId: string,
  photo: File,
) {
  return `bookings/${bookingId}/tripLogs/${tripLogId}/photo/${Date.now()}-${photo.name}`
}

export function generateBookingQuoteName(bookingId: string) {
  return `bookings/${bookingId}/quotes/${bookingId}-quote-${Date.now()}.pdf`
}

export function generateBookingConfirmationName(bookingId: string) {
  return `bookings/${bookingId}/confirmations/${bookingId}-confirmation-${Date.now()}.pdf`
}

export function generateBookingInvoiceName(bookingId: string) {
  return `bookings/${bookingId}/invoices/${bookingId}-invoice-${Date.now()}.pdf`
}

export function getDuration(startDate: Date, endDate: Date) {
  return differenceInDays(startOfDay(endDate), startOfDay(startDate)) + 1
}

function getTripAllowanceDays(tripType: BookingTypeEnum, days: number) {
  if (tripType === BookingTypeEnum.Round) {
    if (days > 1) {
      //For round trip, double the driver allowance if not returning same day
      return 2
    } else {
      //If returning same day, give 1.5 days allowance
      return 1.5
    }
  }
  if (tripType === BookingTypeEnum.MultiDay) {
    //For multi day trip, driver allowance is for each day
    return days
  }
  //One way
  return 1
}

function getEstimatedTripDistance(
  tripType: BookingTypeEnum,
  days: number,
  distance: number,
) {
  if (tripType === BookingTypeEnum.Round) {
    //For round trip, double the distance
    return distance * 2
  } else if (tripType === BookingTypeEnum.MultiDay) {
    //For multi day trip, include intermediate tour days @ X(50) km
    return distance * 2 + (days - 2) * 50
  }
  //One way
  return distance
}

export function getEstimatedTotalPrice(
  data: NewBookingFormDataType | CreateNewBookingRequestType,
) {
  const days = getDuration(data.tripStartDate, data.tripEndDate)
  const commissionRate = data.selectedCommissionRate ?? 0

  const totalAllowanceDays = getTripAllowanceDays(data.tripType, days)
  const totalDistance = getEstimatedTripDistance(
    data.tripType,
    days,
    data.selectedDistance!,
  )

  const totalAcPrice =
    data.tripNeedsAC && data.selectedAcChargePerDay
      ? Math.round(data.selectedAcChargePerDay * totalAllowanceDays)
      : 0

  const totalVehiclePrice = Math.round(totalDistance * data.selectedRatePerKm!)
  const totalDriverAllowance = data.selectedAllowancePerDay
    ? Math.round(totalAllowanceDays * data.selectedAllowancePerDay)
    : 0

  const netPrice = totalVehiclePrice + totalDriverAllowance + totalAcPrice

  const totalCommission = Math.round((netPrice * commissionRate) / 100)

  const totalAmount = netPrice + totalCommission

  return {
    totalVehiclePrice,
    totalDistance,
    totalDriverAllowance,
    totalAcPrice,
    totalCommission,
    totalAmount,
    totalAllowanceDays,
    days,
  }
}

export function getFinalTotalPrice(
  tripType: BookingTypeEnum,
  startDate: Date,
  endDate: Date,
  ratePerKm: number,
  acChargePerDay: number,
  commissionRate: number,
  allowancePerDay: number,
  actualDistance: number,
) {
  const tripAllowanceDays = getTripAllowanceDays(
    tripType,
    getDuration(startDate, endDate),
  )

  const totalVehiclePrice = Math.round(actualDistance * ratePerKm)
  const totalDriverAllowance = Math.round(tripAllowanceDays * allowancePerDay)
  const totalACPrice = Math.round(tripAllowanceDays * acChargePerDay)

  const netPrice = totalVehiclePrice + totalDriverAllowance + totalACPrice
  const totalCommission = Math.round((netPrice * commissionRate) / 100)

  const totalAmount = netPrice + totalCommission
  return {
    totalVehiclePrice,
    totalDriverAllowance,
    totalACPrice,
    totalCommission,
    totalAmount,
  }
}
