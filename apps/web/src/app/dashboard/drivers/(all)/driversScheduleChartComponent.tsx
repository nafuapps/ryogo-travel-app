"use client"

import {
  SmallGrey,
  H5Grey,
  Caption,
  CaptionGrey,
  CaptionBold,
  H5,
  Small,
} from "@/components/typography"
import { LucideCalendarDays } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  sectionClassName,
  sectionHeaderClassName,
  iconClassName,
} from "@/components/page/pageCommons"
import { useState } from "react"
import { FindDriversScheduleNextDaysType } from "@ryogo-travel-app/api/services/driver.services"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import moment from "moment"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DriversScheduleChartComponent({
  driverSchedule14Days,
}: {
  driverSchedule14Days: FindDriversScheduleNextDaysType
}) {
  const t = useTranslations("Dashboard.Drivers.Schedule")
  const [selectedTab, setSelectedTab] = useState("7Days")

  const driverSchedule7Days = driverSchedule14Days.filter((d) => {
    const filterDate = new Date(new Date().getTime() + 24 * 6 * 60 * 60 * 1000)
    const bookings = d.assignedBookings.filter((b) => {
      b.startDate <= filterDate
    })
    const leaves = d.driverLeaves.filter((l) => l.startDate <= filterDate)
    return { ...d, bookings, leaves }
  })

  const chartData =
    selectedTab === "7Days" ? driverSchedule7Days : driverSchedule14Days
  const selectedDays: number = selectedTab === "7Days" ? 7 : 14
  const chartStartDate = new Date()

  return (
    <div id="DriversScheduleChartSection" className={sectionClassName}>
      <div
        id="DriversScheduleHeader"
        className="flex flex-row justify-between items-center"
      >
        <div className={sectionHeaderClassName}>
          <LucideCalendarDays className={iconClassName} />
          <SmallGrey>{t("Title")}</SmallGrey>
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
        id="DriversScheduleChart"
        className="flex flex-col sm:flex-row gap-2 lg:gap-2.5 w-full"
      >
        <div
          id="DriversScheduleChartDriverNumberAxis"
          className="flex flex-row sm:flex-col gap-1 lg:gap-1.5"
        >
          <div className="flex flex-row justify-end sm:justify-center items-center ">
            <CaptionGrey>{t("Driver")}</CaptionGrey>
          </div>
          <div
            className="grid w-full h-full grid-rows-1 sm:grid-cols-1 divide-x sm:divide-y sm:divide-x-0 divide-slate-200 gap-1 lg:gap-1.5 
          grid-cols-[repeat(var(--items),1fr)]
    sm:grid-rows-[repeat(var(--items),1fr)]"
            style={
              {
                "--items": chartData.length,
              } as React.CSSProperties
            }
          >
            {chartData.map((d, index) => (
              <div
                key={index}
                className="flex flex-row justify-center items-center min-w-0 text-ellipsis whitespace-nowrap"
              >
                <CaptionBold>{d.name}</CaptionBold>
              </div>
            ))}
          </div>
        </div>
        <div
          id="DriversScheduleChartContent"
          className="flex flex-row sm:flex-col gap-1 lg:gap-1.5 w-full"
        >
          <div
            id="DriversScheduleChartDayAxis"
            className="grid shrink-0 sm:w-full grid-cols-1 sm:grid-rows-1 divide-y sm:divide-x sm:divide-y-0 divide-slate-200 gap-1 lg:gap-1.5 
              grid-rows-[repeat(var(--days),1fr)] sm:grid-cols-[repeat(var(--days),1fr)]"
            style={
              {
                "--days": selectedDays,
              } as React.CSSProperties
            }
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
            id="DriversScheduleChartContainer"
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
            {chartData.map((driver, index) => {
              const millisecondsPerDay = 1000 * 60 * 60 * 24

              return [
                ...driver.assignedBookings.map((b) => {
                  //Calculate gantt start and end index
                  let dayIndexStart =
                    Math.ceil(
                      (b.startDate.getTime() - chartStartDate.getTime()) /
                        millisecondsPerDay,
                    ) + 1
                  let dayIndexEnd =
                    Math.ceil(
                      (b.endDate.getTime() - chartStartDate.getTime()) /
                        millisecondsPerDay,
                    ) + 2
                  return (
                    <Popover key={b.id}>
                      <PopoverTrigger asChild>
                        <div
                          className={`flex flex-row p-1 lg:p-1.5 ${
                            b.status === BookingStatusEnum.IN_PROGRESS
                              ? "bg-green-200 hover:bg-green-300"
                              : "bg-slate-200 hover:bg-slate-300"
                          }  rounded-lg ${
                            dayIndexEnd > selectedDays
                              ? "rounded-b-none sm:rounded-bl-lg sm:rounded-r-none"
                              : ""
                          } ${
                            dayIndexStart < 1
                              ? "rounded-t-none sm:rounded-tr-lg sm:rounded-l-none"
                              : ""
                          } justify-center items-center min-w-0 z-10 opacity-80
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
                          <Caption>{b.id}</Caption>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto">
                        <AssignedBookingPopoverCard {...b} />
                      </PopoverContent>
                    </Popover>
                  )
                }),
                ...driver.driverLeaves.map((l) => {
                  //Calculate gantt start and end index
                  let dayIndexStart =
                    Math.ceil(
                      (l.startDate.getTime() - chartStartDate.getTime()) /
                        millisecondsPerDay,
                    ) + 1
                  let dayIndexEnd =
                    Math.ceil(
                      (l.endDate.getTime() - chartStartDate.getTime()) /
                        millisecondsPerDay,
                    ) + 2
                  return (
                    <Popover key={l.id}>
                      <PopoverTrigger asChild>
                        <div
                          className={`flex flex-row p-1 lg:p-1.5 bg-yellow-200 hover:bg-yellow-300 rounded-lg ${
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
                          <Caption>{l.id}</Caption>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto">
                        <LeavePopoverCard {...l} />
                      </PopoverContent>
                    </Popover>
                  )
                }),
              ]
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function AssignedBookingPopoverCard(
  props: FindDriversScheduleNextDaysType[number]["assignedBookings"][number],
) {
  const t = useTranslations("Dashboard.Drivers.Schedule")
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <div className="flex flex-row justify-between gap-3 lg:gap-4 items-start">
        <div className="flex flex-col gap-1 item-start">
          <CaptionBold>{props.type.toUpperCase()}</CaptionBold>
          <H5>{props.source.city + " - " + props.destination.city}</H5>
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
          <Small>{props.customer.name}</Small>
          <CaptionBold>{props.id}</CaptionBold>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <Small>{props.assignedVehicle?.vehicleNumber}</Small>
          <CaptionBold>{props.assignedDriver?.name}</CaptionBold>
        </div>
      </div>
      <Link href={`/dashboard/bookings/${props.id}`}>
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

function LeavePopoverCard(
  props: FindDriversScheduleNextDaysType[number]["driverLeaves"][number],
) {
  const t = useTranslations("Dashboard.Drivers.Schedule")
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <div className="flex flex-col gap-1 items-start">
        <Caption>{props.driver.name}</Caption>
        <H5>
          {moment(props.startDate).format("DD MMM") +
            " - " +
            moment(props.endDate).format("DD MMM")}
        </H5>
      </div>
      <div className="flex flex-col gap-1 items-start">
        <Small>{props.addedByUser.name}</Small>
        <CaptionBold>{props.id}</CaptionBold>
      </div>
      <Link href={`/dashboard/drivers/${props.driverId}/leaves`}>
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
