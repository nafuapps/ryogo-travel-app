import { SectionWrapper } from "@/components/page/pageWrappers"
import { getTranslations } from "next-intl/server"
import {
  DashboardRowHeader,
  DashboardSectionHeader,
} from "@/components/flows/dashboard/dashboardCommon"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { Separator } from "@/components/ui/separator"
import DashboardScheduleConflictItemComponent, {
  DashboardScheduleConflictItemType,
} from "./dashboardScheduleConflictItemComponent"

export default async function DashboardScheduleConflictsComponent({
  agencyId,
  userId,
  isOwner,
}: {
  agencyId: string
  userId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.Home.ScheduleConflicts")

  let { bookingsSchedule, leavesSchedule, repairsSchedule } =
    await bookingServices.findDashboardScheduleConflicts(agencyId)

  if (!isOwner) {
    bookingsSchedule = bookingsSchedule.filter(
      (booking) => booking.userId === userId,
    )
  }

  const vehicleBookingConflicts = getOverlappingConflicts(
    bookingsSchedule.map((item) => ({
      ...item,
      entity: item.assignedVehicle,
    })),
    bookingsSchedule.map((item) => ({
      ...item,
      entity: item.assignedVehicle,
    })),
  )

  const vehicleRepairConflicts = getOverlappingConflicts(
    bookingsSchedule.map((item) => ({
      ...item,
      entity: item.assignedVehicle,
    })),
    repairsSchedule.map((item) => ({
      ...item,
      entity: item.vehicle,
    })),
  )

  const driverBookingConflicts = getOverlappingConflicts(
    bookingsSchedule.map((item) => ({
      ...item,
      entity: item.assignedDriver,
    })),
    bookingsSchedule.map((item) => ({
      ...item,
      entity: item.assignedDriver,
    })),
  )

  const driverLeaveConflicts = getOverlappingConflicts(
    bookingsSchedule.map((item) => ({
      ...item,
      entity: item.assignedDriver,
    })),
    leavesSchedule.map((item) => ({
      ...item,
      entity: item.driver,
    })),
  )

  return (
    <SectionWrapper id="DashboardScheduleConflicts">
      <DashboardSectionHeader title={t("Title")} />
      <DashboardRowHeader
        title={t("VehicleAssignments")}
        count={vehicleBookingConflicts.length}
      />
      {vehicleBookingConflicts.length > 0 &&
        vehicleBookingConflicts.map((item, index) => (
          <DashboardScheduleConflictItemComponent
            key={index}
            conflict={item}
            highlight={isOwner && item.firstItem.userId === userId}
          />
        ))}
      <Separator />
      <DashboardRowHeader
        title={t("VehicleRepairs")}
        count={vehicleRepairConflicts.length}
      />
      {vehicleRepairConflicts.length > 0 &&
        vehicleRepairConflicts.map((item, index) => (
          <DashboardScheduleConflictItemComponent key={index} conflict={item} />
        ))}
      <Separator />
      <DashboardRowHeader
        title={t("DriverAssignments")}
        count={driverBookingConflicts.length}
      />
      {driverBookingConflicts.length > 0 &&
        driverBookingConflicts.map((item, index) => (
          <DashboardScheduleConflictItemComponent key={index} conflict={item} />
        ))}
      <Separator />
      <DashboardRowHeader
        title={t("DriverLeaves")}
        count={driverLeaveConflicts.length}
      />
      {driverLeaveConflicts.length > 0 &&
        driverLeaveConflicts.map((item, index) => (
          <DashboardScheduleConflictItemComponent key={index} conflict={item} />
        ))}
    </SectionWrapper>
  )
}

function getOverlappingConflicts(
  firstArray: {
    id: string
    startDate: Date
    endDate: Date
    userId: string
    entity: {
      id?: string
      label?: string
      photoUrl?: string | null
    }
  }[],
  secondArray: {
    id: string
    startDate: Date
    endDate: Date
    userId: string
    entity: {
      id?: string
      label?: string
      photoUrl?: string | null
    }
  }[],
) {
  const conflicts: Array<DashboardScheduleConflictItemType> = []

  if (
    !firstArray ||
    !secondArray ||
    firstArray.length === 0 ||
    secondArray.length === 0
  )
    return []

  for (let firstIndex = 0; firstIndex < firstArray.length; firstIndex += 1) {
    const firstItem = firstArray[firstIndex]

    if (!firstItem || !firstItem.entity) continue

    for (
      let secondIndex = 0;
      secondIndex < secondArray.length;
      secondIndex += 1
    ) {
      const secondItem = secondArray[secondIndex]
      if (!secondItem || !secondItem.entity) continue

      if (
        firstItem.entity.id !== secondItem.entity.id ||
        firstItem.id === secondItem.id
      )
        continue

      const isOverlapping =
        firstItem.startDate <= secondItem.endDate &&
        secondItem.startDate <= firstItem.endDate

      if (isOverlapping) {
        if (
          conflicts.find(
            (item) =>
              item.entity.id === firstItem.entity.id &&
              item.firstItem.id === secondItem.id &&
              item.secondItem.id === firstItem.id,
          )
        ) {
          continue
        }
        conflicts.push({
          entity: firstItem.entity,
          firstItem: firstItem,
          secondItem: secondItem,
        })
      }
    }
  }
  return conflicts
}
