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

export const LOGIN_PASSWORD_ERROR = "passwordNotMatching"
export const LOGIN_USER_ERROR = "userNotFound"
export const LOGIN_SESSION_ERROR = "sessionNotCreated"
export const LOGIN_UNKNOWN_ERROR = "unknown"
