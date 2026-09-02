import GetVehicleIcon from "@/components/icons/vehicleIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoCaption } from "@/components/typography"
import { FindDashboardVehiclesType } from "@ryogo-travel-app/api/services/vehicle.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import {
  DashboardChipItemWrapper,
  DashboardLabelImageChip,
} from "@/components/flows/dashboard/dashboardCommon"
import Link from "next/link"

export default function DashboardVehicleChipComponent({
  vehicle,
  type,
}: {
  vehicle: FindDashboardVehiclesType[number]
  type: "available" | "onTrip" | "repair" | "inactive"
}) {
  const vehicleImageUrl = vehicle.vehiclePhotoUrl

  return (
    <Link href={`/dashboard/vehicles/${vehicle.id}`}>
      <DashboardChipItemWrapper>
        <DashboardLabelImageChip label={vehicle.vehicleNumber}>
          {vehicleImageUrl ? (
            <RyogoImage
              src={getFileUrl(vehicleImageUrl)}
              alt={vehicle.vehicleNumber}
              imageSize="xs"
            />
          ) : (
            <GetVehicleIcon vehicleType={vehicle.type} size="sm" />
          )}
        </DashboardLabelImageChip>
        <RyogoCaption color="light">
          {vehicle.brand + " " + vehicle.model}
        </RyogoCaption>
      </DashboardChipItemWrapper>
    </Link>
  )
}
