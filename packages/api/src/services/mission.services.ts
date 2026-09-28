import { missionRepository } from "../repositories/mission.repo"
import { READ_MISSION_WINDOW_DAYS } from "../apiConfig"
import { EntityTypeEnum, InsertMissionType } from "@ryogo-travel-app/db/schema"
import { ModifyMissionRequestType } from "../types/mission.types"

export const missionServices = {
  async findMissionsByUserId(userId: string) {
    const missions = await missionRepository.readMissionsByUserId(
      userId,
      READ_MISSION_WINDOW_DAYS,
    )
    return missions
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
    if (deletePreviousMissions) {
      await missionRepository.deleteMissionsByEntityTitleKey(
        mission.agencyId,
        mission.entityType,
        mission.entityId,
        mission.titleKey,
      )
    }
    const newMission = await missionRepository.createMission(mission)
    return newMission[0]
  },

  async modifyMission(data: ModifyMissionRequestType) {
    const updatedMission = await missionRepository.updateMission(
      data.missionId,
      data.entityId ? data.entityType : EntityTypeEnum.USER, //If no entity id, default to type User with userId
      data.entityId ?? data.userId,
      data.titleKey,
      data.dueDate,
      data.isCritical,
      data.messageKey,
    )
    return updatedMission[0]
  },

  async removeMissionById(missionId: string) {
    const mission = await missionRepository.deleteMissionById(missionId)
    return mission[0]
  },

  async removePreviousMissionsByEntityTitleKey(
    agencyId: string,
    entityType: EntityTypeEnum,
    entityId: string,
    titleKey: string,
  ) {
    await missionRepository.deleteMissionsByEntityTitleKey(
      agencyId,
      entityType,
      entityId,
      titleKey,
    )
  },

  async removePreviousMissionsByTitleKey(agencyId: string, titleKey: string) {
    await missionRepository.deleteMissionsByTitleKey(agencyId, titleKey)
  },

  async removePreviousMissionsByEntityId(agencyId: string, entityId: string) {
    await missionRepository.deleteMissionsByEntityId(agencyId, entityId)
  },

  async markReadMission(missionId: string) {
    const result = await missionRepository.updateReadStatus(missionId, true)
    return result[0]
  },

  async markUnReadMission(missionId: string) {
    const result = await missionRepository.updateReadStatus(missionId, false)
    return result[0]
  },
}

export type FindMissionsByUserIdType = Awaited<
  ReturnType<typeof missionServices.findMissionsByUserId>
>

export type FindMissionByIdType = Awaited<
  ReturnType<typeof missionServices.findMissionById>
>
