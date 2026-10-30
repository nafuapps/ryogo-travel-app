"use client"

import {
  OngoingBookingCard,
  UpcomingBookingCard,
} from "@/components/flows/bookings/cards/bookingCards"
import { LeavePopoverCard } from "@/components/flows/dashboard/schedule/dashboardPopoverCards"
import DashboardScheduleDayAxis, {
  DashboardScheduleChart,
  DashboardScheduleContent,
  DashboardScheduleHeader,
  DashboardScheduleItem,
  DashboardScheduleItemBar,
  DashboardScheduleItemGrid,
  DashboardScheduleItemID,
  SelectableDays,
  getSelectedDays,
} from "@/components/flows/dashboard/schedule/dashboardSchedule"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { SectionWrapper } from "@/components/page/pageWrappers"
import { FindDriversScheduleNextDaysType } from "@ryogo-travel-app/api/services/driver.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { differenceInDays } from "date-fns"
import { User } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

export default function DriversScheduleChartComponent({
  driverSchedule14Days,
  isOwner,
  userId,
}: {
  driverSchedule14Days: FindDriversScheduleNextDaysType
  isOwner: boolean
  userId: string
}) {
  const t = useTranslations("Dashboard.Drivers")
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
        title={t("Schedule")}
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
                    imageAlt={driver.name}
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
                              ? "bg-red-700 dark:bg-red-300 opacity-80 hover:opacity-70"
                              : "bg-slate-700 dark:bg-slate-300 opacity-80 hover:opacity-70"
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
                            "bg-yellow-700 dark:bg-yellow-300 opacity-80 hover:opacity-70"
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
