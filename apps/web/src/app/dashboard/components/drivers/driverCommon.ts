import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"

export const getDriverStatusColor = (status: DriverStatusEnum) => {
  if (status == DriverStatusEnum.AVAILABLE) {
    return "bg-green-200"
  }
  if (status == DriverStatusEnum.LEAVE) {
    return "bg-yellow-200"
  }
  if (status == DriverStatusEnum.INACTIVE) {
    return "bg-red-200"
  }
  return "bg-slate-200"
}
