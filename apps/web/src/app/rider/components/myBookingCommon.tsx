import { SmallBold, CaptionGrey, P } from "@/components/typography"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { BookingTypeEnum, TripLogTypesEnum } from "@ryogo-travel-app/db/schema"

export function BookingSection({
  sectionTitle,
  children,
}: {
  sectionTitle: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 lg:gap-3">
      <SmallBold>{sectionTitle}</SmallBold>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 items-center">
        {children}
      </div>
    </div>
  )
}

export function BookingItem({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2 sm:gap-0.5 lg:gap-1 last:text-end sm:last:text-start">
      <CaptionGrey>{title}</CaptionGrey>
      <P>{value}</P>
    </div>
  )
}

export function getNextStep(
  bookingType: BookingTypeEnum,
  endDate: Date,
  tripLogs: NonNullable<FindBookingDetailsByIdType>["tripLogs"],
) {
  //One way trip: START_TRIP->ARRIVED->PICKUP->DROP->END_TRIP
  if (bookingType == BookingTypeEnum.OneWay) {
    if (tripLogs.some((t) => t.type == TripLogTypesEnum.DROP)) {
      return TripLogTypesEnum.END_TRIP
    }
    if (tripLogs.some((t) => t.type == TripLogTypesEnum.PICKUP)) {
      return TripLogTypesEnum.DROP
    }
    if (tripLogs.some((t) => t.type == TripLogTypesEnum.ARRIVED)) {
      return TripLogTypesEnum.PICKUP
    }
    if (tripLogs.some((t) => t.type == TripLogTypesEnum.START_TRIP)) {
      return TripLogTypesEnum.ARRIVED
    }
    return TripLogTypesEnum.START_TRIP
  }
  //Round trip: START_TRIP->ARRIVED->PICKUP->DROP->ARRIVED->PICKUP->DROP->END_TRIP
  if (bookingType == BookingTypeEnum.Round) {
    if (tripLogs.filter((t) => t.type == TripLogTypesEnum.DROP).length > 1) {
      return TripLogTypesEnum.END_TRIP
    }
    if (tripLogs.filter((t) => t.type == TripLogTypesEnum.PICKUP).length > 1) {
      return TripLogTypesEnum.DROP
    }
    if (tripLogs.filter((t) => t.type == TripLogTypesEnum.ARRIVED).length > 1) {
      return TripLogTypesEnum.PICKUP
    }
    if (tripLogs.filter((t) => t.type == TripLogTypesEnum.DROP).length == 1) {
      return TripLogTypesEnum.ARRIVED
    }
    if (tripLogs.filter((t) => t.type == TripLogTypesEnum.PICKUP).length == 1) {
      return TripLogTypesEnum.DROP
    }
    if (
      tripLogs.filter((t) => t.type == TripLogTypesEnum.ARRIVED).length == 1
    ) {
      return TripLogTypesEnum.PICKUP
    }
    if (
      tripLogs.filter((t) => t.type == TripLogTypesEnum.START_TRIP).length == 1
    ) {
      return TripLogTypesEnum.ARRIVED
    }
    return TripLogTypesEnum.START_TRIP
  }
  //Multi day trip: START_TRIP->(ARRIVED->PICKUP->DROP)->END_TRIP
  if (
    tripLogs.filter((t) => t.type == TripLogTypesEnum.DROP).length ==
    tripLogs.filter((t) => t.type == TripLogTypesEnum.ARRIVED).length
  ) {
    if (
      endDate <= new Date() &&
      tripLogs.filter((t) => t.type == TripLogTypesEnum.DROP).length > 0
    ) {
      return TripLogTypesEnum.END_TRIP
    }
    if (tripLogs.some((t) => t.type == TripLogTypesEnum.START_TRIP)) {
      return TripLogTypesEnum.ARRIVED
    }
    return TripLogTypesEnum.START_TRIP
  }
  if (
    tripLogs.filter((t) => t.type == TripLogTypesEnum.DROP).length <
    tripLogs.filter((t) => t.type == TripLogTypesEnum.PICKUP).length
  ) {
    return TripLogTypesEnum.DROP
  }
  if (
    tripLogs.filter((t) => t.type == TripLogTypesEnum.PICKUP).length <
    tripLogs.filter((t) => t.type == TripLogTypesEnum.ARRIVED).length
  ) {
    return TripLogTypesEnum.PICKUP
  }
  return TripLogTypesEnum.START_TRIP
}

// export function getMaxOdometerReading(
//   tripLogs: NonNullable<FindBookingDetailsByIdType>["tripLogs"],
// ) {
//   return tripLogs.reduce((accumulator, currentValue) => {
//     return Math.max(accumulator, currentValue.odometerReading)
//   }, 0)
// }
