"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { FindScheduleNextDaysType } from "@ryogo-travel-app/api/services/booking.services"
import DashboardScheduleDayAxis, {
  DashboardScheduleChart,
  DashboardScheduleContent,
  DashboardScheduleHeader,
  DashboardScheduleItem,
  DashboardScheduleItemID,
  SelectableDays,
  DashboardScheduleItemBar,
  DashboardScheduleItemGrid,
} from "@/components/dashboard/schedule/dashboardSchedule"
import { LucideUser } from "lucide-react"
import { OngoingBookingPopoverCard } from "@/components/dashboard/schedule/dashboardPopoverCards"
import { SectionWrapper } from "@/components/page/pageWrappers"

export default function BookingScheduleChartComponent({
  bookings14Days,
}: {
  bookings14Days: FindScheduleNextDaysType
}) {
  const t = useTranslations("Dashboard.Bookings.Schedule")
  const [selectedTab, setSelectedTab] = useState(SelectableDays.SEVEN)

  const bookings7Days = bookings14Days.filter(
    (b) =>
      b.startDate <= new Date(new Date().getTime() + 24 * 6 * 60 * 60 * 1000),
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
                  icon={LucideUser}
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
                    addedClass={
                      b.driver && b.vehicle
                        ? "bg-green-200 hover:bg-green-300"
                        : "bg-red-200 hover:bg-red-300"
                    }
                  >
                    <OngoingBookingPopoverCard {...b} />
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
