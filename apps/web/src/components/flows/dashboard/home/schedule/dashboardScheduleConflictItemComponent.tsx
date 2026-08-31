import { RyogoImage } from "@/components/images/ryogoImage"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { DashboardLabelImageChip } from "@/components/flows/dashboard/dashboardCommon"
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
  const href = isVehicleRepair
    ? `/dashboard/vehicles/${conflict.entity.id}/repairs`
    : isDriverLeave
      ? `/dashboard/drivers/${conflict.entity.id}/leaves`
      : `/dashboard/bookings/${conflict.secondItem.id}`
  return (
    <div
      className={`flex flex-col gap-2 lg:gap-3 w-full border ${highlight ? "border-sky-200 dark:border-sky-800" : "border-slate-100 dark:border-slate-800"} rounded-lg p-3 lg:p-4`}
    >
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
      <Link
        href={`/dashboard/bookings/${conflict.firstItem.id}`}
        className="flex items-center justify-between p-1.5 lg:p-2 rounded bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        <RyogoCaption color="slate">
          {format(conflict.firstItem.startDate, "dd MMM")}
        </RyogoCaption>
        <RyogoCaption color="slate" weight="font-bold">
          {conflict.firstItem.id}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {format(conflict.firstItem.endDate, "dd MMM")}
        </RyogoCaption>
      </Link>
      <Link
        href={href as Route}
        className="flex items-center justify-between p-1.5 lg:p-2 rounded bg-yellow-50 dark:bg-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-700"
      >
        <RyogoCaption color="slate">
          {format(conflict.secondItem.startDate, "dd MMM")}
        </RyogoCaption>
        <RyogoCaption color="slate" weight="font-bold">
          {conflict.secondItem.id}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {format(conflict.secondItem.endDate, "dd MMM")}
        </RyogoCaption>
      </Link>
    </div>
  )
}
