import {
  FindAllDriverLeavesByDriverIdType,
  FindDriverDetailsByIdType,
} from "@ryogo-travel-app/api/services/driver.services"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  SectionWrapper,
  PageWrapper,
  TileGridWrapper,
  SectionHeaderWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { CalendarX, TreePalm } from "lucide-react"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import DriverLeaveComponent from "@/components/flows/drivers/leaves/driverLeaveComponent"

export default async function AllDriverLeavesPageComponent({
  leaves,
  driver,
  currentUserId,
  isOwner,
}: {
  leaves: FindAllDriverLeavesByDriverIdType
  driver: NonNullable<FindDriverDetailsByIdType>
  currentUserId: string
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
                canModify={isOwner || currentUserId === leave.addedByUserId}
                driver={driver}
              />
            ))}
          </TileGridWrapper>
        ) : (
          <EmptyStateIcon icon={CalendarX} label={t("NoLeaves")} />
        )}
      </SectionWrapper>
      <StickyActionWrapper>
        <Link
          href={`/dashboard/drivers/${driver.id}/leaves/new`}
          className="w-full"
        >
          <RyogoDefaultButton label={t("AddLeave")} className="w-full" />
        </Link>
        <HelpIconButton
          href={"/dashboard/support/help-drivers#leaves"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}
