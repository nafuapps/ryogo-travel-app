import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { GetCanDriveIcons } from "@/components/icons/vehicleIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { FindDashboardDriversType } from "@ryogo-travel-app/api/services/driver.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { IdCard } from "lucide-react"
import {
  DashboardChipItemWrapper,
  DashboardLabelImageChip,
} from "@/components/flows/dashboard/dashboardCommon"
import Link from "next/link"

export default function DashboardDriverChipComponent({
  driver,
  type,
}: {
  driver: FindDashboardDriversType[number]
  type: "available" | "onTrip" | "leave" | "inactive"
}) {
  const driverImageUrl = driver.user.photoUrl

  return (
    <Link href={`/dashboard/drivers/${driver.id}`}>
      <DashboardChipItemWrapper>
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
      </DashboardChipItemWrapper>
    </Link>
  )
}
