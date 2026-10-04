import { GetCanDriveIcons } from "@/components/icons/vehicleIcon"
import { FindDashboardDriversType } from "@ryogo-travel-app/api/services/driver.services"
import { IdCard } from "lucide-react"
import { DashboardChipItemWrapper } from "@/components/flows/dashboard/dashboardCommon"
import Link from "next/link"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"

export default function DashboardDriverChipComponent({
  driver,
}: {
  driver: FindDashboardDriversType[number]
}) {
  return (
    <Link href={`/dashboard/drivers/${driver.id}`}>
      <DashboardChipItemWrapper>
        <RyogoImageIconTag
          url={driver.user.photoUrl}
          label={driver.name}
          icon={IdCard}
        />
        <GetCanDriveIcons canDrive={driver.canDriveVehicleTypes} />
      </DashboardChipItemWrapper>
    </Link>
  )
}
