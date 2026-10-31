"use server"

import { writePermissions } from "@/lib/permissions"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { EntityTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { format } from "date-fns"

export async function startDriverLeaveAction({
  userId,
  driverId,
  leaveId,
  agencyId,
}: {
  userId: string
  driverId: string
  leaveId: string
  agencyId: string
}) {
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId: agencyId,
    assignedUserId: userId,
  })
  if (!currentUser) return

  const startedLeave = await driverServices.startDriverLeave({
    leaveId,
    driverId,
  })
  if (!startedLeave) return

  await notificationServices.addNotification({
    agencyId: agencyId,
    userId: currentUser.userId,
    entityType: EntityTypeEnum.DRIVER_LEAVE,
    entityId: startedLeave.id,
    isFeed: true,
    textKey:
      currentUser.userRole === UserRolesEnum.DRIVER
        ? "StartedDriverLeave"
        : "DriverLeaveStarted",
    textObject: {
      startDate: startedLeave.actualStartDate,
      userName: currentUser.name,
      driverName: startedLeave.driver.name,
    },
    link: `/dashboard/drivers/${startedLeave.driverId}/leaves`,
  })

  //Add startedLeave mission for assignedUser if started by driver and vice versa
  await missionServices.addMission({
    agencyId: agencyId,
    userId:
      currentUser.userRole === UserRolesEnum.DRIVER
        ? startedLeave.addedByUserId
        : startedLeave.driver.userId,
    entityType: EntityTypeEnum.DRIVER_LEAVE,
    entityId: startedLeave.id,
    titleKey: "DriverLeaveStarted.Title",
    titleObject: {
      driverName: startedLeave.driver.name,
    },
    messageKey: "DriverLeaveStarted.Message",
    messageObject: {
      startDate: format(
        startedLeave.actualStartDate ?? startedLeave.startDate,
        "dd MMM yyyy",
      ),
      endDate: format(startedLeave.endDate, "dd MMM yyyy"),
    },
    dueDate: startedLeave.endDate,
    link:
      currentUser.userRole === UserRolesEnum.DRIVER
        ? `/dashboard/drivers/${startedLeave.driverId}/leaves`
        : "rider/myLeaves",
  })

  //Remove newLeave mission
  await missionServices.removePreviousMissionsByEntityTitleKey({
    agencyId: agencyId,
    entityType: EntityTypeEnum.DRIVER_LEAVE,
    entityId: startedLeave.id,
    titleKey: "DriverLeaveAdded.Title",
  })

  return startedLeave
}
