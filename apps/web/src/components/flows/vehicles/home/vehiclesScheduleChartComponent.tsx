"use client"

import {
  OngoingBookingCard,
  UpcomingBookingCard,
} from "@/components/flows/bookings/cards/bookingCards"
import { RepairPopoverCard } from "@/components/flows/dashboard/schedule/dashboardPopoverCards"
import DashboardScheduleDayAxis, {
  DashboardScheduleChart,
  DashboardScheduleContent,
  DashboardScheduleHeader,
  DashboardScheduleItem,
  DashboardScheduleItemBar,
  DashboardScheduleItemGrid,
  DashboardScheduleItemID,
  SelectableDays,
} from "@/components/flows/dashboard/schedule/dashboardSchedule"
import GetVehicleEnclosedIcon from "@/components/icons/vehicleIcon"
import { SectionWrapper } from "@/components/page/pageWrappers"
import { FindVehiclesScheduleNextDaysType } from "@ryogo-travel-app/api/services/vehicle.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { differenceInDays } from "date-fns"
import { useTranslations } from "next-intl"
import { useState } from "react"

export default function VehiclesScheduleChartComponent({
  vehicleSchedule14Days,
  isOwner,
  userId,
}: {
  vehicleSchedule14Days: FindVehiclesScheduleNextDaysType
  isOwner: boolean
  userId: string
}) {
  const t = useTranslations("Dashboard.Vehicles")
  const [selectedTab, setSelectedTab] = useState(SelectableDays.SEVEN)

  const chartData =
    selectedTab === SelectableDays.SEVEN
      ? filterVehicleSchedule(vehicleSchedule14Days, 7)
      : vehicleSchedule14Days
  const selectedDays: number = selectedTab === SelectableDays.SEVEN ? 7 : 14

  return (
    <SectionWrapper id="VehiclesScheduleChartSection">
      <DashboardScheduleHeader
        title={t("Schedule")}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {chartData.length > 0 && (
        <DashboardScheduleChart>
          <DashboardScheduleDayAxis selectedDays={selectedDays} />
          <DashboardScheduleContent>
            {chartData.map((vehicle) => {
              return (
                <DashboardScheduleItem key={vehicle.id}>
                  <DashboardScheduleItemID
                    icon={
                      <GetVehicleEnclosedIcon
                        vehicleType={vehicle.type}
                        size="sm"
                      />
                    }
                    imageAlt={vehicle.vehicleNumber}
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
                    {vehicle.vehicleRepairs.map((r) => {
                      return (
                        <DashboardScheduleItemBar
                          key={r.id}
                          startDate={r.startDate}
                          endDate={r.endDate}
                          id={r.id}
                          selectedDays={selectedDays}
                          className={
                            "bg-yellow-700 dark:bg-yellow-300 opacity-80 hover:opacity-70"
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

function filterVehicleSchedule(
  schedule: FindVehiclesScheduleNextDaysType,
  filterDays: number,
) {
  return schedule
    .map((v) => {
      const assignedBookings = v.assignedBookings.filter(
        (b) =>
          differenceInDays(b.actualStartDate ?? b.startDate, new Date()) <
          filterDays,
      )
      const vehicleRepairs = v.vehicleRepairs.filter(
        (r) =>
          differenceInDays(r.actualStartDate ?? r.startDate, new Date()) <
          filterDays,
      )
      return { ...v, assignedBookings, vehicleRepairs }
    })
    .filter((v) => v.assignedBookings.length > 0 || v.vehicleRepairs.length > 0)
}
