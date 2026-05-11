"use client"

import { RyogoSmall, RyogoP } from "@/components/typography"
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

export default function UpcomingBookingsItemComponent({
  upcomingBookings7Days,
}: {
  upcomingBookings7Days: FindUpcomingBookingsNextDaysType
}) {
  const t = useTranslations("Dashboard.Bookings.Upcoming")
  const [selectedTab, setSelectedTab] = useState("24hrs")

  const upcomingBookings24Hrs = upcomingBookings7Days.filter(
    (b) =>
      new Date(b.startDate) <
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  )

  const trips =
    selectedTab === "24hrs" ? upcomingBookings24Hrs : upcomingBookings7Days

  return (
    <SectionWrapper id="UpcomingBookingsSection">
      <SectionRowWrapper center>
        <SectionHeaderWrapper>
          <RyogoIcon icon={Clock} size="sm" />
          <RyogoSmall color="slate">{t("Title")}</RyogoSmall>
          <RyogoP color="slate"> {trips.length}</RyogoP>
        </SectionHeaderWrapper>
        <Select
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="24hrs">{t("24Hrs")}</SelectItem>
              <SelectItem value="7days">{t("7Days")}</SelectItem>
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
