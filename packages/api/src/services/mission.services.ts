import { missionRepository } from "../repositories/mission.repo"
import { MISSION_WINDOW_DAYS } from "../apiConfig"
import { EntityTypeEnum, InsertMissionType } from "@ryogo-travel-app/db/schema"

export const missionServices = {
  async findMissionsByUserId(userId: string) {
    const missions = await missionRepository.readMissionsByUserId(
      userId,
      MISSION_WINDOW_DAYS,
    )
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
      await missionRepository.deleteMissionsByEntityKey(
        mission.agencyId,
        mission.entityType,
        mission.entityId,
        mission.titleKey,
      )
    }
    const newMission = await missionRepository.createMission(mission)
    return newMission[0]
  },

  async modifyMission(
    missionId: string,
    entityType: EntityTypeEnum,
    entityId: string,
    titleKey: string,
    dueDate: Date,
    isCritical: boolean,
    messageKey?: string,
  ) {
    const updatedMission = await missionRepository.updateMission(
      missionId,
      entityType,
      entityId,
      titleKey,
      dueDate,
      isCritical,
      messageKey,
    )
    return updatedMission[0]
  },

  async removeMission(missionId: string) {
    const mission = await missionRepository.deleteMissionById(missionId)
    return mission[0]
  },

  async removePreviousMissionsByEntityKey(
    agencyId: string,
    entityType: EntityTypeEnum,
    entityId: string,
    titleKey: string,
  ) {
    await missionRepository.deleteMissionsByEntityKey(
      agencyId,
      entityType,
      entityId,
      titleKey,
    )
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
