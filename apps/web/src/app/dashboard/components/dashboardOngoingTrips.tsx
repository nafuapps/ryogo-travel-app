import { CaptionBold, H4, Small } from "@/components/typography";

import Link from "next/link";

type DashboardOngoingTripComponentProps = {
  bookingId: string;
  customerName: string;
  route: string;
  type: string;
  vehicle: string;
  driver: string;
  status: string;
};
export default function DashboardOngoingTripComponent(
  props: DashboardOngoingTripComponentProps
) {
  return (
    <Link href={`/dashboard/bookings/${props.bookingId}`}>
      <div className="flex flex-row gap-3 hover:bg-slate-100 lg:gap-4 w-full justify-between border-2 border-slate-100 rounded-lg p-4 lg:p-5">
        <div className="flex flex-col justify-start gap-4 lg:gap-5 items-start">
          <div className="flex flex-col gap-1 item-start">
            <CaptionBold>{props.type}</CaptionBold>
            <H4>{props.route.toUpperCase()}</H4>
          </div>
          <div className="flex flex-col gap-1 items-start">
            <Small>{props.vehicle}</Small>
            <CaptionBold>{props.driver}</CaptionBold>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 lg:gap-4 items-end">
          <div className="flex flex-col gap-1 items-end">
            <Small>{props.customerName}</Small>
            <CaptionBold>{props.bookingId}</CaptionBold>
          </div>
          <div className="flex rounded-full bg-slate-200 px-2 py-1.5 lg:px-3 lg:py-2">
            <CaptionBold>{props.status.toUpperCase()}</CaptionBold>
          </div>
        </div>
      </div>
    </Link>
  );
}
