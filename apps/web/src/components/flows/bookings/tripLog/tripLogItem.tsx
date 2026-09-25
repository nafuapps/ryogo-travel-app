"use client"

import { RyogoSmall, RyogoTiny } from "@/components/typography"
import { format } from "date-fns"
import { FindBookingTripLogsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { useTranslations } from "next-intl"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import getTripLogIcon from "@/components/icons/tripLogIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import { GoogleMapsEmbedPlaceComponent } from "@/components/maps/googleMapsEmbed"
import { ChevronDown, ChevronUp, MessageSquareQuote } from "lucide-react"
import { RyogoDialogImage } from "@/components/images/ryogoImage"
import { useState } from "react"

export default function TripLogItem({
  tripLog,
}: {
  tripLog: NonNullable<FindBookingTripLogsByIdType>[0]
}) {
  const t = useTranslations("Dashboard.BookingTripLogs")
  const [open, setOpen] = useState(false)

  const isEnded = tripLog.type === TripLogTypesEnum.ENDED

  return (
    <SectionWrapper id={tripLog.id}>
      <SectionRowWrapper className="items-center">
        <RyogoEnclosedIcon
          icon={getTripLogIcon(tripLog.type)}
          size="md"
          color={isEnded ? "white" : "slate"}
          bgColor={isEnded ? "black" : "light"}
        />
        <SectionRowWrapper className="items-center w-full justify-between">
          <SectionColWrapper small>
            <SectionRowWrapper small className="items-center">
              <RyogoSmall color="slate" weight="font-bold">
                {tripLog.type}
              </RyogoSmall>
              {tripLog.odometerReading && (
                <RyogoSmall color="light">
                  {t("Km", { km: tripLog.odometerReading })}
                </RyogoSmall>
              )}
            </SectionRowWrapper>
            <RyogoTiny color="light">
              {format(tripLog.createdAt, "dd MMM - hh:mm aaa")}
            </RyogoTiny>
          </SectionColWrapper>
          <SectionColWrapper small className="items-end">
            {tripLog.remarks && (
              <SectionRowWrapper
                small
                className="items-center rounded bg-slate-100 dark:bg-slate-700 px-2 lg:px-3 py-1 lg:py-1.5"
              >
                <RyogoTiny color="light">{tripLog.remarks}</RyogoTiny>
                <RyogoIcon size="xs" icon={MessageSquareQuote} color="light" />
              </SectionRowWrapper>
            )}
          </SectionColWrapper>
        </SectionRowWrapper>
        {tripLog.tripLogPhotoUrl && (
          <RyogoDialogImage
            src={getFileUrl(tripLog.tripLogPhotoUrl)}
            alt={tripLog.type}
            imageSize="sm"
          />
        )}
        {tripLog.latLong && (
          <RyogoIcon
            onClick={() => setOpen(!open)}
            size="sm"
            icon={open ? ChevronUp : ChevronDown}
            color="light"
            thick
          />
        )}
      </SectionRowWrapper>
      {tripLog.latLong && (
        <GoogleMapsEmbedPlaceComponent
          latLong={tripLog.latLong}
          time={tripLog.createdAt}
          className={open ? "" : "hidden"}
        />
      )}
    </SectionWrapper>
  )
}
