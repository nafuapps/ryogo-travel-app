"use client"

import { User } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { FindDriversScheduleNextDaysType } from "@ryogo-travel-app/api/services/driver.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import DashboardScheduleDayAxis, {
  DashboardScheduleChart,
  DashboardScheduleContent,
  DashboardScheduleHeader,
  DashboardScheduleItem,
  DashboardScheduleItemID,
  DashboardScheduleItemBar,
  SelectableDays,
  getSelectedDays,
  DashboardScheduleItemGrid,
} from "@/components/flows/dashboard/schedule/dashboardSchedule"
import { LeavePopoverCard } from "@/components/flows/dashboard/schedule/dashboardPopoverCards"
import { SectionWrapper } from "@/components/page/pageWrappers"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { differenceInDays } from "date-fns"
import {
  OngoingBookingCard,
  UpcomingBookingCard,
} from "@/components/flows/bookings/cards/bookingCards"

export default function DriversScheduleChartComponent({
  driverSchedule14Days,
  isOwner,
  userId,
}: {
  driverSchedule14Days: FindDriversScheduleNextDaysType
  isOwner: boolean
  userId: string
}) {
  const t = useTranslations("Dashboard.Drivers.Schedule")
  const [selectedTab, setSelectedTab] = useState(SelectableDays.SEVEN)

  const driverSchedule7Days = driverSchedule14Days.filter((d) => {
    const assignedBookings = d.assignedBookings.filter((b) => {
      differenceInDays(b.actualStartDate ?? b.startDate, new Date()) < 7
    })
    const driverLeaves = d.driverLeaves.filter(
      (l) => differenceInDays(l.startDate, new Date()) < 7,
    )
    return { ...d, assignedBookings, driverLeaves }
  })

  const chartData =
    selectedTab === SelectableDays.SEVEN
      ? driverSchedule7Days
      : driverSchedule14Days
  const selectedDays = getSelectedDays(selectedTab)

  return (
    <SectionWrapper id="DriversScheduleChartSection">
      <DashboardScheduleHeader
        length={chartData.length.toString()}
        title={t("Title")}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {chartData.length > 0 && (
        <DashboardScheduleChart>
          <DashboardScheduleDayAxis selectedDays={selectedDays} />
          <DashboardScheduleContent>
            {chartData.map((driver) => {
              return (
                <DashboardScheduleItem key={driver.id}>
                  <DashboardScheduleItemID
                    icon={<RyogoEnclosedIcon icon={User} size="sm" />}
                    imageAlt={t("Photo")}
                    title={driver.name}
                    photoUrl={driver.user.photoUrl}
                  />
                  <DashboardScheduleItemGrid numberGrids={selectedDays}>
                    {driver.assignedBookings.map((b) => {
                      return (
                        <DashboardScheduleItemBar
                          key={b.id}
                          startDate={b.startDate}
                          endDate={b.endDate}
                          id={b.id}
                          selectedDays={selectedDays}
                          className={
                            (b.status === BookingStatusEnum.CONFIRMED &&
                              b.startDate < new Date()) ||
                            (b.status === BookingStatusEnum.IN_PROGRESS &&
                              b.endDate < new Date())
                              ? "bg-red-300 dark:bg-red-700 hover:bg-red-400 dark:hover:bg-red-600"
                              : "bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
                          }
                        >
                          {b.status === BookingStatusEnum.CONFIRMED ? (
                            <UpcomingBookingCard
                              booking={b}
                              canAssign={
                                isOwner || b.assignedUser.id === userId
                              }
                            />
                          ) : (
                            <OngoingBookingCard booking={b} />
                          )}
                        </DashboardScheduleItemBar>
                      )
                    })}
                    {driver.driverLeaves.map((l) => {
                      return (
                        <DashboardScheduleItemBar
                          key={l.id}
                          startDate={l.startDate}
                          endDate={l.endDate}
                          id={l.id}
                          selectedDays={selectedDays}
                          className={
                            "bg-yellow-300 dark:bg-yellow-700 hover:bg-yellow-400 dark:hover:bg-yellow-600 opacity-50"
                          }
                        >
                          <LeavePopoverCard {...l} />
                        </DashboardScheduleItemBar>
                      )
                    })}
                  </DashboardScheduleItemGrid>
                </DashboardScheduleItem>
              )
            })}
          </DashboardScheduleContent>
        </DashboardScheduleChart>
      )}
    </SectionWrapper>
  )
}
