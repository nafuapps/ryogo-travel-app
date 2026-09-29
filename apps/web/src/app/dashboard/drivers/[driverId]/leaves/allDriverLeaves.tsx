"use client"

import {
  FindAllDriverLeavesByDriverIdType,
  FindDriverDetailsByIdType,
} from "@ryogo-travel-app/api/services/driver.services"
import { useTranslations } from "next-intl"
import Link from "next/link"
import {
  SectionWrapper,
  PageWrapper,
  TileGridWrapper,
  SectionHeaderWrapper,
  StickyActionWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { CalendarX, TreePalm } from "lucide-react"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import DriverLeaveComponent from "@/components/flows/drivers/leaves/driverLeaveComponent"
import DriverLeavesFilterSelect from "@/components/flows/drivers/leaves/driverLeavesFilter"
import { useSearchParams } from "next/navigation"
import { DriverLeaveStatusEnum } from "@ryogo-travel-app/db/schema"

export default function AllDriverLeavesPageComponent({
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
