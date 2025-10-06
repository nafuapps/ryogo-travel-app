"use client";

import { PGrey, H5Grey, PBold, Caption } from "@/components/typography";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LucideClock } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import moment from "moment";
import {
  gridClassName,
  gridItemClassName,
  sectionClassName,
  sectionHeaderClassName,
  iconClassName,
} from "./bookingCommons";

type UpcomingBookingType = {
  type: string;
  route: string;
  vehicle: string | undefined;
  driver: string | undefined;
  customerName: string;
  bookingId: string;
  date: string;
  time: string | null;
};

type UpcomingBookingsItemComponentProps = {
  upcomingBookings7Days: Promise<UpcomingBookingType[]>;
};

export default function UpcomingBookingsItemComponent(
  props: UpcomingBookingsItemComponentProps
) {
  // const upcomingBookings7Days = use(props.upcomingBookings7Days)

  const upcomingBookings7Days: UpcomingBookingType[] = [
    {
      bookingId: "B1234253",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      vehicle: "MH46AL9803",
      driver: "Surender K",
      date: new Date(new Date().getTime() + 10 * 60 * 60 * 1000).toDateString(),
      time: "07:05 PM",
    },
    {
      bookingId: "B1234252",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      vehicle: "MH46AL9803",
      driver: "Surender K",
      date: new Date(new Date().getTime() + 74 * 60 * 60 * 1000).toDateString(),
      time: "07:05 PM",
    },
    {
      bookingId: "B1234255",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      vehicle: "MH46AL9803",
      driver: "Surender K",
      date: new Date(new Date().getTime() + 5 * 60 * 60 * 1000).toDateString(),
      time: "08:05 PM",
    },
  ];

  const t = useTranslations("Dashboard.Bookings.Upcoming");
  const [selectedTab, setSelectedTab] = useState("24hrs");

  const upcomingBookings24Hrs = upcomingBookings7Days.filter(
    (b) =>
      new Date(b.date) < new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );

  const trips =
    selectedTab == "24hrs" ? upcomingBookings24Hrs : upcomingBookings7Days;

  return (
    <div id="UpcomingBookingsSection" className={sectionClassName}>
      <div
        id="UpcomingBookingsHeader"
        className="flex flex-row justify-between items-center"
      >
        <div className={sectionHeaderClassName}>
          <LucideClock className={iconClassName} />
          <PGrey>{t("Title")}</PGrey>
          <H5Grey>{trips.length}</H5Grey>
        </div>
        <Select
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="24hrs">{t("24Hrs")}</SelectItem>
              <SelectItem value="7days">{t("7Days")}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {trips.map((trip) => (
        <UpcomingComponent key={trip.bookingId} {...trip} />
      ))}
    </div>
  );
}

function UpcomingComponent(props: UpcomingBookingType) {
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
          <Caption>{format(props.date, "PP")}</Caption>
          <PBold>{moment(props.date + " " + props.time).fromNow()}</PBold>
        </div>
      </div>
    </Link>
  );
}
