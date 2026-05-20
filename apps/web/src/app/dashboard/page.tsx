//Dashboard home page

import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "@/components/header/dashboardHeader"
import DashboardHomePageComponent from "./dashboardHome"
import { MainWrapper } from "@/components/page/pageWrappers"
import { SUBSCRIPTION_REMINDER_DAYS, TRIAL_MODE } from "@/lib/uiConfig"
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

  const days = differenceInDays(agency.subscriptionExpiresOn, new Date())

  return (
    <>
      {!TRIAL_MODE &&
        agency.subscriptionPlan !== SubscriptionPlanEnum.BASIC &&
        days <= SUBSCRIPTION_REMINDER_DAYS && (
          <SubscriptionReminderStrip
            days={days}
            isOwner={currentUser.userRole === UserRolesEnum.OWNER}
          />
        )}
      <MainWrapper>
        <DashboardHeader pathName={"/dashboard"} />
        <DashboardHomePageComponent agencyId={currentUser.agencyId} />
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
  const t = await getTranslations("Dashboard.SubscriptionReminderStrip")

  return (
    <div
      className={`w-full ${days <= 0 ? "bg-red-900" : "bg-yellow-900"} px-4 lg:px-5 py-1 lg:py-1.5 flex items-center justify-between gap-2 lg:gap-3`}
    >
      <RyogoCaption color="white" weight="font-medium">
        {days < 0 ? t("Expired") : t("NotExpired", { days: days })}
      </RyogoCaption>
      {isOwner && (
        <Link href="/dashboard/account/subscription">
          <Button variant={"secondary"} size="sm">
            <RyogoCaption color={"slate"} weight="font-medium">
              {t("RenewCTA")}
            </RyogoCaption>
          </Button>
        </Link>
      )}
    </div>
  )
}
