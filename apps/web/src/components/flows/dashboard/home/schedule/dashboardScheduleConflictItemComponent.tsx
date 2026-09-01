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

  const firstHref = `/dashboard/bookings/${conflict.firstItem.id}`
  const secondHref = isVehicleRepair
    ? `/dashboard/vehicles/${conflict.entity.id}/repairs`
    : isDriverLeave
      ? `/dashboard/drivers/${conflict.entity.id}/leaves`
      : `/dashboard/bookings/${conflict.secondItem.id}`
  return (
    <div
      className={`flex flex-col gap-2 lg:gap-3 w-full border ${highlight ? "border-sky-300 dark:border-sky-700" : "border-slate-100 dark:border-slate-800"} rounded-lg p-3 lg:p-4`}
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
    </div>
  )
}

function ConflictItemRow(props: {
  startDate: Date
  endDate: Date
  id: string
  href: string
  highlight?: boolean
}) {
  return (
    <Link
      href={props.href as Route}
      className={`flex items-center justify-between p-1.5 lg:p-2 rounded-md ${props.highlight ? "bg-yellow-50 dark:bg-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-700" : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
    >
      <RyogoCaption color="slate">
        {format(props.startDate, "dd MMM")}
      </RyogoCaption>
      <RyogoCaption color="slate" weight="font-bold">
        {props.id}
      </RyogoCaption>
      <RyogoCaption color="slate">
        {format(props.endDate, "dd MMM")}
      </RyogoCaption>
    </Link>
  )
}
