import GetVehicleIcon from "@/components/icons/vehicleIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoCaption } from "@/components/typography"
import { FindDashboardVehiclesType } from "@ryogo-travel-app/api/services/vehicle.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { Route } from "next"
import {
  DashboardItemWrapper,
  DashboardLabelImageChip,
} from "@/components/flows/dashboard/dashboardCommon"

export default function DashboardVehicleChipComponent({
  vehicle,
  type,
}: {
  vehicle: FindDashboardVehiclesType[number]
  type: "available" | "onTrip" | "repair" | "inactive"
}) {
  const vehicleImageUrl = vehicle.vehiclePhotoUrl

  return (
    <DashboardItemWrapper href={`/dashboard/vehicles/${vehicle.id}` as Route}>
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
      <RyogoCaption color="light" weight="font-bold">
        {vehicle.brand + " " + vehicle.model}
      </RyogoCaption>
    </DashboardItemWrapper>
  )
}
