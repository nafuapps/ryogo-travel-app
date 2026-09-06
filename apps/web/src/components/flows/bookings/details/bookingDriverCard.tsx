import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { GetCanDriveIcons } from "@/components/icons/vehicleIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { RyogoP, RyogoCaption } from "@/components/typography"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User } from "lucide-react"
import Link from "next/link"

export default function BookingDriverCard({
  driver,
}: {
  driver: NonNullable<FindBookingDetailsByIdType>["assignedDriver"]
}) {
  if (!driver) return null
  return (
    <Link href={`/dashboard/drivers/${driver.id}`}>
      <div className="flex gap-2 lg:gap-3 p-2 lg:p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg items-center">
        {driver.user.photoUrl ? (
          <RyogoImage
            src={getFileUrl(driver.user.photoUrl)}
            alt={driver.name}
            imageSize="md"
          />
        ) : (
          <RyogoEnclosedIcon icon={User} size="lg" />
        )}
        <SectionColWrapper wFull small>
          <RyogoP weight="font-bold">{driver.name}</RyogoP>
          <RyogoCaption color="slate">{driver.phone}</RyogoCaption>
          <GetCanDriveIcons canDrive={driver.canDriveVehicleTypes} />
        </SectionColWrapper>
      </div>
    </Link>
  )
}
