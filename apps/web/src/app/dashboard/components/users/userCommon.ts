import { UserStatusEnum } from "@ryogo-travel-app/db/schema"

export const getUserStatusColor = (status: UserStatusEnum) => {
  if (status === UserStatusEnum.ACTIVE) {
    return "bg-green-200"
  }
  if (status === UserStatusEnum.NEW) {
    return "bg-amber-200"
  }
  return "bg-slate-200"
}
