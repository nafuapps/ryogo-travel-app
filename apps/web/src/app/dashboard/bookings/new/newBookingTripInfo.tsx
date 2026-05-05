import { PBold, CaptionGrey, SmallGrey, Caption } from "@/components/typography"
import { CalendarDays, Users } from "lucide-react"
import { NewBookingFormDataType } from "./newBookingCommon"
import { IconTextTag } from "@/components/tags/IconTextTag"
import { useTranslations } from "next-intl"
import { format } from "date-fns"
import { getDuration } from "@/lib/utils"
import getTripIcon from "@/components/icons/tripIcon"

export default function NewBookingTripInfo(props: NewBookingFormDataType) {
  const t = useTranslations("Dashboard.NewBooking.Form")
  const duration = getDuration(props.tripStartDate, props.tripEndDate)

  return (
    <div id="tripInfo" className="flex flex-col">
      <div
        id="tripHeader"
        className="flex flex-row bg-white justify-between items-center p-3 lg:p-4 rounded-t-lg"
      >
        <div className="flex flex-col gap-1 lg:gap-1.5 items-start">
          <PBold>{props.tripSourceLocationCity}</PBold>
          <CaptionGrey>{props.tripSourceLocationState}</CaptionGrey>
          <SmallGrey>{format(props.tripStartDate, "MMM dd")}</SmallGrey>
        </div>
        {props.routeId && (
          <div
            id="tripDistance"
            className="flex flex-row items-center justify-center text-center gap-1.5 lg:gap-2"
          >
            <div className="h-0.5 w-4 lg:w-6 bg-slate-200" />
            <SmallGrey>{props.selectedDistance + t("Km")}</SmallGrey>
            <div className="h-0.5 w-4 lg:w-6 bg-slate-200" />
          </div>
        )}
        <div
          id="tripDestination"
          className="flex flex-col gap-1 lg:gap-1.5 items-end text-end"
        >
          <PBold>{props.tripDestinationLocationCity}</PBold>
          <CaptionGrey>{props.tripDestinationLocationState}</CaptionGrey>
          <SmallGrey>{format(props.tripEndDate, "MMM dd")}</SmallGrey>
        </div>
      </div>
      <div
        id="tripFooter"
        className="bg-slate-200 flex flex-row justify-between gap-2 lg:gap-3 items-end p-2 lg:p-3 rounded-b-lg"
      >
        <TripTagWrapper>
          <div className="flex flex-row gap-1 lg:gap-1.5 items-center">
            {getTripIcon(props.tripType)}
            <Caption>{props.tripType.toUpperCase()}</Caption>
          </div>
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
