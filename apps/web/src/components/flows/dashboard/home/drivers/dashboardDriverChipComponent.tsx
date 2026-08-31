import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { GetCanDriveIcons } from "@/components/icons/vehicleIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { FindDashboardDriversType } from "@ryogo-travel-app/api/services/driver.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { IdCard } from "lucide-react"
import { Route } from "next"
import {
  DashboardItemWrapper,
  DashboardLabelImageChip,
} from "@/components/flows/dashboard/dashboardCommon"

export default function DashboardDriverChipComponent({
  driver,
  type,
}: {
  driver: FindDashboardDriversType[number]
  type: "available" | "onTrip" | "leave" | "inactive"
}) {
  const driverImageUrl = driver.user.photoUrl

  return (
    <DashboardItemWrapper href={`/dashboard/drivers/${driver.id}` as Route}>
      <DashboardLabelImageChip label={driver.name}>
        {driverImageUrl ? (
          <RyogoImage
            src={getFileUrl(driverImageUrl)}
            alt={driver.name}
            imageSize="xs"
          />
        ) : (
          <RyogoEnclosedIcon icon={IdCard} size="sm" />
        )}
      </DashboardLabelImageChip>
      <GetCanDriveIcons canDrive={driver.canDriveVehicleTypes} />
    </DashboardItemWrapper>
  )
}
