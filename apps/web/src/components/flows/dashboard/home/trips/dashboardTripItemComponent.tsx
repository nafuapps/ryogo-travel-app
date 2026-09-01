import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { FindDashboardTripsType } from "@ryogo-travel-app/api/services/booking.services"
import Link from "next/link"
import { DashboardLabelImageChip } from "@/components/flows/dashboard/dashboardCommon"
import { RyogoImage } from "@/components/images/ryogoImage"
import GetVehicleIcon from "@/components/icons/vehicleIcon"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { IdCard } from "lucide-react"
import GetTripTypeIcon from "@/components/icons/tripTypeIcon"

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
      <div
        className={`flex flex-col gap-2 lg:gap-3 w-full border ${highlight ? "border-sky-300 dark:border-sky-700 hover:bg-sky-100 dark:hover:bg-sky-950" : "border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"} rounded-lg p-3 lg:p-4`}
      >
        <SectionRowWrapper center>
          <RyogoCaption color="light" weight="font-bold">
            {trip.id}
          </RyogoCaption>
          <RyogoCaption color={isLate ? "red" : "slate"}>
            {type === "starting"
              ? trip.startTime
              : trip.endDate.toLocaleDateString()}
          </RyogoCaption>
        </SectionRowWrapper>
        <SectionRowWrapper center>
          <RyogoP weight="font-bold">{trip.source.city}</RyogoP>
          <GetTripTypeIcon tripType={trip.type} size="sm" thick />
          <RyogoP weight="font-bold">{trip.destination.city}</RyogoP>
        </SectionRowWrapper>
        <SectionRowWrapper center>
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
      </div>
    </Link>
  )
}
