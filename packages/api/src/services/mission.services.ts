import { missionRepository } from "../repositories/mission.repo"
import { MISSION_WINDOW_DAYS } from "../apiConfig"
import { InsertMissionType } from "@ryogo-travel-app/db/schema"

export const missionServices = {
  async findMissionsByUserId(userId: string) {
    const missions = await missionRepository.readMissionsByUserId(
      userId,
      MISSION_WINDOW_DAYS,
    )
    return missions
  },

  async addMission(mission: InsertMissionType) {
    const newMission = await missionRepository.createMission(mission)
    return newMission[0]
  },
}

export type FindMissionsByUserIdType = Awaited<
  ReturnType<typeof missionServices.findMissionsByUserId>
>
