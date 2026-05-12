import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { getTranslations } from "next-intl/server"

export default async function SubscriptionPageComponent({
  userDetails,
  agencyDetails,
}: {
  userDetails: NonNullable<FindUserDetailsByIdType>
  agencyDetails: NonNullable<FindAgencyByIdType>
}) {
  const t = await getTranslations("Dashboard.AccountSubscription")

  return <div></div>
}
