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
import { LucideBookOpen } from "lucide-react";
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

type LeadBookingType = {
  type: string;
  route: string;
  customerName: string;
  bookingId: string;
  createdAt: Date;
  assignedUser: string;
  passengers: number;
  amount: number;
};

type LeadBookingsItemComponentProps = {
  leadBookings7Days: Promise<LeadBookingType[]>;
};

export default function LeadBookingsItemComponent(
  props: LeadBookingsItemComponentProps
) {
  // const leadBookings7Days = use(props.leadBookings7Days);

  const leadBookings7Days: LeadBookingType[] = [
    {
      bookingId: "B1234253",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      passengers: 2,
      assignedUser: "Rakesh Pandey",
      amount: 12323,
      createdAt: new Date(new Date().getTime() - 20 * 60 * 60 * 1000),
    },
    {
      bookingId: "B1234252",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      passengers: 2,
      assignedUser: "Rakesh Pandey",
      amount: 12323,
      createdAt: new Date(new Date().getTime() - 60 * 60 * 60 * 1000),
    },
    {
      bookingId: "B1234255",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      passengers: 2,
      assignedUser: "Rakesh Pandey",
      amount: 12323,
      createdAt: new Date(new Date().getTime() - 100 * 60 * 60 * 1000),
    },
  ];

  const t = useTranslations("Dashboard.Bookings.Leads");
  const [selectedTab, setSelectedTab] = useState("24hrs");

  const leadBookings24Hrs = leadBookings7Days.filter(
    (b) => b.createdAt > new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
  );

  const trips = selectedTab == "24hrs" ? leadBookings24Hrs : leadBookings7Days;

  return (
    <div id="leadsBookingsSection" className={sectionClassName}>
      <div
        id="leadsBookingsHeader"
        className="flex flex-row justify-between items-center"
      >
        <div className={sectionHeaderClassName}>
          <LucideBookOpen className={iconClassName} />
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
        <LeadBookingsComponent key={trip.bookingId} {...trip} />
      ))}
    </div>
  );
}

function LeadBookingsComponent(props: LeadBookingType) {
  const t = useTranslations("Dashboard.Bookings.Leads");
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
          <Caption>
            {props.amount.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            })}
          </Caption>
          <PBold>{props.assignedUser}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{props.passengers + " " + t("Passengers")}</Caption>
          <PBold>{moment(props.createdAt).fromNow()}</PBold>
        </div>
      </div>
    </Link>
  );
}
