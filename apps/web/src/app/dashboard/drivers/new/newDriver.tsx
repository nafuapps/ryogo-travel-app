import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"
import { PageWrapper } from "@/components/page/pageWrappers"
import {
  APP_TRIAL_MODE,
  BASIC_PLAN_DRIVER_LIMIT,
} from "@ryogo-travel-app/api/apiConfig"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import NewDriverForm from "./newDriverForm"

export default async function NewDriverPageComponent({
  agencyId,
  userId,
  isOwner,
  isSubscribed,
  hasTriedSubscription,
  subscriptionExpiresOn,
}: {
  agencyId: string
  userId: string
  isOwner: boolean
  isSubscribed: boolean
  hasTriedSubscription: boolean
  subscriptionExpiresOn: Date
}) {
  const t = await getTranslations("Dashboard.NewDriver")

  const allDriverUsers = await userServices.findAllUsersByRole([
    UserRolesEnum.DRIVER,
  ])

  const currentDriverUsers = allDriverUsers.filter(
    (driver) =>
      driver.agencyId === agencyId &&
      driver.status !== UserStatusEnum.SUSPENDED,
  ).length

  //SUBSCRIPTION BLOCKER: Only allow subscribed agencies to add more than X drivers
  if (
    !APP_TRIAL_MODE &&
    currentDriverUsers >= BASIC_PLAN_DRIVER_LIMIT &&
    (!isSubscribed || subscriptionExpiresOn < new Date())
  ) {
    return (
      <PageWrapper id="NewDriverPage">
        <SubscriptionBlockerSection
          warningText={!isSubscribed ? t("TrialWarning") : t("ExpiredWarning")}
          actionText={!isSubscribed ? t("TrialAction") : t("ExpiredAction")}
          isOwner={isOwner}
          ctaLabel={
            !isSubscribed
              ? hasTriedSubscription
                ? t("BuyCTA")
                : t("TryCTA")
              : t("RenewCTA")
          }
        />
      </PageWrapper>
    )
  }

  const agency = await agencyServices.findAgencyById(agencyId)
  if (!agency) {
    notFound()
  }

  return (
    <NewDriverForm
      agencyId={agencyId}
      userId={userId}
      allDrivers={allDriverUsers}
      agencyName={agency.businessName}
    />
  )
}
