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
import { BookingSchedulePopoverCard } from "@/components/flows/dashboard/schedule/dashboardPopoverCards"
import { SectionWrapper } from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { differenceInDays } from "date-fns"

export default function BookingScheduleChartComponent({
  bookings14Days,
}: {
  bookings14Days: FindBookingScheduleNextDaysType
}) {
  const t = useTranslations("Dashboard.Bookings.Schedule")
  const [selectedTab, setSelectedTab] = useState(SelectableDays.SEVEN)

  const bookings7Days = bookings14Days.filter(
    (b) => differenceInDays(b.startDate, new Date()) < 7,
  )

  const chartData =
    selectedTab === SelectableDays.SEVEN ? bookings7Days : bookings14Days
  const selectedDays: number = selectedTab === SelectableDays.SEVEN ? 7 : 14

  return (
    <SectionWrapper id="BookingScheduleSection">
      <DashboardScheduleHeader
        length={chartData.length.toString()}
        title={t("Title")}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <DashboardScheduleChart>
        <DashboardScheduleDayAxis selectedDays={selectedDays} />
        <DashboardScheduleContent>
          {chartData.map((b, index) => {
            return (
              <DashboardScheduleItem key={index}>
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
                      !b.driver || !b.vehicle || b.endDate < new Date()
                        ? "bg-red-200 dark:bg-red-700 hover:bg-red-300 dark:hover:bg-red-600"
                        : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
                    }
                  >
                    <BookingSchedulePopoverCard {...b} />
                  </DashboardScheduleItemBar>
                </DashboardScheduleItemGrid>
              </DashboardScheduleItem>
            )
          })}
        </DashboardScheduleContent>
      </DashboardScheduleChart>
    </SectionWrapper>
  )
}
