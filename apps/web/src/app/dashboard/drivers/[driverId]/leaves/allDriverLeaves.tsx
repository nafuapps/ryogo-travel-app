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
  AddInfoWrapper,
  TileGridWrapper,
  SectionHeaderWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { LeaveStatusPill } from "@/components/pills/ryogoPills"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { ChevronRight, CalendarX, Plus, TreePalm } from "lucide-react"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"

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
        <SectionHeaderWrapper
          icon={TreePalm}
          label={t("Title")}
          count={leaves.length}
        />
        {leaves.length > 0 ? (
          <TileGridWrapper>
            {leaves.map((leave) => (
              <DriverLeaveComponent
                key={leave.id}
                leave={leave}
                isOwner={isOwner}
                userId={userId}
              />
            ))}
          </TileGridWrapper>
        ) : (
          <EmptyStateIcon icon={CalendarX} label={t("NoLeaves")} />
        )}
      </SectionWrapper>
      <StickyActionWrapper>
        <Link
          href={`/dashboard/drivers/${driverId}/leaves/new`}
          className="w-full"
        >
          <RyogoDefaultButton
            label={t("AddLeave")}
            size="lg"
            className="w-full"
          />
        </Link>
        <HelpIconButton
          href={"/dashboard/support/help-drivers#leaves"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}

//TODO:Revamp UI
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
