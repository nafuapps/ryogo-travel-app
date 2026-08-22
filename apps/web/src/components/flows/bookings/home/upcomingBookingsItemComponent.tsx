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
import { Clock } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { FindUpcomingBookingsNextDaysType } from "@ryogo-travel-app/api/services/booking.services"
import {
  SectionHeaderWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { UpcomingBookingCard } from "@/components/cards/booking/bookingCards"

type UpcominBookingsSelectType = "7Days" | "14Days"

export default function UpcomingBookingsItemComponent({
  upcomingBookings14Days,
}: {
  upcomingBookings14Days: FindUpcomingBookingsNextDaysType
}) {
  const t = useTranslations("Dashboard.Bookings.Upcoming")
  const [selectedTab, setSelectedTab] =
    useState<UpcominBookingsSelectType>("7Days")

  const upcomingBookings7Days = upcomingBookings14Days.filter(
    (b) =>
      new Date(b.startDate) <
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 7),
  )

  const trips =
    selectedTab === "7Days" ? upcomingBookings7Days : upcomingBookings14Days

  return (
    <SectionWrapper id="UpcomingBookingsSection">
      <SectionRowWrapper center>
        <SectionHeaderWrapper>
          <RyogoIcon icon={Clock} size="sm" color="light" />
          <RyogoSmall color="light">{t("Title")}</RyogoSmall>
          <RyogoSmall color="light" weight="font-bold">
            {trips.length}
          </RyogoSmall>
        </SectionHeaderWrapper>
        <Select
          value={selectedTab}
          onValueChange={(value: UpcominBookingsSelectType) =>
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
        <UpcomingBookingCard key={trip.bookingId} booking={trip} />
      ))}
    </SectionWrapper>
  )
}
