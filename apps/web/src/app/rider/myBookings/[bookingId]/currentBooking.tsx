"use client"

import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { BookingTypeEnum, TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import StartTripSheet from "@/components/flows/rider/tripSheets/startTripSheet"
import EndTripSheet from "@/components/flows/rider/tripSheets/endTripSheet"
import MidTripSheet from "@/components/flows/rider/tripSheets/midTripSheet"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { Navigation } from "lucide-react"
import { getTripDuration } from "@/lib/utils"
import { differenceInDays, differenceInMinutes } from "date-fns"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { OTHER_TRIP_LOG_INTERVAL_MINUTES } from "@ryogo-travel-app/api/apiConfig"
import { useTranslations } from "next-intl"
import { useEffect, useMemo } from "react"
import { useLocation } from "@/hooks/useLocation"
import { otherTripLogAction } from "@/app/actions/bookings/otherTripLogAction"

export default function RiderMyOngoingBookingPageComponent({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const latLong = useLocation()

  const tripDays = useMemo(
    () => getTripDuration(booking.startDate, booking.endDate),
    [],
  )

  const tripLogCounts = useMemo(
    () => getTripLogCounts(booking.tripLogs),
    [booking.tripLogs],
  )

  const nextStep = getNextStep(
    booking.type,
    booking.endDate,
    tripDays,
    tripLogCounts,
  )

  //Regularly capture location in a trip log (OTHER)
  const otherTripLogs = booking.tripLogs.filter(
    (log) => log.type === TripLogTypesEnum.OTHER,
  )
  let captureOtherTripLog = false
  if (otherTripLogs.length < 1) {
    captureOtherTripLog = true
  } else {
    const lastOtherTripLog = otherTripLogs[otherTripLogs.length - 1]
    if (!lastOtherTripLog) {
      captureOtherTripLog = true
    } else {
      const diffInMinutes = differenceInMinutes(
        new Date(),
        lastOtherTripLog.createdAt,
      )
      if (diffInMinutes > OTHER_TRIP_LOG_INTERVAL_MINUTES) {
        captureOtherTripLog = true
      }
    }
  }

  useEffect(() => {
    const triggerAction = async () => {
      if (
        captureOtherTripLog &&
        latLong.latitude &&
        latLong.longitude &&
        booking.assignedDriverId &&
        booking.assignedVehicleId
      ) {
        await otherTripLogAction({
          agencyId: booking.agencyId,
          bookingId: booking.id,
          driverId: booking.assignedDriverId,
          vehicleId: booking.assignedVehicleId,
          type: TripLogTypesEnum.OTHER,
          lat: latLong.latitude,
          long: latLong.longitude,
        })
      }
    }
    triggerAction()
  }, [latLong])

  return (
    <>
      {nextStep === TripLogTypesEnum.STARTED ? (
        <StartTripSheet booking={booking} latLong={latLong} />
      ) : nextStep === TripLogTypesEnum.ENDED ? (
        <EndTripSheet booking={booking} latLong={latLong} />
      ) : (
        <MidTripSheet booking={booking} latLong={latLong} tripType={nextStep} />
      )}
      {showNavigation(
        nextStep,
        booking.type,
        tripLogCounts,
        booking.pickupAddress,
        booking.dropAddress,
      )}
    </>
  )
}

type TripLogCountsType = {
  startedCount: number
  arrivedCount: number
  pickedUpCount: number
  droppedCount: number
  endedCount: number
}

function getTripLogCounts(
  tripLogs: NonNullable<FindBookingDetailsByIdType>["tripLogs"],
) {
  const counts = tripLogs.reduce(
    (acc, log) => {
      acc[log.type] = (acc[log.type] ?? 0) + 1
      return acc
    },
    {
      [TripLogTypesEnum.STARTED]: 0,
      [TripLogTypesEnum.ARRIVED]: 0,
      [TripLogTypesEnum.PICKED_UP]: 0,
      [TripLogTypesEnum.DROPPED]: 0,
      [TripLogTypesEnum.ENDED]: 0,
      [TripLogTypesEnum.OTHER]: 0,
    } as Record<TripLogTypesEnum, number>,
  )
  const startedCount = counts[TripLogTypesEnum.STARTED]
  const arrivedCount = counts[TripLogTypesEnum.ARRIVED]
  const pickedUpCount = counts[TripLogTypesEnum.PICKED_UP]
  const droppedCount = counts[TripLogTypesEnum.DROPPED]
  const endedCount = counts[TripLogTypesEnum.ENDED]

  const tripLogCounts: TripLogCountsType = {
    startedCount,
    arrivedCount,
    pickedUpCount,
    droppedCount,
    endedCount,
  }
  return tripLogCounts
}

function getNextStep(
  bookingType: BookingTypeEnum,
  endDate: Date,
  tripDays: number,
  tripLogCounts: TripLogCountsType,
) {
  const now = new Date()
  const {
    startedCount,
    arrivedCount,
    pickedUpCount,
    droppedCount,
    endedCount,
  } = tripLogCounts

  if (endedCount > 0) return TripLogTypesEnum.ENDED

  if (bookingType === BookingTypeEnum.OneWay) {
    if (droppedCount > 0) return TripLogTypesEnum.ENDED
    if (pickedUpCount > 0) return TripLogTypesEnum.DROPPED
    if (arrivedCount > 0) return TripLogTypesEnum.PICKED_UP
    if (startedCount > 0) return TripLogTypesEnum.ARRIVED
    return TripLogTypesEnum.STARTED
  }

  if (bookingType === BookingTypeEnum.Round) {
    if (droppedCount > 1) return TripLogTypesEnum.ENDED
    if (pickedUpCount > arrivedCount) return TripLogTypesEnum.DROPPED
    if (arrivedCount > pickedUpCount) return TripLogTypesEnum.PICKED_UP
    if (droppedCount === 1 || startedCount === 1)
      return TripLogTypesEnum.ARRIVED
    if (pickedUpCount === 1) return TripLogTypesEnum.DROPPED
    if (arrivedCount === 1) return TripLogTypesEnum.PICKED_UP
    return TripLogTypesEnum.STARTED
  }

  //For multi day trip, end the trip when, either trip days are completed or end date has passed by trip days
  if (droppedCount === arrivedCount) {
    if (
      (droppedCount > 0 && droppedCount === tripDays) ||
      differenceInDays(now, endDate) > tripDays
    )
      return TripLogTypesEnum.ENDED
    return startedCount > 0
      ? TripLogTypesEnum.ARRIVED
      : TripLogTypesEnum.STARTED
  }

  if (droppedCount < pickedUpCount) return TripLogTypesEnum.DROPPED
  if (pickedUpCount < arrivedCount) return TripLogTypesEnum.PICKED_UP
  return TripLogTypesEnum.STARTED
}

function showNavigation(
  nextStep: TripLogTypesEnum,
  tripType: BookingTypeEnum,
  tripLogCounts: TripLogCountsType,
  sourceAddress: string | null,
  destinationAddress: string | null,
) {
  if (nextStep === TripLogTypesEnum.DROPPED) {
    if (tripLogCounts.droppedCount === 0 && destinationAddress) {
      //Dropping at destination address
      return <NavigationButton address={destinationAddress} />
    }
    if (
      tripLogCounts.droppedCount > 0 &&
      tripType === BookingTypeEnum.Round &&
      sourceAddress
    ) {
      //Returning back to source address
      return <NavigationButton address={sourceAddress} />
    }
  }

  if (nextStep === TripLogTypesEnum.ARRIVED) {
    if (tripLogCounts.arrivedCount === 0 && sourceAddress) {
      //Picking up from source address
      return <NavigationButton address={sourceAddress} />
    }
    if (
      tripLogCounts.arrivedCount > 0 &&
      tripType === BookingTypeEnum.Round &&
      destinationAddress
    ) {
      if (destinationAddress) {
        //Picking up from destination address for return trip
        return <NavigationButton address={destinationAddress} />
      }
    }
  }
  return null
}

function NavigationButton({ address }: { address: string }) {
  const t = useTranslations("Rider.MyBooking")

  const location = encodeURIComponent(address)
  const mapUrl = `https://google.com?destination=${location}&travelmode=driving`

  return (
    <a href={mapUrl} target="_blank">
      <RyogoOutlineButton label={t("Navigate")} size="lg" className="w-full">
        <RyogoIcon icon={Navigation} size="sm" color="slate" thick />
      </RyogoOutlineButton>
    </a>
  )
}
