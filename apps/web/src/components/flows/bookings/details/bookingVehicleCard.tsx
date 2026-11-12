import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import GetVehicleEnclosedIcon from "@/components/icons/vehicleIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import RyogoTag from "@/components/tags/ryogoTag"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { AirVent, ClipboardX, User } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

export default function BookingVehicleCard({
  vehicle,
  withLink,
  isRider,
}: {
  vehicle: NonNullable<FindBookingDetailsByIdType>["assignedVehicle"]
  withLink?: boolean
  isRider?: boolean
}) {
  const t = useTranslations("Dashboard.BookingDetails")

  if (!vehicle) {
    return <EmptyStateIcon icon={ClipboardX} label={t("NoVehicleAssigned")} />
  }

  if (withLink) {
    return (
      <Link
        href={
          isRider ? `/rider/myVehicle` : `/dashboard/vehicles/${vehicle.id}`
        }
        className="hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg lg:transition lg:duration-300"
        prefetch={false}
      >
        <VehicleCard vehicle={vehicle} />
      </Link>
    )
  }
  return <VehicleCard vehicle={vehicle} />
}

function VehicleCard({
  vehicle,
}: {
  vehicle: NonNullable<
    NonNullable<FindBookingDetailsByIdType>["assignedVehicle"]
  >
}) {
  return (
    <SectionRowWrapper className="p-2 lg:p-3 items-center">
      {vehicle.vehiclePhotoUrl ? (
        <RyogoImage
          src={getFileUrl(vehicle.vehiclePhotoUrl)}
          alt={vehicle.vehicleNumber}
          imageSize="md"
        />
      ) : (
        <GetVehicleEnclosedIcon vehicleType={vehicle.type} size="lg" />
      )}
      <SectionColWrapper small className="w-full">
        <RyogoP weight="font-bold">{vehicle.vehicleNumber}</RyogoP>
        <RyogoCaption color="slate">
          {vehicle.brand + " " + vehicle.model}
        </RyogoCaption>
        <RyogoCaption color="light">{vehicle.color}</RyogoCaption>
      </SectionColWrapper>
      <SectionColWrapper small className="items-end">
        <RyogoCaption color="light" weight="font-bold">
          {vehicle.type}
        </RyogoCaption>
        <RyogoTag icon={User} label={vehicle.capacity.toString()} />
        {vehicle.hasAC && <RyogoIcon size="xs" icon={AirVent} color="light" />}
      </SectionColWrapper>
    </SectionRowWrapper>
  )
}
