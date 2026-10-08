import { eq, and, or, gte } from "drizzle-orm"
import { db } from "@ryogo-travel-app/db"
import {
  EntityTypeEnum,
  InsertMissionType,
  missions,
} from "@ryogo-travel-app/db/schema"
import { subDays } from "date-fns"
import { ModifyMissionRequestType } from "../types/mission.types"

export const missionRepository = {
  async readMissionsByUserId(userId: string, days: number) {
    return await db.query.missions.findMany({
      orderBy: (missions, { asc }) => [asc(missions.dueDate)],
      where: and(
        eq(missions.userId, userId),
        eq(missions.isCustom, false),
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

  async readCustomMissionsByUserId(userId: string) {
    return await db.query.missions.findMany({
      orderBy: (missions, { asc }) => [asc(missions.dueDate)],
      where: and(eq(missions.userId, userId), eq(missions.isCustom, true)),
    })
  },

  async readUnreadCriticalMissionsByUserId(userId: string) {
    return await db.query.missions.findMany({
      orderBy: (missions, { asc }) => [asc(missions.dueDate)],
      where: and(
        eq(missions.userId, userId),
        and(eq(missions.isRead, false), eq(missions.isCritical, true)),
      ),
    })
  },

  async readMissionById(missionId: string) {
    return await db.query.missions.findFirst({
      where: eq(missions.id, missionId),
    })
  },

  async createMission(mission: InsertMissionType) {
    return await db.insert(missions).values(mission).returning()
  },

  async updateMission({
    missionId,
    entityType,
    entityId,
    dueDate,
    isCritical,
    titleKey,
    messageKey,
  }: ModifyMissionRequestType) {
    return await db
      .update(missions)
      .set({
        entityType,
        entityId,
        titleKey,
        dueDate,
        isCritical,
        messageKey,
      })
      .where(eq(missions.id, missionId))
      .returning()
  },

  async updateReadStatus({
    missionId,
    isRead,
  }: {
    missionId: string
    isRead: boolean
  }) {
    return await db
      .update(missions)
      .set({ isRead })
      .where(eq(missions.id, missionId))
      .returning()
  },

  async deleteMissionById(id: string) {
    return await db
      .delete(missions)
      .where(eq(missions.id, id))
      .returning({ id: missions.id })
  },

  async deleteMissionsByEntityTitleKey({
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

  async deleteMissionsByTitleKey({
    agencyId,
    titleKey,
  }: {
    agencyId: string
    titleKey: string
  }) {
    return await db
      .delete(missions)
      .where(
        and(eq(missions.agencyId, agencyId), eq(missions.titleKey, titleKey)),
      )
  },

  async deleteMissionsByEntityId({
    agencyId,
    entityId,
  }: {
    agencyId: string
    entityId: string
  }) {
    return await db
      .delete(missions)
      .where(
        and(eq(missions.agencyId, agencyId), eq(missions.entityId, entityId)),
      )
  },
}
