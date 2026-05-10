import { RyogoP, RyogoCaption, RyogoSmall } from "@/components/typography"
import {
  ArrowRightFromLine,
  ArrowRightLeft,
  CalendarDays,
  Users,
  Waypoints,
} from "lucide-react"
import { IconTextTag } from "@/components/tags/IconTextTag"
import { useTranslations } from "next-intl"
import { format } from "date-fns"
import { getDuration } from "@/lib/utils"
import { NewBookingFormDataType } from "@ryogo-travel-app/api/types/booking.types"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { BookingTypeEnum } from "@ryogo-travel-app/db/schema"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

export default function NewBookingTripCard(props: NewBookingFormDataType) {
  const t = useTranslations("Dashboard.NewBooking.Form")
  const duration = getDuration(props.tripStartDate, props.tripEndDate)

  return (
    <div id="tripInfo" className="flex flex-col">
      <div
        id="tripHeader"
        className="flex flex-row bg-white justify-between items-center p-3 lg:p-4 rounded-t-lg"
      >
        <div className="flex flex-col gap-1 lg:gap-1.5">
          <RyogoP weight="font-bold"> {props.tripSourceLocationCity}</RyogoP>
          <RyogoCaption color="light">
            {props.tripSourceLocationState}
          </RyogoCaption>
          <RyogoSmall color="slate">
            {format(props.tripStartDate, "MMM dd")}
          </RyogoSmall>
        </div>
        {props.routeId && (
          <div
            id="tripDistance"
            className="flex flex-row items-center justify-center text-center gap-1.5 lg:gap-2"
          >
            <div className="h-0.5 w-4 lg:w-6 bg-slate-200" />
            <RyogoSmall color="slate">
              {props.selectedDistance + t("Km")}
            </RyogoSmall>
            <div className="h-0.5 w-4 lg:w-6 bg-slate-200" />
          </div>
        )}
        <div
          id="tripDestination"
          className="flex flex-col gap-1 lg:gap-1.5 items-end text-end"
        >
          <RyogoP weight="font-bold">
            {props.tripDestinationLocationCity}
          </RyogoP>
          <RyogoCaption color="light">
            {props.tripDestinationLocationState}
          </RyogoCaption>
          <RyogoSmall color="slate">
            {format(props.tripEndDate, "MMM dd")}
          </RyogoSmall>
        </div>
      </div>
      <div
        id="tripFooter"
        className="bg-slate-200 flex flex-row justify-between gap-2 lg:gap-3 items-end p-2 lg:p-3 rounded-b-lg"
      >
        <TripTagWrapper>
          <SectionRowWrapper small center>
            <RyogoIcon
              icon={
                props.tripType === BookingTypeEnum.OneWay
                  ? ArrowRightFromLine
                  : props.tripType === BookingTypeEnum.Round
                    ? ArrowRightLeft
                    : Waypoints
              }
              size={"sm"}
            />
            <RyogoCaption color="slate">
              {props.tripType.toUpperCase()}
            </RyogoCaption>
          </SectionRowWrapper>
        </TripTagWrapper>
        <TripTagWrapper>
          <IconTextTag icon={Users} text={props.tripPassengers.toString()} />
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
    <div className="flex items-center justify-center px-2 py-1.5 lg:px-3 lg:py-2 border border-slate-300 rounded-lg">
      {children}
    </div>
  )
}
