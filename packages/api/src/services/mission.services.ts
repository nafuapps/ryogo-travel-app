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
      await missionRepository.deleteMissionsByEntityTitleKey({
        agencyId: mission.agencyId,
        entityType: mission.entityType,
        entityId: mission.entityId,
        titleKey: mission.titleKey,
      })
    }
    const [newMission] = await missionRepository.createMission(mission)
    return newMission
  },

  async modifyMission(data: ModifyMissionRequestType) {
    const [updatedMission] = await missionRepository.updateMission({
      ...data,
      entityType: data.entityId ? data.entityType : EntityTypeEnum.USER, //If no entity id, default to type User with userId
      entityId: data.entityId ?? data.userId,
    })
    return updatedMission
  },

  async removeMissionById(missionId: string) {
    const [deletedMission] =
      await missionRepository.deleteMissionById(missionId)
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

  async markReadMission(missionId: string) {
    const [updatedMission] = await missionRepository.updateReadStatus({
      missionId,
      isRead: true,
    })
    return updatedMission
  },

  async markUnReadMission(missionId: string) {
    const [updatedMission] = await missionRepository.updateReadStatus({
      missionId,
      isRead: false,
    })
    return updatedMission
  },
}

export type FindMissionsByUserIdType = Awaited<
  ReturnType<typeof missionServices.findMissionsByUserId>
>

export type FindMissionByIdType = Awaited<
  ReturnType<typeof missionServices.findMissionById>
>
