import BuySubscriptionComponent from "@/components/flows/susbcription/buySubscription"
import CurrentPlanDetails from "@/components/flows/susbcription/currentPlanDetails"
import PlanExpiryDetails from "@/components/flows/susbcription/planExpiryDetails"
import PlanUsageCard from "@/components/flows/susbcription/planUsageCard"
import PremiumAdvantageSection from "@/components/flows/susbcription/premiumAdvantageSection"
import PremiumNudge from "@/components/flows/susbcription/premiumNudge"
import TryPremiumComponent from "@/components/flows/susbcription/tryPremium"
import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import { Separator } from "@/components/ui/separator"
import { SUBSCRIPTION_EXPIRY_REMINDER_DAYS } from "@/lib/uiConfig"
import {
  FindAgencyByIdType,
  FindAgencyDataType,
} from "@ryogo-travel-app/api/services/agency.services"
import { FindLastPaidOrderType } from "@ryogo-travel-app/api/services/order.services"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import {
  SubscriptionPlanEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { differenceInDays } from "date-fns"

export default async function SubscriptionPageComponent({
  userDetails,
  agencyDetails,
  agencyData,
  confirmedBookingsLength,
  lastPaidOrder,
}: {
  userDetails: NonNullable<FindUserDetailsByIdType>
  agencyDetails: NonNullable<FindAgencyByIdType>
  agencyData: FindAgencyDataType
  confirmedBookingsLength: number
  lastPaidOrder: FindLastPaidOrderType
}) {
  const isOwner = userDetails.userRole === UserRolesEnum.OWNER

  const isSubscribed =
    agencyDetails.subscriptionPlan !== SubscriptionPlanEnum.BASIC
  const daysToExpiry = differenceInDays(
    agencyDetails.subscriptionExpiresOn,
    new Date(),
  )
  const lastOrderType = lastPaidOrder?.orderType
  const needExpiryReminder = daysToExpiry <= SUBSCRIPTION_EXPIRY_REMINDER_DAYS

  return (
    <PageWrapper id="AccountSubscriptionPage">
      <SectionWrapper id="AccountSubscriptionInfo" className="lg:flex-row">
        <CurrentPlanDetails
          isSubscribed={isSubscribed}
          isOwner={isOwner}
          subscriptionPlan={agencyDetails.subscriptionPlan}
          lastPaidPlan={lastOrderType}
        />
        {!isSubscribed ? (
          isOwner ? (
            <PremiumNudge
              userDetails={userDetails}
              agencyDetails={agencyDetails}
              lastOrderType={lastOrderType}
            />
          ) : null
        ) : (
          <PlanExpiryDetails
            userDetails={userDetails}
            agencyDetails={agencyDetails}
            lastOrderType={lastOrderType}
          />
        )}
      </SectionWrapper>
      {(!isSubscribed || daysToExpiry < 0) && (
        <PlanUsageCard
          agencyData={agencyData}
          confirmedBookingsLength={confirmedBookingsLength}
          isSubscribed={isSubscribed}
          daysToExpiry={daysToExpiry}
        />
      )}
      <Separator />
      {isOwner &&
        (!isSubscribed || needExpiryReminder) &&
        (agencyDetails.hasTriedSubscription ? (
          <BuySubscriptionComponent userDetails={userDetails} />
        ) : (
          <TryPremiumComponent
            agencyId={agencyDetails.id}
            userId={userDetails.id}
          />
        ))}
      <PremiumAdvantageSection />
    </PageWrapper>
  )
}
