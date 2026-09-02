import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { FindDashboardTripsType } from "@ryogo-travel-app/api/services/booking.services"
import {
  DashboardBoxItemWrapper,
  DashboardLabelImageChip,
} from "@/components/flows/dashboard/dashboardCommon"
import { RyogoImage } from "@/components/images/ryogoImage"
import GetVehicleIcon from "@/components/icons/vehicleIcon"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { IdCard } from "lucide-react"
import GetTripTypeIcon from "@/components/icons/tripTypeIcon"
import Link from "next/link"

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
        <SectionRowWrapper small center>
          <RyogoCaption color="light" weight="font-bold">
            {trip.id}
          </RyogoCaption>
          <RyogoCaption color={isLate ? "red" : "slate"}>
            {type === "starting"
              ? trip.startTime
              : trip.endDate.toLocaleDateString()}
          </RyogoCaption>
        </SectionRowWrapper>
        <SectionRowWrapper small center>
          <RyogoP weight="font-bold">{trip.source.city}</RyogoP>
          <GetTripTypeIcon tripType={trip.type} size="sm" color="light" thick />
          <RyogoP weight="font-bold">{trip.destination.city}</RyogoP>
        </SectionRowWrapper>
        <SectionRowWrapper small center>
          {trip.assignedVehicle && (
            <DashboardLabelImageChip label={trip.assignedVehicle.vehicleNumber}>
              {vehicleImageUrl ? (
                <RyogoImage
                  src={getFileUrl(vehicleImageUrl)}
                  alt={trip.assignedVehicle.vehicleNumber}
                  imageSize="xs"
                />
              ) : (
                <GetVehicleIcon
                  vehicleType={trip.assignedVehicle.type}
                  size="sm"
                />
              )}
            </DashboardLabelImageChip>
          )}
          {trip.assignedDriver && (
            <DashboardLabelImageChip label={trip.assignedDriver.name} end>
              {driverImageUrl ? (
                <RyogoImage
                  src={getFileUrl(driverImageUrl)}
                  alt={trip.assignedDriver.name}
                  imageSize="xs"
                />
              ) : (
                <RyogoEnclosedIcon icon={IdCard} size="sm" />
              )}
            </DashboardLabelImageChip>
          )}
        </SectionRowWrapper>
      </DashboardBoxItemWrapper>
    </Link>
  )
}
