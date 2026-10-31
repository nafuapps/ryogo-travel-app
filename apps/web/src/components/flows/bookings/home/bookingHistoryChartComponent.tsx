"use client"

import {
  CompletedBookingCard,
  OngoingBookingCard,
} from "@/components/flows/bookings/cards/bookingCards"
import DashboardScheduleDayAxis, {
  DashboardScheduleChart,
  DashboardScheduleContent,
  DashboardScheduleHeader,
  DashboardScheduleItem,
  DashboardScheduleItemBar,
  DashboardScheduleItemGrid,
  DashboardScheduleItemID,
  getSelectedDays,
  SelectableDays,
} from "@/components/flows/dashboard/schedule/dashboardSchedule"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { SectionWrapper } from "@/components/page/pageWrappers"
import { FindBookingHistoryLastDaysType } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { differenceInDays } from "date-fns"
import { User } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

export default function BookingHistoryChartComponent({
  bookingsHistory14Days,
}: {
  bookingsHistory14Days: FindBookingHistoryLastDaysType
}) {
  const t = useTranslations("Dashboard.Bookings.History")
  const [selectedTab, setSelectedTab] = useState<SelectableDays>(
    SelectableDays.SEVEN,
  )

  const bookingsHistory7Days = bookingsHistory14Days.filter(
    (b) => differenceInDays(new Date(), b.actualEndDate ?? b.endDate) < 7,
  )

  const chartData =
    selectedTab === SelectableDays.SEVEN
      ? bookingsHistory7Days
      : bookingsHistory14Days
  const selectedDays: number = getSelectedDays(selectedTab)

  return (
    <SectionWrapper id="BookingHistorySection">
      <DashboardScheduleHeader
        title={t("Title")}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        isHistory
      />
      {chartData.length > 0 && (
        <DashboardScheduleChart>
          <DashboardScheduleDayAxis selectedDays={selectedDays} isHistory />
          <DashboardScheduleContent>
            {chartData.map((b) => {
              return (
                <DashboardScheduleItem key={b.id} isHistory>
                  <DashboardScheduleItemID
                    icon={<RyogoEnclosedIcon icon={User} size="sm" />}
                    imageAlt={b.customer.name}
                    title={b.customer.name}
                    photoUrl={b.customer.photoUrl}
                  />
                  <DashboardScheduleItemGrid numberGrids={selectedDays}>
                    <DashboardScheduleItemBar
                      startDate={b.actualStartDate ?? b.startDate}
                      endDate={b.actualEndDate ?? b.endDate}
                      id={b.id}
                      selectedDays={selectedDays}
                      className={
                        b.endDate < new Date() &&
                        b.status === BookingStatusEnum.IN_PROGRESS
                          ? "bg-red-700 dark:bg-red-300 opacity-80 hover:opacity-70"
                          : "bg-slate-700 dark:bg-slate-300 opacity-80 hover:opacity-70"
                      }
                      isHistory
                    >
                      {b.status === BookingStatusEnum.COMPLETED ? (
                        <CompletedBookingCard booking={b} />
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
