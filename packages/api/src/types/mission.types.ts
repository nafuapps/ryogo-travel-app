import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export type ModifyMissionRequestType = {
  missionId: string
  userId: string
  agencyId: string
  entityType: EntityTypeEnum
  titleKey: string
  dueDate: Date
  isCritical: boolean
  entityId?: string
  messageKey?: string
}
