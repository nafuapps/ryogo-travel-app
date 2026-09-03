"use client"

import { RyogoSmall, RyogoP, RyogoCaption } from "@/components/typography"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BookOpenText } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState } from "react"
import moment from "moment"
import { FindCancelledBookingsPreviousDaysType } from "@ryogo-travel-app/api/services/booking.services"
import {
  GridItemWrapper,
  HoverGridWrapper,
  SectionHeaderWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { differenceInDays } from "date-fns"

type CancelledBookingsSelectType = "14Days" | "7Days"

export default function CancelledBookingsComponent({
  cancelledBookings14Days,
}: {
  cancelledBookings14Days: FindCancelledBookingsPreviousDaysType
}) {
  const t = useTranslations("Dashboard.Bookings.Cancelled")
  const [selectedTab, setSelectedTab] =
    useState<CancelledBookingsSelectType>("7Days")

  const cancelledBookings7Days = cancelledBookings14Days.filter(
    (b) => differenceInDays(new Date(), b.updatedAt) < 7,
  )

  const trips =
    selectedTab === "14Days" ? cancelledBookings14Days : cancelledBookings7Days

  return (
    <SectionWrapper id="cancelledBookingsSection">
      <SectionRowWrapper center>
        <SectionHeaderWrapper>
          <RyogoIcon icon={BookOpenText} size="sm" color="light" />
          <RyogoSmall color="light">{t("Title")}</RyogoSmall>
          <RyogoSmall color="light" weight="font-bold">
            {trips.length}
          </RyogoSmall>
        </SectionHeaderWrapper>
        <Select
          value={selectedTab}
          onValueChange={(value: CancelledBookingsSelectType) =>
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
        <CancelledBookingItemComponent key={trip.bookingId} {...trip} />
      ))}
    </SectionWrapper>
  )
}

function CancelledBookingItemComponent(
  cancelled: FindCancelledBookingsPreviousDaysType[number],
) {
  const t = useTranslations("Dashboard.Bookings.Cancelled")
  return (
    <Link href={`/dashboard/bookings/${cancelled.bookingId}`}>
      <HoverGridWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{cancelled.bookingId}</RyogoCaption>
          <RyogoP weight="font-bold"> {cancelled.customerName}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {cancelled.type.toUpperCase()}
          </RyogoCaption>
          <RyogoP weight="font-bold"> {cancelled.route}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {cancelled.amount.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            })}
          </RyogoCaption>
          <RyogoP weight="font-bold"> {cancelled.assignedUser}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          {cancelled.remarks && (
            <RyogoCaption color="slate">{cancelled.remarks}</RyogoCaption>
          )}
          <RyogoP weight="font-bold">
            {moment(cancelled.updatedAt).fromNow()}
          </RyogoP>
        </GridItemWrapper>
      </HoverGridWrapper>
    </Link>
  )
}
