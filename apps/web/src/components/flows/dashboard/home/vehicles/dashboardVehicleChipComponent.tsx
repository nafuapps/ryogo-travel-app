import { DashboardChipItemWrapper } from "@/components/flows/dashboard/dashboardCommon"
import { getVehicleIcon } from "@/components/icons/vehicleIcon"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"
import { RyogoCaption } from "@/components/typography"
import { FindDashboardVehiclesType } from "@ryogo-travel-app/api/services/vehicle.services"
import Link from "next/link"

export default function DashboardVehicleChipComponent({
  vehicle,
}: {
  vehicle: FindDashboardVehiclesType[number]
}) {
  const vehicleImageUrl = vehicle.vehiclePhotoUrl

  return (
    <Link href={`/dashboard/vehicles/${vehicle.id}`} prefetch={false}>
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
