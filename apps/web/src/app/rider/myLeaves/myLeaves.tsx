"use client"

import DriverLeaveComponent from "@/components/flows/drivers/leaves/driverLeaveComponent"
import DriverLeavesFilterSelect from "@/components/flows/drivers/leaves/driverLeavesFilter"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import {
  PageWrapper,
  SectionWrapper,
  SectionHeaderWrapper,
  TileGridWrapper,
  StickyActionWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import {
  FindAllDriverLeavesByDriverIdType,
  FindDriverByUserIdType,
} from "@ryogo-travel-app/api/services/driver.services"
import { DriverLeaveStatusEnum } from "@ryogo-travel-app/db/schema"
import { TreePalm, CalendarX } from "lucide-react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"

export default function MyLeavesPageComponent({
  leaves,
  driver,
}: {
  leaves: FindAllDriverLeavesByDriverIdType
  driver: NonNullable<FindDriverByUserIdType>
}) {
  const t = useTranslations("Dashboard.DriverLeaves")

  const searchParams = useSearchParams()
  const status = searchParams.get("status") as DriverLeaveStatusEnum

  const filteredLeaves = status
    ? leaves.filter((leave) => leave.status === status)
    : leaves

  return (
    <PageWrapper id="DriverLeavesPage">
      <SectionWrapper id="DriverLeavesList">
        <SectionRowWrapper className="items-center justify-between">
          <SectionHeaderWrapper
            icon={TreePalm}
            label={t("Title")}
            count={filteredLeaves.length}
          />
          <DriverLeavesFilterSelect />
        </SectionRowWrapper>
        {filteredLeaves.length > 0 ? (
          <TileGridWrapper>
            {filteredLeaves.map((leave) => (
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
