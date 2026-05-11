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

export default function CompletedBookingsItemComponent({
  completedBookings7Days,
}: {
  completedBookings7Days: FindCompletedBookingsPreviousDaysType
}) {
  const t = useTranslations("Dashboard.Bookings.Completed")
  const [selectedTab, setSelectedTab] = useState("24hrs")

  const completedBookings24Hrs = completedBookings7Days.filter(
    (b) => b.updatedAt > new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  )

  const trips =
    selectedTab === "24hrs" ? completedBookings24Hrs : completedBookings7Days

  return (
    <SectionWrapper id="CompletedBookingsSection">
      <SectionRowWrapper center>
        <SectionHeaderWrapper>
          <RyogoIcon icon={CheckCheck} size="sm" />
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
        <CompletedBookingCard key={trip.bookingId} booking={trip} />
      ))}
    </SectionWrapper>
  )
}
