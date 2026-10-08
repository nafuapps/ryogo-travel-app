import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export type AddMissionRequestType = {
  userId: string
  agencyId: string
  entityType: EntityTypeEnum
  entityId?: string
  title: string
  message?: string
  dueDate: Date
  isCritical: boolean
}

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
