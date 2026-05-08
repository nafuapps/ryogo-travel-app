import { FindAllDriverLeavesByDriverIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "@/components/header/detailHeaderTabs/driverDetailHeaderTabs"
import { RyogoP, RyogoCaption } from "@/components/typography"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  SectionWrapper,
  GridItemWrapper,
  PageWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

//TODO: User can mark driver has gone on leave

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
    <PageWrapper id="DriverLeavesPage">
      <DriverDetailHeaderTabs selectedTab={"Leaves"} id={driverId} />
      <SectionWrapper id="DriverLeavesList">
        <Link
          href={`/dashboard/drivers/${driverId}/leaves/new`}
          className="md:w-1/2 w-full self-center"
        >
          <Button variant={"outline"} className="w-full">
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
      </SectionWrapper>
    </PageWrapper>
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

  const canModify = isOwner || userId === leave.addedByUserId
  return (
    <div className="grid border border-slate-100 rounded-lg grid-cols-2 grid-rows-2 sm:grid-cols-4 sm:grid-rows-1 gap-3 lg:gap-4 p-3 lg:p-4">
      <GridItemWrapper>
        <RyogoP weight="font-bold">
          {moment(leave.startDate).format("DD MMM") +
            " - " +
            moment(leave.endDate).format("DD MMM")}
        </RyogoP>
      </GridItemWrapper>
      <GridItemWrapper>
        <RyogoCaption color="slate">{leave.addedByUser.name}</RyogoCaption>
        <RyogoCaption color="light">{leave.remarks}</RyogoCaption>
      </GridItemWrapper>
      <GridItemWrapper>
        {leave.isCompleted ? (
          <div className="flex py-2 px-3 lg:py-3 lg:px-4 rounded-full bg-slate-100">
            <RyogoCaption color="light">{t("Completed")}</RyogoCaption>
          </div>
        ) : (
          <div className="flex py-2 px-3 lg:py-3 lg:px-4 rounded-full bg-amber-100">
            <RyogoCaption color="light">{t("Pending")}</RyogoCaption>
          </div>
        )}
      </GridItemWrapper>
      <GridItemWrapper>
        {canModify && (
          <Link
            href={`/dashboard/drivers/${leave.driverId}/leaves/modify/${leave.id}`}
          >
            <div className="flex p-3 lg:pl-4 lg:gap-1 rounded-lg bg-slate-200 justify-center items-center hover:bg-slate-300 lg:cursor-pointer transition">
              <div className="hidden lg:flex">
                <RyogoCaption color="light">{t("Edit")}</RyogoCaption>
              </div>
              <RyogoIcon icon={Pencil} size="sm" />
            </div>
          </Link>
        )}
      </GridItemWrapper>
    </div>
  )
}
