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
import { format } from "date-fns";
import { LucideCheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { use, useState } from "react";
import moment from "moment";
import {
  gridClassName,
  gridItemClassName,
  sectionClassName,
  sectionHeaderClassName,
  iconClassName,
} from "./bookingCommons";

type CompletedBookingType = {
  status: string;
  updatedAt: Date;
  type: string;
  route: string;
  vehicle: string | undefined;
  driver: string | undefined;
  customerName: string;
  bookingId: string;
  createdAt: Date | undefined;
};

type CompletedBookingsItemComponentProps = {
  completedBookings7Days: Promise<CompletedBookingType[]>;
};

export default function CompletedBookingsItemComponent(
  props: CompletedBookingsItemComponentProps
) {
  // const completedBookings7Days = use(props.completedBookings7Days);

  const completedBookings7Days: CompletedBookingType[] = [
    {
      status: "completed",
      updatedAt: new Date(new Date().getTime() - 20 * 60 * 60 * 1000),
      bookingId: "B1234253",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      vehicle: "MH46AL9803",
      driver: "Surender K",
      createdAt: new Date(),
    },
    {
      status: "completed",
      updatedAt: new Date(new Date().getTime() - 70 * 60 * 60 * 1000),
      bookingId: "B1234252",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      vehicle: "MH46AL9803",
      driver: "Surender K",
      createdAt: new Date(),
    },
    {
      status: "reconciled",
      updatedAt: new Date(new Date().getTime() - 10 * 60 * 60 * 1000),
      bookingId: "B1234255",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      vehicle: "MH46AL9803",
      driver: "Surender K",
      createdAt: new Date(),
    },
  ];

  const t = useTranslations("Dashboard.Bookings.Completed");
  const [selectedTab, setSelectedTab] = useState("24hrs");

  const completedBookings24Hrs = completedBookings7Days.filter(
    (b) => b.updatedAt > new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
  );

  const trips =
    selectedTab == "24hrs" ? completedBookings24Hrs : completedBookings7Days;

  return (
    <div id="CompletedBookingsSection" className={sectionClassName}>
      <div
        id="CompletedBookingsHeader"
        className="flex flex-row justify-between items-center"
      >
        <div className={sectionHeaderClassName}>
          <LucideCheckCircle className={iconClassName} />
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
        <CompletedComponent key={trip.bookingId} {...trip} />
      ))}
    </div>
  );
}

function CompletedComponent(props: CompletedBookingType) {
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
          <Caption>{format(props.createdAt!, "PP")}</Caption>
          <PBold>{moment(props.createdAt).fromNow()}</PBold>
        </div>
      </div>
    </Link>
  );
}
