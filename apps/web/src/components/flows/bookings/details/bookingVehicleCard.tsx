import GetVehicleEnclosedIcon from "@/components/icons/vehicleIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoSmall, RyogoCaption, RyogoP } from "@/components/typography"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"

export default function BookingVehicleCard({
  vehicle,
}: {
  vehicle: NonNullable<FindBookingDetailsByIdType>["assignedVehicle"]
}) {
  if (!vehicle) return null
  return (
    <SectionRowWrapper className="p-2 lg:p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg items-center">
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
        <RyogoSmall weight="font-bold">{vehicle.capacity}</RyogoSmall>
        <RyogoSmall weight="font-bold">{vehicle.hasAC}</RyogoSmall>
      </SectionColWrapper>
    </SectionRowWrapper>
  )
}
