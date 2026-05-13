import PaymentButton from "@/components/flows/susbcription/paymentButton"
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

  return (
    <div className="h-full w-full flex items-center justify-center">
      <PaymentButton
        agencyId={agencyDetails.id}
        amount={1}
        ownerName={userDetails.name}
        ownerEmail={userDetails.email}
        ownerPhone={userDetails.phone}
      />
    </div>
  )
}
