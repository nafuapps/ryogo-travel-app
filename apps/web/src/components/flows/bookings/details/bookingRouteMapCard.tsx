import { GoogleMapsEmbedDirectionsComponent } from "@/components/maps/googleMapsEmbed"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"

export default function BookingRouteMapCard({
  source,
  destination,
  updatedAt,
  isInProgress,
  tripLogs,
}: {
  source: string
  destination: string
  isInProgress?: boolean
  updatedAt: Date
  tripLogs: NonNullable<FindBookingDetailsByIdType>["tripLogs"]
}) {
  let center
  let time
  if (isInProgress && tripLogs.length > 0) {
    //Find the latest trip log which is not OTHER
    const nonOtherTripLogs = tripLogs.filter(
      (tripLog) => tripLog.type !== TripLogTypesEnum.OTHER,
    )
    if (nonOtherTripLogs.length > 0) {
      const latestTripLog = nonOtherTripLogs[nonOtherTripLogs.length - 1]
      if (latestTripLog) {
        center = latestTripLog.latLong
        time = latestTripLog.createdAt
      }
    }
  }

  return (
    <GoogleMapsEmbedDirectionsComponent
      source={source}
      destination={destination}
      center={center}
      time={time ?? updatedAt}
    />
  )
}
