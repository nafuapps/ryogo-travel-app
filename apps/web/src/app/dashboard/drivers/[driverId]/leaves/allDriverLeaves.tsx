import { FindAllDriverLeavesByDriverIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "@/components/header/detailHeaderTabs/driverDetailHeaderTabs"
import { RyogoP, RyogoCaption } from "@/components/typography"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  SectionWrapper,
  GridItemWrapper,
  PageWrapper,
  PlainGridWrapper,
} from "@/components/page/pageWrappers"
import { LeaveStatusPill } from "@/components/pills/ryogoPills"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { ChevronRight, Plus } from "lucide-react"

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
          <RyogoOutlineButton
            variant={"outline"}
            className="w-full"
            label={t("AddLeave")}
          >
            <RyogoIcon icon={Plus} size="sm" />
          </RyogoOutlineButton>
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
    <PlainGridWrapper>
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
            <RyogoOutlineButton label={t("Edit")}>
              <RyogoIcon icon={ChevronRight} size="sm" />
            </RyogoOutlineButton>
          </Link>
        )}
      </GridItemWrapper>
    </PlainGridWrapper>
  )
}
