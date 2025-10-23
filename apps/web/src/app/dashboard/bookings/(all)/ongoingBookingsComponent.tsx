import {
  Caption,
  CaptionBold,
  H5Grey,
  PBold,
  PGrey,
} from "@/components/typography";
import { getCurrentUser } from "@/lib/auth";
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services";
import { LucideRoute } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  gridClassName,
  gridItemClassName,
  sectionClassName,
  sectionHeaderClassName,
  iconClassName,
} from "./bookingCommons";

export default async function OngoingBookingsComponent() {
  const t = await getTranslations("Dashboard.Bookings.Ongoing");
  // const user = await getCurrentUser();
  // const ongoingTrips = await bookingServices.findOngoingTrips(user!.agencyId);

  const ongoingTrips: OngoingBookingType[] = [
    {
      bookingId: "B1234253",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      vehicle: "MH46AL9803",
      driver: "Surender K",
      status: "Picked Up",
    },
    {
      bookingId: "B1234252",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      vehicle: "MH46AL9803",
      driver: "Surender K",
      status: "Picked Up",
    },
    {
      bookingId: "B1234255",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      vehicle: "MH46AL9803",
      driver: "Surender K",
      status: "Picked Up",
    },
  ];

  return (
    <div id="OngoingBookingsSection" className={sectionClassName}>
      <div id="OngoingBookingsHeader" className={sectionHeaderClassName}>
        <LucideRoute className={iconClassName} />
        <PGrey>{t("Title")}</PGrey>
        <H5Grey>{ongoingTrips.length}</H5Grey>
      </div>
      {ongoingTrips.map((trip) => (
        <OngoingComponent key={trip.bookingId} {...trip} />
      ))}
    </div>
  );
}

type OngoingBookingType = {
  type: string;
  route: string;
  vehicle: string | undefined;
  driver: string | undefined;
  customerName: string;
  bookingId: string;
  status: string | undefined;
};
function OngoingComponent(props: OngoingBookingType) {
  return (
    <Link href={`/dashboard/bookings/${props.bookingId}`}>
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          <Caption>{props.bookingId}</Caption>
          <PBold>{props.customerName}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{props.type.toUpperCase()}</Caption>
          <PBold>{props.route}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{props.vehicle}</Caption>
          <PBold>{props.driver}</PBold>
        </div>
        <div className={gridItemClassName}>
          <div className="flex justify-center items-center rounded-full bg-slate-200 px-2 py-1.5 lg:px-3 lg:py-2">
            <CaptionBold>{props.status?.toUpperCase()}</CaptionBold>
          </div>
        </div>
      </div>
    </Link>
  );
}
