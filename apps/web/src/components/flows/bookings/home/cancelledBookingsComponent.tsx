"use client"

import { RyogoSmall, RyogoP, RyogoCaption } from "@/components/typography"
import { BookX } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"

export default function CancelledBookingsComponent({
  cancelledBookings,
  userId,
}: {
  userId: string
  cancelledBookings: FindCancelledBookingsPreviousDaysType
}) {
  const t = useTranslations("Dashboard.Bookings.Cancelled")
  const [showAgencyBookings, setShowAgencyBookings] = useState(false)

  const trips = showAgencyBookings
    ? cancelledBookings
    : cancelledBookings.filter((b) => b.assignedUser.id === userId)

  return (
    <SectionWrapper id="cancelledBookingsSection">
      <SectionRowWrapper className="items-center">
        <SectionHeaderWrapper>
          <RyogoIcon icon={BookX} size="sm" color="light" />
          <RyogoSmall color="light">{t("Title")}</RyogoSmall>
          <RyogoSmall color="light" weight="font-bold">
            {trips.length}
          </RyogoSmall>
        </SectionHeaderWrapper>
        <SectionRowWrapper className="items-center justify-end">
          <RyogoCaption color="light">{t("ShowAgencyCancelled")}</RyogoCaption>
          <Switch
            checked={showAgencyBookings}
            onCheckedChange={setShowAgencyBookings}
          />
        </SectionRowWrapper>
      </SectionRowWrapper>
      {trips.map((trip) => (
        <CancelledBookingItemComponent key={trip.id} {...trip} />
      ))}
    </SectionWrapper>
  )
}

function CancelledBookingItemComponent(
  cancelled: FindCancelledBookingsPreviousDaysType[number],
) {
  const t = useTranslations("Dashboard.Bookings.Cancelled")
  return (
    <Link href={`/dashboard/bookings/${cancelled.id}`}>
      <HoverGridWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{cancelled.id}</RyogoCaption>
          <RyogoP weight="font-bold"> {cancelled.customer.name}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {cancelled.type.toUpperCase()}
          </RyogoCaption>
          <RyogoP weight="font-bold">
            {" "}
            {cancelled.source.city + " - " + cancelled.destination.city}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {cancelled.estimatedTotalAmount.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            })}
          </RyogoCaption>
          <RyogoP weight="font-bold"> {cancelled.assignedUser.name}</RyogoP>
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
