"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"

import {
  iconClassName,
  sectionClassName,
  sectionHeaderClassName,
} from "@/components/page/pageCommons"
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
} from "@/components/typography"
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "@/components/ui/select"
import { LucideCalendarDays } from "lucide-react"
import moment from "moment"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FindScheduleNextDaysType } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"

export default function BookingScheduleChartComponent({
  bookings14Days,
}: {
  bookings14Days: FindScheduleNextDaysType
}) {
  const t = useTranslations("Dashboard.Bookings.Schedule")
  const [selectedTab, setSelectedTab] = useState("7Days")

  const bookings7Days = bookings14Days.filter(
    (b) =>
      b.startDate <= new Date(new Date().getTime() + 24 * 6 * 60 * 60 * 1000),
  )

  const chartData = selectedTab == "7Days" ? bookings7Days : bookings14Days
  const selectedDays: number = selectedTab == "7Days" ? 7 : 14
  const chartStartDate = new Date()

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
        className="flex flex-row sm:flex-col gap-1 lg:gap-1.5 w-full"
      >
        <div
          id="BookingScheduleChartDayAxis"
          className={`grid shrink-0 sm:w-full grid-cols-1 sm:grid-rows-1 divide-y sm:divide-x sm:divide-y-0 divide-slate-200 gap-1 lg:gap-1.5 ${
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
                    chartStartDate.getTime() + index * 24 * 60 * 60 * 1000,
                  ),
                ).format("D MMM")}
              </CaptionGrey>
            </div>
          ))}
        </div>
        <div
          id="BookingScheduleChartContainer"
          className="grid w-full gap-1 lg:gap-1.5 overflow-auto no-scrollbar 
    grid-cols-[repeat(var(--items),1fr)]
    grid-rows-[repeat(var(--days),1fr)]
    sm:grid-cols-[repeat(var(--days),1fr)]
    sm:grid-rows-[repeat(var(--items),1fr)]"
          style={
            {
              // For mobile: columns = items, rows = days
              "--days": selectedDays,
              "--items": chartData.length,
            } as React.CSSProperties
          }
        >
          {chartData.map((booking, index) => {
            const millisecondsPerDay = 1000 * 60 * 60 * 24

            //Calculate gantt start and end index
            let dayIndexStart =
              Math.ceil(
                (booking.startDate.getTime() - chartStartDate.getTime()) /
                  millisecondsPerDay,
              ) + 1
            let dayIndexEnd =
              Math.ceil(
                (booking.endDate.getTime() - chartStartDate.getTime()) /
                  millisecondsPerDay,
              ) + 2
            console.log(dayIndexStart, dayIndexEnd)
            //Check if booking is assigned
            const isVehicleAssigned = booking.vehicle ? true : false
            const isDriverAssigned = booking.driver ? true : false
            return (
              <Popover key={index}>
                <PopoverTrigger asChild>
                  <div
                    key={index}
                    className={`flex flex-row p-1 lg:p-1.5 ${
                      booking.status == BookingStatusEnum.IN_PROGRESS
                        ? "bg-green-200 hover:bg-green-300"
                        : isVehicleAssigned && isDriverAssigned
                          ? "bg-slate-200 hover:bg-slate-300"
                          : "bg-red-200 hover:bg-red-300"
                    }  rounded-lg ${
                      dayIndexEnd > selectedDays
                        ? "rounded-b-none sm:rounded-bl-lg sm:rounded-r-none"
                        : ""
                    } ${
                      dayIndexStart < 1
                        ? "rounded-t-none sm:rounded-tr-lg sm:rounded-l-none"
                        : ""
                    } justify-center items-center min-w-0 
                    col-start-(--startIndex)
                    sm:col-start-(--dayIndexStart)
                    row-start-(--dayIndexStart)
                    sm:row-start-(--startIndex)
                    col-end-(--endIndex)
                    sm:col-end-(--dayIndexEnd)
                    row-end-(--dayIndexEnd)
                    sm:row-end-(--endIndex)
                    `}
                    style={
                      {
                        "--startIndex": index + 1,
                        "--endIndex": index + 2,
                        "--dayIndexStart":
                          dayIndexStart < 1 ? 1 : dayIndexStart,
                        "--dayIndexEnd":
                          dayIndexEnd < 2
                            ? 2
                            : dayIndexEnd > selectedDays
                              ? selectedDays
                              : dayIndexEnd,
                      } as React.CSSProperties
                    }
                  >
                    <Caption>{chartData[index]!.bookingId}</Caption>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                  <BookingPopoverCard
                    {...booking}
                    isVehicleAssigned={isVehicleAssigned}
                    isDriverAssigned={isDriverAssigned}
                  />
                </PopoverContent>
              </Popover>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function BookingPopoverCard(
  props: FindScheduleNextDaysType[number] & {
    isVehicleAssigned: boolean
    isDriverAssigned: boolean
  },
) {
  const t = useTranslations("Dashboard.Bookings.Schedule")
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <div className="flex flex-row justify-between gap-3 lg:gap-4 items-start">
        <div className="flex flex-col gap-1 item-start">
          <CaptionBold>{props.type.toUpperCase()}</CaptionBold>
          <H5>{props.route}</H5>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <Caption>
            {moment(props.startDate).format("DD MMM") +
              " - " +
              moment(props.endDate).format("DD MMM")}
          </Caption>
        </div>
      </div>
      <div className="flex flex-row justify-between gap-3 lg:gap-4 items-end">
        <div className="flex flex-col gap-1 items-start">
          <Small>{props.customerName}</Small>
          <CaptionBold>{props.bookingId}</CaptionBold>
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
      {(!props.isDriverAssigned || !props.isVehicleAssigned) && (
        <Link
          href={`/dashboard/bookings/${props.bookingId}/${
            props.isVehicleAssigned ? "assign-driver" : "assign-vehicle"
          }`}
        >
          <Button variant={"default"} type="button" className="w-full">
            {t("Assign")}
          </Button>
        </Link>
      )}
      <Link href={`/dashboard/bookings/${props.bookingId}`}>
        <Button
          variant={"secondary"}
          type="button"
          className="w-full hover:cursor-pointer"
        >
          {t("ViewDetails")}
        </Button>
      </Link>
    </div>
  )
}
