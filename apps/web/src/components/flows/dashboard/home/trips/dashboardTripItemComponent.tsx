import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { FindDashboardTripsType } from "@ryogo-travel-app/api/services/booking.services"
import { DashboardBoxItemWrapper } from "@/components/flows/dashboard/dashboardCommon"
import { getVehicleIcon } from "@/components/icons/vehicleIcon"
import { IdCard } from "lucide-react"
import GetTripTypeIcon from "@/components/icons/tripTypeIcon"
import Link from "next/link"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"

export default async function DashboardTripItemComponent({
  trip,
  userId,
  isOwner,
  type,
}: {
  trip: FindDashboardTripsType[number]
  userId: string
  isOwner: boolean
  type: "starting" | "ending" | "ongoing"
}) {
  const isLate = type === "ending" && trip.endDate < new Date()
  const highlight = isOwner && trip.assignedUser.id === userId
  const driverImageUrl = trip.assignedDriver?.user.photoUrl
  const vehicleImageUrl = trip.assignedVehicle?.vehiclePhotoUrl

  return (
    <Link href={`/dashboard/bookings/${trip.id}`}>
      <DashboardBoxItemWrapper highlight={highlight}>
        <SectionRowWrapper small className="items-center justify-between">
          <RyogoCaption color="light" weight="font-bold">
            {trip.id}
          </RyogoCaption>
          <RyogoCaption color={isLate ? "red" : "slate"}>
            {type === "starting"
              ? trip.startTime
              : trip.endDate.toLocaleDateString()}
          </RyogoCaption>
        </SectionRowWrapper>
        <SectionRowWrapper small className="items-center justify-between">
          <RyogoP weight="font-bold">{trip.source.city}</RyogoP>
          <GetTripTypeIcon type={trip.type} size="sm" color="light" thick />
          <RyogoP weight="font-bold">{trip.destination.city}</RyogoP>
        </SectionRowWrapper>
        <SectionRowWrapper small className="items-center justify-between">
          {trip.assignedVehicle && (
            <RyogoImageIconTag
              url={vehicleImageUrl}
              label={trip.assignedVehicle.vehicleNumber}
              icon={getVehicleIcon(trip.assignedVehicle.type)}
            />
          )}
          {trip.assignedDriver && (
            <RyogoImageIconTag
              url={driverImageUrl}
              label={trip.assignedDriver.name}
              icon={IdCard}
            />
          )}
        </SectionRowWrapper>
      </DashboardBoxItemWrapper>
    </Link>
  )
}
