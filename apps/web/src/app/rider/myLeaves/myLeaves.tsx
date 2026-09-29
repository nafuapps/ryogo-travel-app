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
                driver={driver}
                isRider
              />
            ))}
          </TileGridWrapper>
        ) : (
          <EmptyStateIcon icon={CalendarX} label={t("NoLeaves")} />
        )}
      </SectionWrapper>
      <StickyActionWrapper>
        <HelpIconButton href={"/rider/mySupport/help-leaves"} showLabelSmall />
      </StickyActionWrapper>
    </PageWrapper>
  )
}
