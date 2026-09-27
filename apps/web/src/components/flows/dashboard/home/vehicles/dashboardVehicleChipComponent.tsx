import { getVehicleIcon } from "@/components/icons/vehicleIcon"
import { RyogoCaption } from "@/components/typography"
import { FindDashboardVehiclesType } from "@ryogo-travel-app/api/services/vehicle.services"
import { DashboardChipItemWrapper } from "@/components/flows/dashboard/dashboardCommon"
import Link from "next/link"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"

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
        <RyogoImageIconTag
          url={vehicleImageUrl}
          label={vehicle.vehicleNumber}
          icon={getVehicleIcon(vehicle.type)}
        />
        <RyogoCaption color="light">
          {vehicle.brand + " " + vehicle.model}
        </RyogoCaption>
      </DashboardChipItemWrapper>
    </Link>
  )
}
