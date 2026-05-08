"use client"

import {
  RyogoSmall,
  RyogoH4,
  RyogoP,
  RyogoCaption,
} from "@/components/typography"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { CheckCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState } from "react"
import moment from "moment"
import { FindCompletedBookingsPreviousDaysType } from "@ryogo-travel-app/api/services/booking.services"
import {
  GridItemWrapper,
  GridWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

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
      <div
        id="CompletedBookingsHeader"
        className="flex flex-row justify-between items-center"
      >
        <SectionHeaderWrapper>
          <RyogoIcon icon={CheckCheck} size="sm" />
          <RyogoSmall color="slate">{t("Title")}</RyogoSmall>
          <RyogoH4 color="slate"> {trips.length}</RyogoH4>
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
      </div>
      {trips.map((trip) => (
        <CompletedComponent key={trip.bookingId} {...trip} />
      ))}
    </SectionWrapper>
  )
}

function CompletedComponent(
  props: FindCompletedBookingsPreviousDaysType[number],
) {
  return (
    <Link href={`/dashboard/bookings/${props.bookingId}`}>
      <GridWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{props.bookingId}</RyogoCaption>
          <RyogoP weight="font-bold"> {props.customerName}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{props.type.toUpperCase()}</RyogoCaption>
          <RyogoP weight="font-bold"> {props.route}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{props.vehicle}</RyogoCaption>
          <RyogoP weight="font-bold"> {props.driver}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {format(props.updatedAt, "PP")}
          </RyogoCaption>
          <RyogoP weight="font-bold">
            {moment(props.updatedAt).fromNow()}
          </RyogoP>
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}
