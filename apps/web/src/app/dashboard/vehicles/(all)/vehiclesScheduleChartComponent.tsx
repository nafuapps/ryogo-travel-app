"use client"

import { LucideCar } from "lucide-react"
import { useTranslations } from "next-intl"
import { sectionClassName } from "@/components/page/pageCommons"
import { useState } from "react"
import { FindVehiclesScheduleNextDaysType } from "@ryogo-travel-app/api/services/vehicle.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import DashboardScheduleDayAxis, {
  DashboardScheduleChart,
  DashboardScheduleContent,
  DashboardScheduleHeader,
  DashboardScheduleItem,
  DashboardScheduleItemID,
  DashboardScheduleItemBar,
  SelectableDays,
  DashboardScheduleItemGrid,
} from "../../components/common/dashboardSchedule"
import {
  AssignedBookingPopoverCard,
  RepairPopoverCard,
} from "../../components/common/dashboardPopoverCards"

export default function VehiclesScheduleChartComponent({
  vehicleSchedule14Days,
}: {
  vehicleSchedule14Days: FindVehiclesScheduleNextDaysType
}) {
  const t = useTranslations("Dashboard.Vehicles.Schedule")
  const [selectedTab, setSelectedTab] = useState(SelectableDays.SEVEN)

  const vehicleSchedule7Days = vehicleSchedule14Days.filter((v) => {
    const filterDate = new Date(new Date().getTime() + 24 * 6 * 60 * 60 * 1000)
    const bookings = v.assignedBookings.filter((b) => {
      b.startDate <= filterDate
    })
    const repairs = v.vehicleRepairs.filter((r) => r.startDate <= filterDate)
    return { ...v, bookings, repairs }
  })

  const chartData =
    selectedTab === SelectableDays.SEVEN
      ? vehicleSchedule7Days
      : vehicleSchedule14Days
  const selectedDays: number = selectedTab === SelectableDays.SEVEN ? 7 : 14

  return (
    <div id="VehiclesScheduleChartSection" className={sectionClassName}>
      <DashboardScheduleHeader
        length={chartData.length.toString()}
        title={t("Title")}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <DashboardScheduleChart>
        <DashboardScheduleDayAxis selectedDays={selectedDays} />
        <DashboardScheduleContent>
          {chartData.map((vehicle, index) => {
            return (
              <DashboardScheduleItem key={index}>
                <DashboardScheduleItemID
                  icon={LucideCar}
                  imageAlt={t("Photo")}
                  title={vehicle.vehicleNumber}
                  photoUrl={vehicle.vehiclePhotoUrl}
                />
                <DashboardScheduleItemGrid numberGrids={selectedDays}>
                  {vehicle.assignedBookings.map((b) => {
                    return (
                      <DashboardScheduleItemBar
                        key={b.id}
                        startDate={b.startDate}
                        endDate={b.endDate}
                        id={b.id}
                        selectedDays={selectedDays}
                        addedClass={
                          b.status === BookingStatusEnum.IN_PROGRESS
                            ? "bg-green-200 hover:bg-green-300"
                            : "bg-slate-200 hover:bg-slate-300"
                        }
                      >
                        <AssignedBookingPopoverCard {...b} />
                      </DashboardScheduleItemBar>
                    )
                  })}
                  {vehicle.vehicleRepairs.map((r) => {
                    return (
                      <DashboardScheduleItemBar
                        key={r.id}
                        startDate={r.startDate}
                        endDate={r.endDate}
                        id={r.id}
                        selectedDays={selectedDays}
                        addedClass={"bg-yellow-200 hover:bg-yellow-300"}
                      >
                        <RepairPopoverCard {...r} />
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
