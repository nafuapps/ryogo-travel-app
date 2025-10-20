import { PBold, CaptionGrey, SmallGrey } from "@/components/typography";
import { LucideCalendarDays, LucideUsers } from "lucide-react";
import {
  tileHeaderLeftClassName,
  tileHeaderRightClassName,
  NewBookingFormDataType,
  getTripDuration,
  getTripTypeIcon,
  newBookingTripInfoTagClassName,
} from "./newBookingCommon";
import { IconTextTag } from "./newBookingTileTag";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

export default function NewBookingTripInfo(props: NewBookingFormDataType) {
  const t = useTranslations("Dashboard.NewBooking.Form");
  const duration = getTripDuration(props.tripStartDate, props.tripEndDate);
  return (
    <div id="tripInfo" className="flex flex-col">
      <div
        id="tripHeader"
        className="flex flex-row justify-between items-center p-2 lg:p-3 rounded-t-lg  border-t border-l border-r border-slate-200"
      >
        <div id="tripSource" className={tileHeaderLeftClassName}>
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
        <div id="tripDestination" className={tileHeaderRightClassName}>
          <PBold>{props.tripDestinationLocationCity}</PBold>
          <CaptionGrey>{props.tripDestinationLocationState}</CaptionGrey>
          <SmallGrey>{format(props.tripEndDate, "MMM dd")}</SmallGrey>
        </div>
      </div>
      <div
        id="tripFooter"
        className="bg-slate-50 flex flex-row justify-between gap-2 lg:gap-3 items-end p-2 lg:p-3 rounded-b-lg border-b border-l border-r border-slate-200"
      >
        <div className={newBookingTripInfoTagClassName}>
          <IconTextTag
            icon={getTripTypeIcon(props.tripType)}
            text={props.tripType.toUpperCase()}
          />
        </div>
        <div className={newBookingTripInfoTagClassName}>
          <IconTextTag
            icon={LucideUsers}
            text={props.tripPassengers.toString()}
          />
        </div>
        <div className={newBookingTripInfoTagClassName}>
          <IconTextTag
            icon={LucideCalendarDays}
            text={duration.toString() + t("Days", { count: duration })}
          />
        </div>
      </div>
    </div>
  );
}
