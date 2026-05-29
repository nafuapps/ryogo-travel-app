import { eq, and, or, gte } from "drizzle-orm"
import { db } from "@ryogo-travel-app/db"
import {
  EntityTypeEnum,
  InsertMissionType,
  missions,
} from "@ryogo-travel-app/db/schema"
import { subDays } from "date-fns"

export const missionRepository = {
  async readMissionsByUserId(userId: string, days: number) {
    return await db.query.missions.findMany({
      orderBy: (missions, { desc }) => [desc(missions.updatedAt)],
      where: and(
        eq(missions.userId, userId),
        or(
          eq(missions.isRead, false),
          and(
            eq(missions.isRead, true),
            gte(missions.updatedAt, subDays(new Date(), days)),
          ),
        ),
      ),
    })
  },

  async createMission(mission: InsertMissionType) {
    return await db.insert(missions).values(mission).returning()
  },

  async updateReadStatus(missionId: string, isRead: boolean) {
    return await db
      .update(missions)
      .set({ isRead })
      .where(eq(missions.id, missionId))
      .returning()
  },

  async deleteMissionsByEntityKey(
    agencyId: string,
    entityType: EntityTypeEnum,
    entityId: string,
    titleKey: string,
  ) {
    return await db
      .delete(missions)
      .where(
        and(
          eq(missions.agencyId, agencyId),
          eq(missions.entityType, entityType),
          eq(missions.entityId, entityId),
          eq(missions.titleKey, titleKey),
        ),
      )
  },
}
