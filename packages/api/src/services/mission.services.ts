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

  async addMission(mission: InsertMissionType) {
    await missionRepository.deleteMissionsByEntityKey(
      mission.agencyId,
      mission.entityType,
      mission.entityId,
      mission.titleKey,
    )
    const newMission = await missionRepository.createMission(mission)
    return newMission[0]
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
}

export type FindMissionsByUserIdType = Awaited<
  ReturnType<typeof missionServices.findMissionsByUserId>
>
