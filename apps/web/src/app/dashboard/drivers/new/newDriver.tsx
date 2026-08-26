import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import NewDriverForm from "./newDriverForm"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import {
  SubscriptionPlanEnum,
  UserRolesEnum,
  UserStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { BASIC_PLAN_DRIVER_LIMIT, APP_TRIAL_MODE } from "@/lib/uiConfig"
import { RyogoH4, RyogoSmall } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { Hourglass } from "lucide-react"
import Link from "next/link"
import { RyogoBrandButton } from "@/components/buttons/ryogoButtons"

export default async function NewDriverPageComponent({
  agencyId,
  isOwner,
}: {
  agencyId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.NewDriver")

  const allDriverUsers = await userServices.findAllUsersByRole([
    UserRolesEnum.DRIVER,
  ])

  const agency = await agencyServices.findAgencyById(agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }
  const isBasic = agency.subscriptionPlan === SubscriptionPlanEnum.BASIC

  const currentDriverUsers = allDriverUsers.filter(
    (driver) =>
      driver.agencyId === agencyId &&
      driver.status !== UserStatusEnum.SUSPENDED,
  ).length

  //Only allow subscribed agencies to add more than X drivers
  if (
    !APP_TRIAL_MODE &&
    currentDriverUsers >= BASIC_PLAN_DRIVER_LIMIT &&
    (isBasic || agency.subscriptionExpiresOn < new Date())
  ) {
    return (
      <PageWrapper id="NewDriverPage">
        <SectionWrapper id="DriverLimitSection" center>
          <RyogoEnclosedIcon
            icon={Hourglass}
            size="md"
            color="yellow"
            bgColor="yellow"
          />
          <RyogoSmall color="yellow">
            {isBasic ? t("TrialWarning") : t("ExpiredWarning")}
          </RyogoSmall>
          <RyogoH4>{isBasic ? t("TrialAction") : t("ExpiredAction")}</RyogoH4>
          {isOwner && (
            <Link href="/dashboard/account/subscription">
              <RyogoBrandButton
                size="lg"
                label={
                  isBasic
                    ? agency.hasTriedSubscription
                      ? t("BuyCTA")
                      : t("TryCTA")
                    : t("RenewCTA")
                }
              />
            </Link>
          )}
        </SectionWrapper>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper id="NewDriverPage">
      <NewDriverForm
        agencyId={agencyId}
        allDrivers={allDriverUsers}
        agencyName={agency.businessName}
      />
    </PageWrapper>
  )
}
