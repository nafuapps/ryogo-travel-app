import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { GetCanDriveIcons } from "@/components/icons/vehicleIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoP, RyogoCaption } from "@/components/typography"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User, UserX } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

export default function BookingDriverCard({
  driver,
  withLink,
}: {
  driver: NonNullable<FindBookingDetailsByIdType>["assignedDriver"]
  withLink?: boolean
}) {
  const t = useTranslations("Dashboard.BookingDetails")

  if (!driver) {
    return <EmptyStateIcon icon={UserX} label={t("NoDriverAssigned")} />
  }

  if (withLink) {
    return (
      <Link
        href={`/dashboard/drivers/${driver.id}`}
        className="hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
      >
        <DriverCard driver={driver} />
      </Link>
    )
  }
  return <DriverCard driver={driver} />
}

function DriverCard({
  driver,
}: {
  driver: NonNullable<NonNullable<FindBookingDetailsByIdType>["assignedDriver"]>
}) {
  return (
    <SectionRowWrapper className="p-2 lg:p-3 items-center">
      {driver.user.photoUrl ? (
        <RyogoImage
          src={getFileUrl(driver.user.photoUrl)}
          alt={driver.name}
          imageSize="md"
        />
      ) : (
        <RyogoEnclosedIcon icon={User} size="lg" />
      )}
      <SectionColWrapper small className="w-full">
        <RyogoP weight="font-bold">{driver.name}</RyogoP>
        <RyogoCaption color="slate">{driver.phone}</RyogoCaption>
        <GetCanDriveIcons canDrive={driver.canDriveVehicleTypes} />
      </SectionColWrapper>
    </SectionRowWrapper>
  )
}
