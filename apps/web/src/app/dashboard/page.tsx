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
import {
  SubscriptionPlanEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { downgradeAgencyToBasicAction } from "@/app/actions/agencies/downgradeAgencyToBasicAction"
import { PREMIUM_TRIAL_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

export const metadata: Metadata = {
  title: `Dashboard - ${pageTitle}`,
  description: pageDescription,
}

export default async function DashboardHomePage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const isOwner = currentUser.userRole === UserRolesEnum.OWNER

  //Get agency Data
  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  const isBasic = agency.subscriptionPlan === SubscriptionPlanEnum.BASIC

  const daysToExpiry = differenceInDays(
    agency.subscriptionExpiresOn,
    new Date(),
  )

  if (
    !isBasic &&
    daysToExpiry + SUBSCRIPTION_DOWNGRADE_TO_BASIC_GRACE_DAYS < 0
  ) {
    await downgradeAgencyToBasicAction(currentUser.userId, agency.id)
  }

  //Subscribed agency which is about to expire, show reminder strip
  const showReminderStrip =
    !APP_TRIAL_MODE &&
    !isBasic &&
    daysToExpiry <= SUBSCRIPTION_EXPIRY_REMINDER_DAYS

  //Basic agency which has not tried premium, show trial strip
  const showTrialStrip =
    !APP_TRIAL_MODE && isBasic && !agency.hasTriedSubscription

  return (
    <>
      {showReminderStrip && (
        <SubscriptionReminderStrip days={daysToExpiry} isOwner={isOwner} />
      )}
      {showTrialStrip && <SubscriptionTrialStrip isOwner={isOwner} />}
      <MainWrapper>
        <DashboardHeader pathName={"/dashboard"} />
        <DashboardHomePageComponent
          agencyId={currentUser.agencyId}
          userId={currentUser.userId}
          isOwner={isOwner}
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
      className={`w-full bg-linear-to-r ${days <= 0 ? "from-red-600 to-red-800 dark:from-red-200 dark:to-red-300" : "from-yellow-600 to-yellow-800 dark:from-yellow-200 dark:to-yellow-300"} ${days <= 0 ? "bg-red-700 dark:bg-red-300" : "bg-yellow-700 dark:bg-yellow-300"} ${days <= 0 ? "bg-red-800 dark:bg-red-200" : "bg-yellow-800 dark:bg-yellow-200"} px-5 lg:px-6 py-1 lg:py-1.5 flex items-center justify-between gap-2 lg:gap-3`}
    >
      <RyogoCaption color="white" weight="font-medium">
        {days < 0 ? t("Expired") : t("NotExpired", { days: days })}
      </RyogoCaption>
      {isOwner && (
        <Link href="/dashboard/account/subscription">
          <RyogoOutlineButton label={t("RenewCTA")} labelColor="white" />
        </Link>
      )}
    </div>
  )
}

async function SubscriptionTrialStrip({ isOwner }: { isOwner: boolean }) {
  const t = await getTranslations("Dashboard.Home.SubscriptionTrialStrip")

  return (
    <div
      className={`w-full bg-linear-to-r from-sky-600 to-sky-800 dark:from-sky-200 dark:to-sky-300 px-5 lg:px-6 py-1 lg:py-1.5 flex items-center justify-between gap-2 lg:gap-3`}
    >
      <RyogoCaption color="white" weight="font-medium">
        {t("TryPremium", { days: PREMIUM_TRIAL_DAYS })}
      </RyogoCaption>
      {isOwner && (
        <Link href="/dashboard/account/subscription">
          <RyogoOutlineButton label={t("TryCTA")} labelColor="white" />
        </Link>
      )}
    </div>
  )
}
