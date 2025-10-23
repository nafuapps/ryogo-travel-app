"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import {
  iconClassName,
  sectionClassName,
  sectionHeaderClassName,
} from "./bookingCommons";
import {
  PGrey,
  H5Grey,
  CaptionGrey,
  Caption,
  CaptionBold,
  H5,
  Small,
  CaptionRed,
  SmallRed,
} from "@/components/typography";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { LucideCalendarDays } from "lucide-react";
import moment from "moment";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type BookingScheduleType = {
  type: string;
  route: string;
  vehicle: string | undefined;
  driver: string | undefined;
  customerName: string;
  bookingId: string;
  startDate: string;
  endDate: string;
};

type BookingScheduleChartComponentProps = {
  bookings14Days: Promise<BookingScheduleType[]>;
};

export default function BookingScheduleChartComponent(
  props: BookingScheduleChartComponentProps
) {
  const t = useTranslations("Dashboard.Bookings.Schedule");
  const [selectedTab, setSelectedTab] = useState("7Days");

  // const bookings14Days = use(props.bookings14Days);
  const bookings14Days: BookingScheduleType[] = [
    {
      bookingId: "B1234250",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      vehicle: undefined,
      driver: "Surender K",
      startDate: new Date(
        new Date().getTime() + 40 * 60 * 60 * 1000
      ).toDateString(),
      endDate: new Date(
        new Date().getTime() + 70 * 60 * 60 * 1000
      ).toDateString(),
    },
    {
      bookingId: "B1234251",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      vehicle: "MH46AL9803",
      driver: "Surender K",
      startDate: new Date(
        new Date().getTime() + 24 * 60 * 60 * 1000
      ).toDateString(),
      endDate: new Date(
        new Date().getTime() + 48 * 60 * 60 * 1000
      ).toDateString(),
    },
    {
      bookingId: "B1234231",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      vehicle: "MH46AL9803",
      driver: "Surender K",
      startDate: new Date().toDateString(),
      endDate: new Date(
        new Date().getTime() + 48 * 60 * 60 * 1000
      ).toDateString(),
    },
    {
      bookingId: "B1234252",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      vehicle: "MH46AL9803",
      driver: "Surender K",
      startDate: new Date(
        new Date().getTime() + 30 * 60 * 60 * 1000
      ).toDateString(),
      endDate: new Date(
        new Date().getTime() + 80 * 60 * 60 * 1000
      ).toDateString(),
    },
    {
      bookingId: "B1234253",
      customerName: "Karan Singh",
      route: "Delhi - Agra",
      type: "One way",
      vehicle: "MH46AL9803",
      driver: "Surender K",
      startDate: new Date(
        new Date().getTime() + 180 * 60 * 60 * 1000
      ).toDateString(),
      endDate: new Date(
        new Date().getTime() + 250 * 60 * 60 * 1000
      ).toDateString(),
    },
  ];

  const bookings7Days = bookings14Days.filter(
    (b) =>
      new Date(b.startDate) <=
      new Date(new Date().getTime() + 24 * 6 * 60 * 60 * 1000)
  );

  const chartData = selectedTab == "7Days" ? bookings7Days : bookings14Days;
  const selectedDays: number = selectedTab == "7Days" ? 7 : 14;
  const chartStartDate = new Date();

  return (
    <div id="BookingScheduleSection" className={sectionClassName}>
      <div
        id="BookingScheduleHeader"
        className="flex flex-row justify-between items-center"
      >
        <div className={sectionHeaderClassName}>
          <LucideCalendarDays className={iconClassName} />
          <PGrey>{t("Title")}</PGrey>
          <H5Grey>{chartData.length}</H5Grey>
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
              <SelectItem value="7Days">{t("7Days")}</SelectItem>
              <SelectItem value="14Days">{t("14Days")}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div
        id="BookingScheduleChart"
        className="flex flex-row sm:flex-col gap-2 lg:gap-3 w-full"
      >
        <div
          id="BookingScheduleChartDayAxis"
          className={`grid whitespace- shrink-0 sm:w-full grid-cols-1 sm:grid-rows-1 divide-y sm:divide-x sm:divide-y-0 divide-slate-200 gap-1 lg:gap-1.5 ${
            selectedDays == 7
              ? "grid-rows-7 sm:grid-cols-7"
              : "grid-rows-14 sm:grid-cols-14"
          }`}
        >
          {Array.from({ length: selectedDays }, (_, index) => (
            <div
              key={index}
              className="flex flex-row justify-end sm:justify-center items-center "
            >
              <CaptionGrey>
                {moment(
                  new Date(
                    chartStartDate.getTime() + index * 24 * 60 * 60 * 1000
                  )
                ).format("D MMM")}
              </CaptionGrey>
            </div>
          ))}
        </div>
        <div
          id="BookingScheduleChartContainer"
          className="grid w-full gap-1 lg:gap-1.5 overflow-auto no-scrollbar 
    [grid-template-columns:repeat(var(--bookings),1fr)]
    [grid-template-rows:repeat(var(--days),1fr)]
    sm:[grid-template-columns:repeat(var(--days),1fr)]
    sm:[grid-template-rows:repeat(var(--bookings),1fr)]"
          style={
            {
              // For mobile: columns = bookings, rows = days
              "--days": selectedDays,
              "--bookings": chartData.length,
            } as React.CSSProperties
          }
        >
          {chartData.map((booking, index) => {
            const startDate = new Date(booking.startDate);
            const endDate = new Date(booking.endDate);
            const millisecondsPerDay = 1000 * 60 * 60 * 24;

            //Calculate gantt start and end index
            let dayIndexStart =
              Math.ceil(
                (startDate.getTime() - chartStartDate.getTime()) /
                  millisecondsPerDay
              ) + 1;
            let dayIndexEnd =
              Math.ceil(
                (endDate.getTime() - chartStartDate.getTime()) /
                  millisecondsPerDay
              ) + 2;

            //Put limits on start and end
            if (dayIndexStart < 1) {
              dayIndexStart = 1;
            }
            if (dayIndexEnd > selectedDays) {
              dayIndexEnd = selectedDays;
            }

            //Check if booking is assigned
            const isAssigned = booking.driver && booking.vehicle ? true : false;

            return (
              <Popover key={index}>
                <PopoverTrigger asChild>
                  <div
                    key={index}
                    className={`flex flex-row p-1 lg:p-1.5 ${
                      isAssigned
                        ? "bg-slate-200 hover:bg-slate-300"
                        : "bg-red-200 hover:bg-red-300"
                    }  rounded-lg ${
                      dayIndexEnd == selectedDays
                        ? "rounded-b-none sm:rounded-bl-lg sm:rounded-r-none"
                        : ""
                    } justify-center items-center text-ellipsis 
                    [grid-column-start:var(--index)+1]
                    sm:[grid-column-start:var(--dayIndexStart)]
                    [grid-row-start:var(--dayIndexStart)]
                    sm:[grid-row-start:var(--index)+1]
                    [grid-column-end:var(--index)+2]
                    sm:[grid-column-end:var(--dayIndexEnd)]
                    [grid-row-end:var(--dayIndexEnd)]
                    sm:[grid-row-end:var(--index)+2]
                    `}
                    style={
                      {
                        "--index": index,
                        "--dayIndexStart": dayIndexStart,
                        "--dayIndexEnd": dayIndexEnd,
                      } as React.CSSProperties
                    }
                  >
                    <Caption>{chartData[index]!.bookingId}</Caption>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                  <BookingPopoverCard {...booking} isAssigned={isAssigned} />
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BookingPopoverCard(
  props: BookingScheduleType & { isAssigned: boolean }
) {
  const t = useTranslations("Dashboard.Bookings.Schedule");
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <div className="flex flex-row justify-between gap-3 lg:gap-4 items-start">
        <div className="flex flex-col gap-1 item-start">
          <CaptionBold>{props.type}</CaptionBold>
          <H5>{props.route.toUpperCase()}</H5>
        </div>
        <div className="flex flex-col gap-1 items-end">
          {props.vehicle ? (
            <Small>{props.vehicle}</Small>
          ) : (
            <SmallRed>{t("NotAssigned")}</SmallRed>
          )}
          {props.driver ? (
            <CaptionBold>{props.driver}</CaptionBold>
          ) : (
            <CaptionRed>{t("NotAssigned")}</CaptionRed>
          )}
        </div>
      </div>
      <div className="flex flex-row justify-between gap-3 lg:gap-4 items-end">
        <div className="flex flex-col gap-1 items-start">
          <Small>{props.customerName}</Small>
          <CaptionBold>{props.bookingId}</CaptionBold>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <Small>{props.startDate}</Small>
          <CaptionBold>{props.endDate}</CaptionBold>
        </div>
      </div>
      {!props.isAssigned && (
        <Link href={`/dashboard/bookings/${props.bookingId}/modify`}>
          <Button variant={"default"} type="button" className="w-full">
            {t("Assign")}
          </Button>
        </Link>
      )}
      <Link href={`/dashboard/bookings/${props.bookingId}`}>
        <Button variant={"secondary"} type="button" className="w-full">
          {t("ViewDetails")}
        </Button>
      </Link>
    </div>
  );
}
