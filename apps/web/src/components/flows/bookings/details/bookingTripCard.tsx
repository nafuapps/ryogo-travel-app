import { RyogoP, RyogoCaption } from "@/components/typography"
import { Users } from "lucide-react"
import { IconTextTag } from "@/components/tags/IconTextTag"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { BookingTypeEnum } from "@ryogo-travel-app/db/schema"
import GetTripTypeIcon from "@/components/icons/tripTypeIcon"
import { getTranslations } from "next-intl/server"
import { format } from "date-fns"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"

export default async function BookingTripCard(
  booking: NonNullable<FindBookingDetailsByIdType>,
) {
  const t = await getTranslations("Dashboard.BookingDetails")
  const startDate = booking.actualStartDate ?? booking.startDate
  const endDate = booking.actualEndDate ?? booking.endDate

  return (
    <div id="tripInfo" className="flex flex-col">
      <div className="flex gap-2 lg:gap-3 p-2 lg:p-3 border-x border-t rounded-t-xl rounded-b-md items-center justify-between">
        <SectionColWrapper>
          <RyogoP weight="font-bold">{booking.source.city}</RyogoP>
          <RyogoCaption color="slate">{booking.source.state}</RyogoCaption>
        </SectionColWrapper>
        <div id="distance" className="flex items-center">
          <Line />
          <BorderWrapper>
            <RyogoCaption color="light">
              {booking.citydistance + t("Km")}
            </RyogoCaption>
          </BorderWrapper>
          <Line />
        </div>
        <SectionColWrapper end>
          <RyogoP weight="font-bold">{booking.destination.city}</RyogoP>
          <RyogoCaption color="slate">{booking.destination.state}</RyogoCaption>
        </SectionColWrapper>
      </div>
      <div className="mx-1.5 lg:mx-2 border-t border-dashed h-0" />
      <div className="flex gap-2 lg:gap-3 p-2 lg:p-3 items-center justify-between border-x border-b rounded-b-xl rounded-t-md">
        <DateWrapper date={startDate} />
        <BorderWrapper>
          <GetTripTypeIcon tripType={booking.type} size={"sm"} />
          <RyogoCaption color="slate">
            {booking.type.toUpperCase()}
          </RyogoCaption>
        </BorderWrapper>
        <BorderWrapper>
          <IconTextTag icon={Users} text={booking.passengers.toString()} />
        </BorderWrapper>
        {booking.type !== BookingTypeEnum.OneWay && (
          <DateWrapper date={endDate} />
        )}
      </div>
      {/* <div className="flex gap-2 lg:gap-3 p-2 lg:p-3 items-center justify-between border-x border-b rounded-b-lg bg-slate-100 dark:bg-slate-800">
        
      </div> */}
    </div>
  )
}

function DateWrapper({ date }: { date: Date }) {
  return (
    <div className="rounded-md aspect-square h-14 lg:h-16 bg-slate-100 dark:bg-slate-800 p-2 lg:p-3 flex flex-col items-center justify-center">
      <RyogoCaption color="light">{format(date, "MMM")}</RyogoCaption>
      <RyogoP color="slate" weight="font-bold">
        {format(date, "dd")}
      </RyogoP>
    </div>
  )
}

function BorderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-1 lg:gap-1.5 mx-auto items-center justify-center rounded-full py-0.75 lg:py-1 px-2 lg:px-3 border">
      {children}
    </div>
  )
}

function Line() {
  return <div className="w-3 lg:w-4 h-px bg-slate-100 dark:bg-slate-800" />
}
