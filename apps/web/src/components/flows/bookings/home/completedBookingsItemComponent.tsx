"use client"

import { RyogoSmall } from "@/components/typography"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { FindCompletedBookingsPreviousDaysType } from "@ryogo-travel-app/api/services/booking.services"
import {
  SectionHeaderWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { CompletedBookingCard } from "@/components/cards/booking/bookingCards"
import { differenceInDays } from "date-fns"

type CompletedBookingsSelectType = "7Days" | "14Days"

export default function CompletedBookingsItemComponent({
  completedBookings14Days,
}: {
  completedBookings14Days: FindCompletedBookingsPreviousDaysType
}) {
  const t = useTranslations("Dashboard.Bookings.Completed")
  const [selectedTab, setSelectedTab] =
    useState<CompletedBookingsSelectType>("7Days")

  const completedBookings7Days = completedBookings14Days.filter(
    (b) => differenceInDays(new Date(), b.updatedAt) < 7,
  )

  const trips =
    selectedTab === "7Days" ? completedBookings7Days : completedBookings14Days

  return (
    <SectionWrapper id="CompletedBookingsSection">
      <SectionRowWrapper center>
        <SectionHeaderWrapper>
          <RyogoIcon icon={CheckCheck} size="sm" color="light" />
          <RyogoSmall color="light">{t("Title")}</RyogoSmall>
          <RyogoSmall color="light" weight="font-bold">
            {trips.length}
          </RyogoSmall>
        </SectionHeaderWrapper>
        <Select
          value={selectedTab}
          onValueChange={(value: CompletedBookingsSelectType) =>
            setSelectedTab(value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="7Days">{t("7Days")}</SelectItem>
              <SelectItem value="14Days">{t("14Days")}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </SectionRowWrapper>
      {trips.map((trip) => (
        <CompletedBookingCard key={trip.bookingId} booking={trip} />
      ))}
    </SectionWrapper>
  )
}
