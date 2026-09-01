"use client"

import { useTranslations } from "next-intl"
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
} from "@/components/flows/dashboard/schedule/dashboardSchedule"
import {
  AssignedBookingPopoverCard,
  RepairPopoverCard,
} from "@/components/flows/dashboard/schedule/dashboardPopoverCards"
import { SectionWrapper } from "@/components/page/pageWrappers"
import GetVehicleIcon from "@/components/icons/vehicleIcon"
import { addDays } from "date-fns"

export default function VehiclesScheduleChartComponent({
  vehicleSchedule14Days,
}: {
  vehicleSchedule14Days: FindVehiclesScheduleNextDaysType
}) {
  const t = useTranslations("Dashboard.Vehicles.Schedule")
  const [selectedTab, setSelectedTab] = useState(SelectableDays.SEVEN)

  const vehicleSchedule7Days = vehicleSchedule14Days.filter((v) => {
    const filterDate = addDays(new Date(), 7)
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
    <SectionWrapper id="VehiclesScheduleChartSection">
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
            {chartData.map((vehicle, index) => {
              return (
                <DashboardScheduleItem key={index}>
                  <DashboardScheduleItemID
                    icon={
                      <GetVehicleIcon vehicleType={vehicle.type} size="md" />
                    }
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
                          className={
                            (b.status === BookingStatusEnum.CONFIRMED &&
                              b.startDate < new Date()) ||
                            (b.status === BookingStatusEnum.IN_PROGRESS &&
                              b.endDate < new Date())
                              ? "bg-red-300 dark:bg-red-700 hover:bg-red-400 dark:hover:bg-red-600"
                              : "bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
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
                          className={
                            "bg-yellow-300 dark:bg-yellow-700 hover:bg-yellow-400 dark:hover:bg-yellow-600"
                          }
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
      )}
    </SectionWrapper>
  )
}
