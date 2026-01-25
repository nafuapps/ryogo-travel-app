import { pageClassName } from "@/components/page/pageCommons"
import { FindAllDriverLeavesByDriverIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "../driverDetailHeaderTabs"
import { gridItemClassName } from "@/app/dashboard/components/pageCommons"
import { PBold, Caption, CaptionGrey } from "@/components/typography"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { UrlObject } from "url"
import { LucidePencil } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AllDriverLeavesPageComponent({
  leaves,
  driverId,
  userId,
  isOwner,
}: {
  leaves: FindAllDriverLeavesByDriverIdType
  driverId: string
  userId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.DriverLeaves")
  return (
    <div id="DriverLeavesPage" className={pageClassName}>
      <DriverDetailHeaderTabs selectedTab={"Leaves"} id={driverId} />
      <div
        id="DriverLeavesList"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <Link
          href={`/dashboard/drivers/${driverId}/leaves/new`}
          className="min-w-1/2 self-center"
        >
          <Button variant={"default"} className="w-full">
            {t("AddLeave")}
          </Button>
        </Link>
        {leaves.map((leave) => (
          <DriverLeaveComponent
            key={leave.id}
            leave={leave}
            isOwner={isOwner}
            userId={userId}
          />
        ))}
      </div>
    </div>
  )
}

async function DriverLeaveComponent({
  leave,
  userId,
  isOwner,
}: {
  leave: FindAllDriverLeavesByDriverIdType[number]
  userId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.DriverLeaves")

  const canModify = isOwner || userId == leave.addedByUserId
  return (
    <div className="grid border border-slate-100 rounded-lg grid-cols-2 grid-rows-2 sm:grid-cols-4 sm:grid-rows-1 gap-3 lg:gap-4 p-3 lg:p-4">
      <div className={gridItemClassName}>
        <PBold>
          {moment(leave.startDate).format("DD MMM") +
            " - " +
            moment(leave.endDate).format("DD MMM")}
        </PBold>
      </div>
      <div className={gridItemClassName}>
        <Caption>{leave.addedByUser.name}</Caption>
        <CaptionGrey>{leave.remarks}</CaptionGrey>
      </div>
      <div className={gridItemClassName}>
        {leave.isCompleted ? (
          <div className="flex py-2 px-3 lg:py-3 lg:px-4 rounded-full bg-slate-100">
            <CaptionGrey>{t("Completed")}</CaptionGrey>
          </div>
        ) : (
          <div className="flex py-2 px-3 lg:py-3 lg:px-4 rounded-full bg-amber-100">
            <CaptionGrey>{t("Pending")}</CaptionGrey>
          </div>
        )}
      </div>
      <div className={gridItemClassName}>
        {canModify && (
          <Link
            href={
              `/dashboard/drivers/${leave.driverId}/leaves/modify/${leave.id}` as unknown as UrlObject
            }
          >
            <div className="flex p-3 lg:pl-4 lg:gap-1 rounded-lg bg-slate-200 justify-center items-center hover:bg-slate-300 lg:cursor-pointer transition">
              <div className="hidden lg:flex">
                <CaptionGrey>{t("Edit")}</CaptionGrey>
              </div>
              <LucidePencil className="size-4 lg:size-5 text-slate-500" />
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
