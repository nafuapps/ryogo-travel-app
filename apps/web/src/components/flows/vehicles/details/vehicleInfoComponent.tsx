import { RyogoH4 } from "@/components/typography"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoDialogImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import {
  VehicleStatusEnum,
  VehicleTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { VehicleStatusPill } from "@/components/pills/ryogoPills"
import GetVehicleIcon from "@/components/icons/vehicleIcon"
import IdCopyPill from "@/components/pills/idCopyPill"
import ChangeVehiclePhotoSheet from "@/components/sheets/changeVehiclePhotoSheet"

export default function VehicleInfoComponent({
  id,
  agencyId,
  photoUrl,
  vehicleNumber,
  status,
  type,
  canChange,
}: {
  id: string
  agencyId: string
  photoUrl: string | null
  vehicleNumber: string
  status: VehicleStatusEnum
  type: VehicleTypesEnum
  canChange?: boolean
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
        <ChangeVehiclePhotoSheet
          vehicleId={id}
          agencyId={agencyId}
          canChange={canChange}
        >
          <GetVehicleIcon vehicleType={type} size="xl" />
        </ChangeVehiclePhotoSheet>
      )}
      <SectionColWrapper className="items-center">
        <RyogoH4 weight="font-bold">{vehicleNumber}</RyogoH4>
        <SectionRowWrapper className="items-center">
          <VehicleStatusPill status={status} size="lg" />
          <IdCopyPill id={id} />
        </SectionRowWrapper>
      </SectionColWrapper>
    </SectionColWrapper>
  )
}
