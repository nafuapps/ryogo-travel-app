"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { FindBookingScheduleNextDaysType } from "@ryogo-travel-app/api/services/booking.services"
import DashboardScheduleDayAxis, {
  DashboardScheduleChart,
  DashboardScheduleContent,
  DashboardScheduleHeader,
  DashboardScheduleItem,
  DashboardScheduleItemID,
  SelectableDays,
  DashboardScheduleItemBar,
  DashboardScheduleItemGrid,
} from "@/components/flows/dashboard/schedule/dashboardSchedule"
import { User } from "lucide-react"
import { SectionWrapper } from "@/components/page/pageWrappers"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { differenceInDays } from "date-fns"
import {
  OngoingBookingCard,
  UpcomingBookingCard,
} from "@/components/flows/bookings/cards/bookingCards"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"

export default function BookingScheduleChartComponent({
  bookingsSchedule14Days,
  userId,
  isOwner,
}: {
  bookingsSchedule14Days: FindBookingScheduleNextDaysType
  userId: string
  isOwner: boolean
}) {
  const t = useTranslations("Dashboard.Bookings.Schedule")
  const [selectedTab, setSelectedTab] = useState(SelectableDays.SEVEN)

  const bookings7Days = bookingsSchedule14Days.filter(
    (b) => differenceInDays(b.startDate, new Date()) < 7,
  )

  const chartData =
    selectedTab === SelectableDays.SEVEN
      ? bookings7Days
      : bookingsSchedule14Days
  const selectedDays: number = selectedTab === SelectableDays.SEVEN ? 7 : 14

  return (
    <SectionWrapper id="BookingScheduleSection">
      <DashboardScheduleHeader
        title={t("Title")}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {chartData.length > 0 && (
        <DashboardScheduleChart>
          <DashboardScheduleDayAxis selectedDays={selectedDays} />
          <DashboardScheduleContent>
            {chartData.map((b) => {
              return (
                <DashboardScheduleItem key={b.id}>
                  <DashboardScheduleItemID
                    icon={<RyogoEnclosedIcon icon={User} size="sm" />}
                    imageAlt={b.customer.name}
                    title={b.customer.name}
                    photoUrl={b.customer.photoUrl}
                  />
                  <DashboardScheduleItemGrid numberGrids={selectedDays}>
                    <DashboardScheduleItemBar
                      startDate={b.actualStartDate ?? b.startDate}
                      endDate={b.endDate}
                      id={b.id}
                      selectedDays={selectedDays}
                      className={
                        !b.assignedDriver ||
                        !b.assignedVehicle ||
                        b.endDate < new Date()
                          ? "bg-red-300 dark:bg-red-700 hover:bg-red-400 dark:hover:bg-red-600"
                          : "bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
                      }
                    >
                      {b.status === BookingStatusEnum.CONFIRMED ? (
                        <UpcomingBookingCard
                          booking={b}
                          canAssign={isOwner || b.assignedUser.id === userId}
                        />
                      ) : (
                        <OngoingBookingCard booking={b} />
                      )}
                    </DashboardScheduleItemBar>
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
