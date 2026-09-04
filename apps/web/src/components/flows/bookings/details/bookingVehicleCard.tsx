import GetVehicleIcon from "@/components/icons/vehicleIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { RyogoSmall, RyogoCaption, RyogoP } from "@/components/typography"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"

export default function BookingVehicleCard({
  vehicle,
}: {
  vehicle: NonNullable<
    NonNullable<FindBookingDetailsByIdType>["assignedVehicle"]
  >
}) {
  return (
    <div className="flex gap-2 lg:gap-3 p-2 lg:p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg items-center">
      {vehicle.vehiclePhotoUrl ? (
        <RyogoImage
          src={getFileUrl(vehicle.vehiclePhotoUrl)}
          alt={vehicle.vehicleNumber}
          imageSize="md"
        />
      ) : (
        <GetVehicleIcon vehicleType={vehicle.type} size="lg" />
      )}
      <SectionColWrapper wFull small>
        <RyogoP weight="font-bold">{vehicle.vehicleNumber}</RyogoP>
        <RyogoCaption color="slate">
          {vehicle.brand + " " + vehicle.model}
        </RyogoCaption>
        <RyogoCaption color="light">{vehicle.color}</RyogoCaption>
      </SectionColWrapper>
      <SectionColWrapper end small>
        <RyogoCaption color="light" weight="font-bold">
          {vehicle.type.toUpperCase()}
        </RyogoCaption>
        <RyogoSmall weight="font-bold">{vehicle.capacity}</RyogoSmall>
        <RyogoSmall weight="font-bold">{vehicle.hasAC}</RyogoSmall>
      </SectionColWrapper>
    </div>
  )
}
