"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
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
import { BookingSchedulePopoverCard } from "@/components/flows/dashboard/schedule/dashboardPopoverCards"
import { SectionWrapper } from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { FindBookingHistoryLastDaysType } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { differenceInDays } from "date-fns"

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
    (b) => differenceInDays(new Date(), b.startDate) < 7,
  )

  const chartData =
    selectedTab === SelectableDays.SEVEN
      ? bookingsHistory7Days
      : bookingsHistory14Days
  const selectedDays: number = selectedTab === SelectableDays.SEVEN ? 7 : 14

  return (
    <SectionWrapper id="BookingHistorySection">
      <DashboardScheduleHeader
        length={chartData.length.toString()}
        title={t("Title")}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        isHistory
      />
      {chartData.length > 0 && (
        <DashboardScheduleChart>
          <DashboardScheduleDayAxis selectedDays={selectedDays} isHistory />
          <DashboardScheduleContent>
            {chartData.map((b, index) => {
              return (
                <DashboardScheduleItem key={index} isHistory>
                  <DashboardScheduleItemID
                    icon={<RyogoIcon icon={User} size="md" />}
                    imageAlt={t("Photo")}
                    title={b.customerName}
                    photoUrl={b.customerPhotoUrl}
                  />
                  <DashboardScheduleItemGrid numberGrids={selectedDays}>
                    <DashboardScheduleItemBar
                      startDate={b.startDate}
                      endDate={b.endDate}
                      id={b.bookingId}
                      selectedDays={selectedDays}
                      className={
                        !b.driver ||
                        !b.vehicle ||
                        (b.endDate < new Date() &&
                          b.status === BookingStatusEnum.IN_PROGRESS)
                          ? "bg-red-300 dark:bg-red-700 hover:bg-red-400 dark:hover:bg-red-600"
                          : "bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
                      }
                      isHistory
                    >
                      <BookingSchedulePopoverCard {...b} />
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
