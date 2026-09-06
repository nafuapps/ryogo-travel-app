import { RyogoP, RyogoCaption } from "@/components/typography"
import { AirVent, Users } from "lucide-react"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import GetTripTypeIcon from "@/components/icons/tripTypeIcon"
import { getTranslations } from "next-intl/server"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { RyogoPill } from "@/components/pills/ryogoPills"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { BookingDateWrapper } from "./bookingDetailsCommon"

export default async function BookingTripCard({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.BookingDetails")
  const startDate = booking.actualStartDate ?? booking.startDate
  const endDate = booking.actualEndDate ?? booking.endDate

  return (
    <div id="tripInfo" className="flex flex-col">
      <div className="flex gap-2 lg:gap-3 p-3 lg:p-4 border-x border-t rounded-t-xl rounded-b-md items-center justify-between">
        <LocationWrapper
          city={booking.source.city}
          state={booking.source.state}
        />
        <SectionColWrapper center small>
          {/* <GetTripTypeIcon
            tripType={booking.type}
            size="sm"
            color="light"
            thick
          /> */}
          <DistanceWrapper label={booking.citydistance + t("Km")} />
        </SectionColWrapper>
        <LocationWrapper
          end
          city={booking.destination.city}
          state={booking.destination.state}
        />
      </div>
      <div className="mx-1.5 lg:mx-2 border-t border-dashed h-0" />
      <div className="flex gap-2 lg:gap-3 p-3 lg:p-4 items-center justify-between border-x rounded-t-md">
        <BookingDateWrapper date={startDate} />
        <SectionColWrapper center small>
          <RyogoPill bgColor="slate" label={booking.type.toUpperCase()} />
        </SectionColWrapper>
        <BookingDateWrapper date={endDate} />
      </div>
      <div className="flex gap-2 lg:gap-3 p-3 lg:p-4 items-center justify-between border-x border-b rounded-b-lg bg-slate-100 dark:bg-slate-800">
        <SectionRowWrapper small center>
          <RyogoIcon icon={Users} size={"sm"} />
          <RyogoCaption color="light" weight="font-bold">
            {t("Passengers", { pax: booking.passengers })}
          </RyogoCaption>
        </SectionRowWrapper>
        <SectionRowWrapper small center end>
          <RyogoCaption color="light" weight="font-bold">
            {booking.needsAc ? t("Yes") : t("No")}
          </RyogoCaption>
          <RyogoIcon icon={AirVent} size={"sm"} />
        </SectionRowWrapper>
      </div>
    </div>
  )
}

function LocationWrapper({
  city,
  state,
  end = false,
}: {
  city: string
  state: string
  end?: boolean
}) {
  return (
    <SectionColWrapper end={end}>
      <RyogoP weight="font-bold">{city}</RyogoP>
      <RyogoCaption color="slate">{state}</RyogoCaption>
    </SectionColWrapper>
  )
}

function DistanceWrapper({ label }: { label: string }) {
  return (
    <div id="distance" className="flex items-center">
      <div className="w-2 lg:w-3 h-px bg-slate-100 dark:bg-slate-800" />
      <div className="flex items-center justify-center rounded-full py-0.75 lg:py-1 px-2 lg:px-3 border">
        <RyogoCaption color="light" className="text-nowrap">
          {label}{" "}
        </RyogoCaption>
      </div>
      <div className="w-2 lg:w-3 h-px bg-slate-100 dark:bg-slate-800" />
    </div>
  )
}
