import { PageWrapper } from "@/components/page/pageWrappers"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"
import { APP_TRIAL_MODE } from "@/lib/uiConfig"
import { getTranslations } from "next-intl/server"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import AddOwnerForm from "./addOwnerForm"
import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"

export default async function AddOwnerPageComponent({
  agency,
}: {
  agency: NonNullable<FindAgencyByIdType>
}) {
  const t = await getTranslations("Dashboard.AddOwner")

  const isBasic = agency.subscriptionPlan === SubscriptionPlanEnum.BASIC

  //SUBSCRIPTION BLOCKER: Only Premium agencies can add more owners
  if (
    !APP_TRIAL_MODE &&
    (isBasic || agency.subscriptionExpiresOn < new Date())
  ) {
    return (
      <PageWrapper id="AddOwnerPage">
        <SubscriptionBlockerSection
          warningText={isBasic ? t("TrialWarning") : t("ExpiredWarning")}
          actionText={isBasic ? t("TrialAction") : t("ExpiredAction")}
          isOwner
          ctaLabel={
            isBasic
              ? agency.hasTriedSubscription
                ? t("BuyCTA")
                : t("TryCTA")
              : t("RenewCTA")
          }
        />
      </PageWrapper>
    )
  }

  const allOwners = await userServices.findAllUsersByRole([UserRolesEnum.OWNER])

  return (
    <PageWrapper id="AddOwnerPage">
      <AddOwnerForm
        allOwners={allOwners}
        agencyId={agency.id}
        agencyName={agency.businessName}
      />
    </PageWrapper>
  )
}
