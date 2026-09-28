import { FindAllDriverLeavesByDriverIdType } from "@ryogo-travel-app/api/services/driver.services"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  SectionWrapper,
  PageWrapper,
  TileGridWrapper,
  SectionHeaderWrapper,
  StickyActionWrapper,
  DateWrapper,
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { LeaveStatusPill } from "@/components/pills/ryogoPills"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  ChevronRight,
  CalendarX,
  TreePalm,
  MessageSquareQuote,
} from "lucide-react"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"
import RyogoTag from "@/components/tags/ryogoTag"
import { differenceInDays } from "date-fns"
import RyogoRoundedDashedTag from "@/components/tags/ryogoRoundedDashedTag"

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
      {/* <SectionWrapper  id="LeaveSchedule">
        //TODO: Add leave schedule chart
      </SectionWrapper> */}
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
    <SectionColWrapper className="w-full p-4 lg:p-5 border rounded-md">
      <SectionRowWrapper className="items-center justify-between">
        <DateWrapper date={leave.startDate} hideYear />
        <SectionColWrapper small className="w-full items-center">
          <RyogoRoundedDashedTag
            label={t("Days", {
              days: differenceInDays(leave.endDate, leave.startDate) + 1,
            })}
          />
        </SectionColWrapper>
        <DateWrapper date={leave.endDate} hideYear />
      </SectionRowWrapper>
      {leave.remarks && (
        <RyogoTag label={leave.remarks} icon={MessageSquareQuote} />
      )}
      <LeaveStatusPill
        status={leave.isCompleted ? t("Completed") : t("Pending")}
        completed={leave.isCompleted}
      />
      <SectionRowWrapper className="items-center justify-between">
        <RyogoImageIconTag
          url={leave.addedByUser.photoUrl}
          label={leave.addedByUser.name}
          subtitle={leave.addedByUser.userRole}
        />
        {canModify && (
          <Link
            href={`/dashboard/drivers/${leave.driverId}/leaves/modify/${leave.id}`}
          >
            <RyogoOutlineButton label={t("Edit")}>
              <RyogoIcon icon={ChevronRight} size="sm" />
            </RyogoOutlineButton>
          </Link>
        )}
      </SectionRowWrapper>
    </SectionColWrapper>
  )
}
