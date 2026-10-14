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

import BuySubscriptionComponent from "@/components/flows/susbcription/buySubscription"
import TryPremiumComponent from "@/components/flows/susbcription/tryPremium"
import PlanExpiryDetails from "@/components/flows/susbcription/planExpiryDetails"
import PremiumNudge from "@/components/flows/susbcription/premiumNudge"
import PlanUsageCard from "@/components/flows/susbcription/planUsageCard"
import CurrentPlanDetails from "@/components/flows/susbcription/currentPlanDetails"
import PremiumAdvantageSection from "@/components/flows/susbcription/premiumAdvantageSection"

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

  const isBasic = agencyDetails.subscriptionPlan === SubscriptionPlanEnum.BASIC
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
          isBasic={isBasic}
          isOwner={isOwner}
          subscriptionPlan={agencyDetails.subscriptionPlan}
          lastPaidPlan={lastOrderType}
        />
        {isBasic ? (
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
      {(isBasic || daysToExpiry < 0) && (
        <PlanUsageCard
          agencyData={agencyData}
          confirmedBookingsLength={confirmedBookingsLength}
          isBasic={isBasic}
          daysToExpiry={daysToExpiry}
        />
      )}
      <Separator />
      {isOwner &&
        (isBasic || needExpiryReminder) &&
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
