import { FindAllDriverLeavesByDriverIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "@/components/header/detailHeaderTabs/driverDetailHeaderTabs"
import { RyogoP, RyogoCaption } from "@/components/typography"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  SectionWrapper,
  GridItemWrapper,
  PageWrapper,
  GridWrapper,
} from "@/components/page/pageWrappers"
import { LeaveStatusPill } from "@/components/statusPills/statusPills"
import { RyogoIconButton } from "@/components/buttons/ryogoButtons"

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
    <GridWrapper>
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
        <LeaveStatusPill
          status={leave.isCompleted ? t("Completed") : t("Pending")}
          completed={leave.isCompleted}
        />
      </GridItemWrapper>
      <GridItemWrapper>
        {canModify && (
          <Link
            href={`/dashboard/drivers/${leave.driverId}/leaves/modify/${leave.id}`}
          >
            <RyogoIconButton label={t("Edit")} />
          </Link>
        )}
      </GridItemWrapper>
    </GridWrapper>
  )
}
