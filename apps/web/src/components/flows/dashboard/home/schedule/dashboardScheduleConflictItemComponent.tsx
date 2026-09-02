import { RyogoImage } from "@/components/images/ryogoImage"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import {
  DashboardBoxItemWrapper,
  DashboardLabelImageChip,
} from "@/components/flows/dashboard/dashboardCommon"
import Link from "next/link"
import { RyogoCaption } from "@/components/typography"
import { format } from "date-fns"
import { DriverLeaveIdRegex, VehicleRepairIdRegex } from "@/lib/regex"
import { Route } from "next"

export type DashboardScheduleConflictItemType = {
  entity: {
    id?: string
    label?: string
    photoUrl?: string | null
  }
  firstItem: {
    id: string
    startDate: Date
    endDate: Date
    userId: string
  }
  secondItem: {
    id: string
    startDate: Date
    endDate: Date
    userId: string
  }
}

export default function DashboardScheduleConflictItemComponent({
  conflict,
  highlight,
}: {
  conflict: DashboardScheduleConflictItemType
  highlight?: boolean
}) {
  const isVehicleRepair = VehicleRepairIdRegex.safeParse(
    conflict.secondItem.id,
  ).success
  const isDriverLeave = DriverLeaveIdRegex.safeParse(
    conflict.secondItem.id,
  ).success

  const firstHref = `/dashboard/bookings/${conflict.firstItem.id}`
  const secondHref = isVehicleRepair
    ? `/dashboard/vehicles/${conflict.entity.id}/repairs`
    : isDriverLeave
      ? `/dashboard/drivers/${conflict.entity.id}/leaves`
      : `/dashboard/bookings/${conflict.secondItem.id}`
  return (
    <DashboardBoxItemWrapper highlight={highlight}>
      <SectionRowWrapper center>
        {conflict.entity.label && (
          <DashboardLabelImageChip label={conflict.entity.label}>
            {conflict.entity.photoUrl && (
              <RyogoImage
                src={getFileUrl(conflict.entity.photoUrl)}
                alt={conflict.entity.label}
                imageSize="xs"
              />
            )}
          </DashboardLabelImageChip>
        )}
      </SectionRowWrapper>
      <ConflictItemRow
        startDate={conflict.firstItem.startDate}
        endDate={conflict.firstItem.endDate}
        id={conflict.firstItem.id}
        href={firstHref}
      />
      <ConflictItemRow
        startDate={conflict.secondItem.startDate}
        endDate={conflict.secondItem.endDate}
        id={conflict.secondItem.id}
        href={secondHref}
        highlight
      />
    </DashboardBoxItemWrapper>
  )
}

function ConflictItemRow({
  startDate,
  endDate,
  id,
  href,
  highlight,
}: {
  startDate: Date
  endDate: Date
  id: string
  href: string
  highlight?: boolean
}) {
  return (
    <Link
      href={href as Route}
      className={`flex items-center justify-between p-1.5 lg:p-2 rounded-md ${highlight ? "bg-yellow-200 dark:bg-yellow-800 hover:bg-yellow-300 dark:hover:bg-yellow-700" : "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"}`}
    >
      <RyogoCaption color="slate">{format(startDate, "dd MMM")}</RyogoCaption>
      <RyogoCaption color="slate" weight="font-bold">
        {id}
      </RyogoCaption>
      <RyogoCaption color="slate">{format(endDate, "dd MMM")}</RyogoCaption>
    </Link>
  )
}
