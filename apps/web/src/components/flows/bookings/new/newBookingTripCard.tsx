import { RyogoP, RyogoCaption, RyogoSmall } from "@/components/typography"
import { CalendarDays, Users } from "lucide-react"
import { IconTextTag } from "@/components/tags/IconTextTag"
import { useTranslations } from "next-intl"
import { format } from "date-fns"
import { NewBookingRequestDataType } from "@ryogo-travel-app/api/types/booking.types"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { BookingTypeEnum } from "@ryogo-travel-app/db/schema"
import { getTripDuration } from "@/lib/utils"
import GetTripTypeIcon from "@/components/icons/tripTypeIcon"

export default function NewBookingTripCard(
  newBooking: NewBookingRequestDataType,
) {
  const t = useTranslations("Dashboard.NewBookingWithCustomer.Form")
  const duration =
    newBooking.tripType === BookingTypeEnum.OneWay
      ? 1
      : newBooking.tripType === BookingTypeEnum.Round
        ? 2
        : getTripDuration(newBooking.tripEndDate, newBooking.tripStartDate)

  return (
    <div id="tripInfo" className="flex flex-col">
      <div
        id="tripHeader"
        className="flex flex-row bg-white dark:bg-slate-900 justify-between items-center p-3 lg:p-4 rounded-t-lg"
      >
        <div className="flex flex-col gap-1 lg:gap-1.5">
          <RyogoP weight="font-bold">
            {newBooking.tripSourceLocationCity}
          </RyogoP>
          <RyogoCaption color="light">
            {newBooking.tripSourceLocationState}
          </RyogoCaption>
          <RyogoSmall color="slate">
            {format(newBooking.tripStartDate, "MMM dd")}
          </RyogoSmall>
        </div>
        {newBooking.routeId && (
          <div
            id="tripDistance"
            className="flex flex-row items-center justify-center text-center gap-1.5 lg:gap-2"
          >
            <div className="h-0.5 w-4 lg:w-6 bg-slate-300 dark:bg-slate-700" />
            <RyogoSmall color="slate">
              {newBooking.selectedDistance + t("Km")}
            </RyogoSmall>
            <div className="h-0.5 w-4 lg:w-6 bg-slate-300 dark:bg-slate-700" />
          </div>
        )}
        <div
          id="tripDestination"
          className="flex flex-col gap-1 lg:gap-1.5 items-end text-end"
        >
          <RyogoP weight="font-bold">
            {newBooking.tripDestinationLocationCity}
          </RyogoP>
          <RyogoCaption color="light">
            {newBooking.tripDestinationLocationState}
          </RyogoCaption>
          <RyogoSmall color="slate">
            {format(newBooking.tripEndDate, "MMM dd")}
          </RyogoSmall>
        </div>
      </div>
      <div
        id="tripFooter"
        className="bg-slate-300 dark:bg-slate-700 flex flex-row justify-between gap-2 lg:gap-3 items-end p-2 lg:p-3 rounded-b-lg"
      >
        <TripTagWrapper>
          <SectionRowWrapper small center>
            <GetTripTypeIcon tripType={newBooking.tripType} size={"sm"} />
            <RyogoCaption color="slate">
              {newBooking.tripType.toUpperCase()}
            </RyogoCaption>
          </SectionRowWrapper>
        </TripTagWrapper>
        <TripTagWrapper>
          <IconTextTag
            icon={Users}
            text={newBooking.tripPassengers.toString()}
          />
        </TripTagWrapper>
        <TripTagWrapper>
          <IconTextTag
            icon={CalendarDays}
            text={duration.toString() + t("Days", { count: duration })}
          />
        </TripTagWrapper>
      </div>
    </div>
  )
}

function TripTagWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center px-2 py-1.5 lg:px-3 lg:py-2 border border-slate-300 dark:border-slate-600 rounded-lg">
      {children}
    </div>
  )
}
