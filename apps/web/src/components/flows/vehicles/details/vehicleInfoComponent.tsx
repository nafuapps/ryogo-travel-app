import { RyogoH4 } from "@/components/typography"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { RyogoDialogImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import {
  VehicleStatusEnum,
  VehicleTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { VehicleStatusPill } from "@/components/pills/ryogoPills"
import GetVehicleIcon from "@/components/icons/vehicleIcon"

export default function VehicleInfoComponent({
  photoUrl,
  vehicleNumber,
  status,
  type,
}: {
  photoUrl: string | null
  vehicleNumber: string
  status: VehicleStatusEnum
  type: VehicleTypesEnum
}) {
  return (
    <SectionColWrapper className="items-center justify-center">
      {photoUrl ? (
        <RyogoDialogImage
          src={getFileUrl(photoUrl)}
          alt={photoUrl}
          imageSize="lg"
        />
      ) : (
        <GetVehicleIcon vehicleType={type} size="xl" />
      )}
      <SectionColWrapper small className="items-center">
        <RyogoH4 weight="font-bold">{vehicleNumber}</RyogoH4>
        <VehicleStatusPill status={status} className="mt-auto self-center" />
      </SectionColWrapper>
    </SectionColWrapper>
  )
}
