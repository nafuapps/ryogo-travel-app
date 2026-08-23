import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "@/components/header/dashboardHeader"
import DashboardHomePageComponent from "./dashboardHome"
import { MainWrapper } from "@/components/page/pageWrappers"
import {
  SUBSCRIPTION_DOWNGRADE_TO_BASIC_GRACE_DAYS,
  SUBSCRIPTION_EXPIRY_REMINDER_DAYS,
  APP_TRIAL_MODE,
} from "@/lib/uiConfig"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { differenceInDays } from "date-fns"
import { RyogoCaption } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  SubscriptionPlanEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { downgradeAgencyToBasicAction } from "@/app/actions/agencies/downgradeAgencyToBasicAction"
import { PREMIUM_TRIAL_DAYS } from "@ryogo-travel-app/api/apiConfig"

export const metadata: Metadata = {
  title: `Dashboard - ${pageTitle}`,
  description: pageDescription,
}

export default async function DashboardHomePage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Get agency Data
  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  if (
    agency.subscriptionPlan !== SubscriptionPlanEnum.BASIC &&
    differenceInDays(new Date(), agency.subscriptionExpiresOn) >
      SUBSCRIPTION_DOWNGRADE_TO_BASIC_GRACE_DAYS
  ) {
    await downgradeAgencyToBasicAction(currentUser.userId, agency.id)
  }

  const days = differenceInDays(agency.subscriptionExpiresOn, new Date())

  const showReminderStrip =
    !APP_TRIAL_MODE &&
    agency.subscriptionPlan !== SubscriptionPlanEnum.BASIC &&
    days <= SUBSCRIPTION_EXPIRY_REMINDER_DAYS

  const showTrialStrip =
    !APP_TRIAL_MODE &&
    agency.subscriptionPlan === SubscriptionPlanEnum.BASIC &&
    !agency.hasTriedSubscription

  return (
    <>
      {showReminderStrip && (
        <SubscriptionReminderStrip
          days={days}
          isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        />
      )}
      {showTrialStrip && (
        <SubscriptionTrialStrip
          isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        />
      )}
      <MainWrapper>
        <DashboardHeader pathName={"/dashboard"} />
        <DashboardHomePageComponent
          agencyId={currentUser.agencyId}
          userId={currentUser.userId}
        />
      </MainWrapper>
    </>
  )
}

async function SubscriptionReminderStrip({
  days,
  isOwner,
}: {
  days: number
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.Home.SubscriptionReminderStrip")

  return (
    <div
      className={`w-full bg-linear-to-r ${days <= 0 ? "from-red-600 to-red-800 dark:from-red-100 dark:to-red-300" : "from-yellow-700 to-yellow-800 dark:from-yellow-200 dark:to-yellow-300"} ${days <= 0 ? "bg-red-700 dark:bg-red-300" : "bg-yellow-700 dark:bg-yellow-300"} ${days <= 0 ? "bg-red-800 dark:bg-red-200" : "bg-yellow-800 dark:bg-yellow-200"} px-5 lg:px-6 py-1 lg:py-1.5 flex items-center justify-between gap-2 lg:gap-3`}
    >
      <RyogoCaption color="white" weight="font-medium">
        {days < 0 ? t("Expired") : t("NotExpired", { days: days })}
      </RyogoCaption>
      {isOwner && (
        <Link href="/dashboard/account/subscription">
          <Button variant={"outline"} size="sm">
            <RyogoCaption color={"white"}>{t("RenewCTA")}</RyogoCaption>
          </Button>
        </Link>
      )}
    </div>
  )
}

async function SubscriptionTrialStrip({ isOwner }: { isOwner: boolean }) {
  const t = await getTranslations("Dashboard.Home.SubscriptionTrialStrip")

  return (
    <div
      className={`w-full bg-linear-to-r from-sky-600 to-sky-800 dark:from-sky-100 dark:to-sky-300 px-5 lg:px-6 py-1 lg:py-1.5 flex items-center justify-between gap-2 lg:gap-3`}
    >
      <RyogoCaption color="white" weight="font-medium">
        {t("TryPremium", { days: PREMIUM_TRIAL_DAYS })}
      </RyogoCaption>
      {isOwner && (
        <Link href="/dashboard/account/subscription">
          <Button variant={"outline"} size="sm">
            <RyogoCaption color={"white"}>{t("TryCTA")}</RyogoCaption>
          </Button>
        </Link>
      )}
    </div>
  )
}
