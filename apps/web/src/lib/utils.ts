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

export function getCombinedDateTime(date: Date, time: string) {
  // 1. Ensure dateObj is a Date object (make a copy to avoid mutation)
  const combinedDateTime = new Date(date.getTime())

  // 2. Parse the time string (assuming "HH:MM" or "HH:MM:SS" format)
  const timeParts = time.split(":")
  const hours = parseInt(timeParts[0]!, 10)
  const minutes = parseInt(timeParts[1]!, 10)
  const seconds = parseInt(timeParts[2] || "0", 10) // Default to 0 seconds if not provided

  // 3. Set the time components on the combined date object (local time)
  combinedDateTime.setHours(hours)
  combinedDateTime.setMinutes(minutes)
  combinedDateTime.setSeconds(seconds)
  combinedDateTime.setMilliseconds(0) // Optional: reset milliseconds

  return combinedDateTime
}

export const LOGIN_PASSWORD_ERROR = "passwordNotMatching"
export const LOGIN_USER_ERROR = "userNotFound"
export const LOGIN_SESSION_ERROR = "sessionNotCreated"
export const LOGIN_UNKNOWN_ERROR = "unknown"
