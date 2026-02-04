import { clsx, type ClassValue } from "clsx"
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
