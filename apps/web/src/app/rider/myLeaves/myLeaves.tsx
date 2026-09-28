import FinishDriverLeaveAlertButton from "@/components/buttons/alert/finishDriverLeaveAlertButton"
import TakeDriverLeaveAlertButton from "@/components/buttons/alert/takeDriverLeaveAlertButton"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import DriverLeaveComponent from "@/components/flows/drivers/leaves/driverLeaveComponent"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import {
  PageWrapper,
  SectionWrapper,
  SectionHeaderWrapper,
  TileGridWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import {
  FindAllDriverLeavesByDriverIdType,
  FindDriverByUserIdType,
} from "@ryogo-travel-app/api/services/driver.services"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import { differenceInDays } from "date-fns"
import { TreePalm, CalendarX } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function MyLeavesPageComponent({
  leaves,
  driver,
}: {
  leaves: FindAllDriverLeavesByDriverIdType
  driver: NonNullable<FindDriverByUserIdType>
}) {
  const t = await getTranslations("Rider.MyLeaves")
  const today = new Date()

  const isOnLeave = driver.status === DriverStatusEnum.LEAVE
  const isAvailable = driver.status === DriverStatusEnum.AVAILABLE
  const isOnTrip = driver.status === DriverStatusEnum.ON_TRIP

  const currentLeave = leaves.find(
    (leave) =>
      differenceInDays(today, leave.startDate) >= 0 &&
      differenceInDays(today, leave.endDate) <= 0 &&
      !leave.isCompleted,
  )

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
              <DriverLeaveComponent key={leave.id} leave={leave} />
            ))}
          </TileGridWrapper>
        ) : (
          <EmptyStateIcon icon={CalendarX} label={t("NoLeaves")} />
        )}
      </SectionWrapper>
      <StickyActionWrapper>
        {currentLeave && isOnTrip && (
          <RyogoOutlineButton label={t("OnTrip")} disabled />
        )}
        {currentLeave && isAvailable && (
          <TakeDriverLeaveAlertButton
            userId={driver.userId}
            driverId={driver.id}
            leaveId={currentLeave.id}
            agencyId={driver.agencyId}
          />
        )}
        {currentLeave && isOnLeave && (
          <FinishDriverLeaveAlertButton
            userId={driver.userId}
            driverId={driver.id}
            leaveId={currentLeave.id}
            agencyId={driver.agencyId}
          />
        )}
        <HelpIconButton href={"/rider/mySupport/help-leaves"} showLabelSmall />
      </StickyActionWrapper>
    </PageWrapper>
  )
}
