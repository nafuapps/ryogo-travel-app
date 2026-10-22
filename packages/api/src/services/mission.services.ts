import {
  AgencyStatusEnum,
  EntityTypeEnum,
  InsertMissionType,
  SubscriptionPlanEnum,
} from "@ryogo-travel-app/db/schema"
import { APP_TRIAL_MODE, READ_MISSION_WINDOW_DAYS } from "../apiConfig"
import { agencyRepository } from "../repositories/agency.repo"
import { missionRepository } from "../repositories/mission.repo"
import { ModifyMissionRequestType } from "../types/mission.types"

export const missionServices = {
  async findMissionsByUserId(userId: string) {
    const missions = await missionRepository.readMissionsByUserId(
      userId,
      READ_MISSION_WINDOW_DAYS,
    )
    return missions
  },

  async findRemindersByUserId(userId: string) {
    const reminders = await missionRepository.readCustomMissionsByUserId(userId)
    return reminders
  },

  async findDashboardMissionsByUserId(userId: string) {
    const missions =
      await missionRepository.readUnreadCriticalMissionsByUserId(userId)
    return missions
  },

  async findMissionById(missionId: string) {
    const mission = await missionRepository.readMissionById(missionId)
    return mission
  },

  async addMission(
    mission: InsertMissionType,
    deletePreviousMissions: boolean = true,
  ) {
    const agency = await agencyRepository.readAgencyById(mission.agencyId)
    if (!agency || agency.status === AgencyStatusEnum.SUSPENDED) {
      console.error(`Agency not found or suspended: ${mission.agencyId}`)
      return
    }
    //SUBSCRIPTION CHECK: Only premium agency can create custom reminders
    if (mission.isCustom) {
      if (
        !APP_TRIAL_MODE &&
        (agency.subscriptionPlan === SubscriptionPlanEnum.BASIC ||
          agency.subscriptionExpiresOn < new Date())
      ) {
        console.error(`Basic plan cannot create custom reminders: ${agency.id}`)
        return
      }
    }
    if (deletePreviousMissions) {
      await missionRepository.deleteMissionsByEntityTitleKey({
        agencyId: mission.agencyId,
        entityType: mission.entityType,
        entityId: mission.entityId,
        titleKey: mission.titleKey,
      })
    }
    const [newMission] = await missionRepository.createMission(mission)
    if (!newMission) {
      console.error(`Mission could not be added: ${mission}`)
      return
    }
    return newMission
  },

  async modifyMission(data: ModifyMissionRequestType) {
    const agency = await agencyRepository.readAgencyById(data.agencyId)
    if (!agency || agency.status === AgencyStatusEnum.SUSPENDED) {
      console.error(`Agency not found or suspended: ${data.agencyId}`)
      return
    }

    //SUBSCRIPTION CHECK: Only premium agency can modify custom reminders
    if (
      !APP_TRIAL_MODE &&
      (agency.subscriptionPlan === SubscriptionPlanEnum.BASIC ||
        agency.subscriptionExpiresOn < new Date())
    ) {
      console.error(`Basic plan cannot modify custom reminders: ${agency.id}`)
      return
    }

    const [updatedMission] = await missionRepository.updateMission(data)
    if (!updatedMission) {
      console.error(`Mission could not be updated: ${data}`)
      return
    }
    return updatedMission
  },

  async removeMissionById(missionId: string) {
    const [deletedMission] =
      await missionRepository.deleteMissionById(missionId)
    if (!deletedMission) {
      console.error(`Mission could not be removed: ${missionId}`)
      return
    }
    return deletedMission
  },

  async removePreviousMissionsByEntityTitleKey({
    agencyId,
    entityId,
    entityType,
    titleKey,
  }: {
    agencyId: string
    entityType: EntityTypeEnum
    entityId: string
    titleKey: string
  }) {
    await missionRepository.deleteMissionsByEntityTitleKey({
      agencyId,
      entityType,
      entityId,
      titleKey,
    })
  },

  async removePreviousMissionsByTitleKey({
    agencyId,
    titleKey,
  }: {
    agencyId: string
    titleKey: string
  }) {
    await missionRepository.deleteMissionsByTitleKey({ agencyId, titleKey })
  },

  async removePreviousMissionsByEntityId({
    agencyId,
    entityId,
  }: {
    agencyId: string
    entityId: string
  }) {
    await missionRepository.deleteMissionsByEntityId({ agencyId, entityId })
  },

  async changeIsReadMission({
    missionId,
    isRead,
  }: {
    missionId: string
    isRead: boolean
  }) {
    const [updatedMission] = await missionRepository.updateReadStatus({
      missionId,
      isRead,
    })
    if (!updatedMission) {
      console.error(
        `Mission read status could not be updated: ${missionId} ${isRead}`,
      )
      return
    }
    return updatedMission
  },
}

export type FindMissionsByUserIdType = Awaited<
  ReturnType<typeof missionServices.findMissionsByUserId>
>

export type FindRemindersByUserIdType = Awaited<
  ReturnType<typeof missionServices.findRemindersByUserId>
>

export type FindMissionByIdType = Awaited<
  ReturnType<typeof missionServices.findMissionById>
>
