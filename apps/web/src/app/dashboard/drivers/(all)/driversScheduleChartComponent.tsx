"use client"

import { LucideUser } from "lucide-react"
import { useTranslations } from "next-intl"
import { sectionClassName } from "@/components/page/pageCommons"
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
} from "../../components/schedule/dashboardSchedule"
import {
  AssignedBookingPopoverCard,
  LeavePopoverCard,
} from "../../components/schedule/dashboardPopoverCards"

export default function DriversScheduleChartComponent({
  driverSchedule14Days,
}: {
  driverSchedule14Days: FindDriversScheduleNextDaysType
}) {
  const t = useTranslations("Dashboard.Drivers.Schedule")
  const [selectedTab, setSelectedTab] = useState(SelectableDays.SEVEN)

  const driverSchedule7Days = driverSchedule14Days.filter((d) => {
    const filterDate = new Date(new Date().getTime() + 24 * 6 * 60 * 60 * 1000)
    const bookings = d.assignedBookings.filter((b) => {
      b.startDate <= filterDate
    })
    const leaves = d.driverLeaves.filter((l) => l.startDate <= filterDate)
    return { ...d, bookings, leaves }
  })

  const chartData =
    selectedTab === SelectableDays.SEVEN
      ? driverSchedule7Days
      : driverSchedule14Days
  const selectedDays = getSelectedDays(selectedTab)

  return (
    <div id="DriversScheduleChartSection" className={sectionClassName}>
      <DashboardScheduleHeader
        length={chartData.length.toString()}
        title={t("Title")}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <DashboardScheduleChart>
        <DashboardScheduleDayAxis selectedDays={selectedDays} />
        <DashboardScheduleContent>
          {chartData.map((driver, index) => {
            return (
              <DashboardScheduleItem key={index}>
                <DashboardScheduleItemID
                  icon={LucideUser}
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
                        addedClass={
                          b.status === BookingStatusEnum.CONFIRMED &&
                          b.startDate < new Date()
                            ? "bg-red-200 hover:bg-red-300"
                            : b.status === BookingStatusEnum.IN_PROGRESS
                              ? "bg-green-200 hover:bg-green-300"
                              : "bg-slate-200 hover:bg-slate-300"
                        }
                      >
                        <AssignedBookingPopoverCard {...b} />
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
                        addedClass={"bg-yellow-200 hover:bg-yellow-300"}
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
    </div>
  )
}
