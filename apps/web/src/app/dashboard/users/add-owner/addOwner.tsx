import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"
import { APP_TRIAL_MODE } from "@/lib/uiConfig"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoSmall, RyogoH4, RyogoCaption } from "@/components/typography"
import { Hourglass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import AddOwnerForm from "./addOwnerForm"

export default async function AddOwnerPageComponent({
  agency,
}: {
  agency: NonNullable<FindAgencyByIdType>
}) {
  const t = await getTranslations("Dashboard.AddOwner")

  //SUBSCRIPTION BLOCKER: Only Premium agencies can add more owners
  if (
    !APP_TRIAL_MODE &&
    (agency.subscriptionPlan === SubscriptionPlanEnum.BASIC ||
      agency.subscriptionExpiresOn < new Date())
  ) {
    return (
      <PageWrapper id="AddOwnerPage">
        <SectionWrapper id="OwnerLimitSection" center>
          <RyogoEnclosedIcon
            icon={Hourglass}
            size="md"
            color="yellow"
            bgColor="yellow"
          />
          <RyogoSmall color="yellow">
            {agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
              ? t("TrialWarning")
              : t("ExpiredWarning")}
          </RyogoSmall>
          <RyogoH4>
            {agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
              ? t("TrialAction")
              : t("ExpiredAction")}
          </RyogoH4>
          <Link href="/dashboard/account/subscription">
            <Button variant={"brand"} size="lg">
              <RyogoCaption color="white">
                {agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
                  ? agency.hasTriedSubscription
                    ? t("BuyCTA")
                    : t("TryCTA")
                  : t("RenewCTA")}
              </RyogoCaption>
            </Button>
          </Link>
        </SectionWrapper>
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
