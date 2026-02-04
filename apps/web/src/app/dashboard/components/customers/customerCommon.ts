import { CustomerStatusEnum } from "@ryogo-travel-app/db/schema"

export const getCustomerStatusColor = (status: CustomerStatusEnum) => {
  if (status === CustomerStatusEnum.ACTIVE) {
    return "bg-green-200"
  }
  return "bg-slate-200"
}
