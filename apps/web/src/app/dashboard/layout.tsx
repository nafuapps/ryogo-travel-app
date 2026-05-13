//Layout for dashboard pages

import { SIDEBAR_COOKIE_NAME, SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import DashboardSidebar from "@/components/sidebar/dashboardSidebar"
import { getCurrentUser, logout } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import {
  SubscriptionPlanEnum,
  UserRolesEnum,
  UserStatusEnum,
} from "@ryogo-travel-app/db/schema"
import CommandCenter from "@/components/command/commandCenter"
import {
  LayoutSectionWrapper,
  LayoutWrapper,
} from "@/components/layout/layoutWrappers"
import { SUBSCRIPTION_REMINDER_DAYS, TRIAL_MODE } from "@/lib/uiConfig"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { differenceInDays } from "date-fns"
import { RyogoCaption } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const sidebarCookie = cookieStore.get(SIDEBAR_COOKIE_NAME)
  const defaultOpen = sidebarCookie ? sidebarCookie.value === "true" : false
  const currentUser = await getCurrentUser()

  // Redirect to auth if the user is not authenticated
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //If suspended, logout user
  if (currentUser.status === UserStatusEnum.SUSPENDED) {
    await logout()
  }

  //Driver
  if (currentUser.userRole === UserRolesEnum.DRIVER) {
    //Go to rider page
    redirect("/rider", RedirectType.replace)
  }

  const isOwner = currentUser.userRole === UserRolesEnum.OWNER

  //New user
  if (currentUser.status === UserStatusEnum.NEW) {
    if (isOwner) {
      if (!currentUser.isVerified) {
        redirect("/onboarding/verify-account", RedirectType.replace)
      }
      //If verified owner, go to vehicle onboarding
      redirect("/onboarding/add-vehicle", RedirectType.replace)
    }
    //Else, go to change-password
    redirect("/onboarding/change-password", RedirectType.replace)
  }

  //Get agency Data
  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  const days = differenceInDays(agency.subscriptionExpiresOn, new Date())

  //Only non-new owner/agent can come to dashboard
  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "241px",
          "--sidebar-width-mobile": "241px",
          "--sidebar-width-icon": "65px",
        } as React.CSSProperties
      }
    >
      <LayoutWrapper id="DashboardLayout">
        <DashboardSidebar isOwner={isOwner} />
        <LayoutSectionWrapper id="DashboardMainSection">
          {!TRIAL_MODE &&
            agency.subscriptionPlan !== SubscriptionPlanEnum.BASIC &&
            days <= SUBSCRIPTION_REMINDER_DAYS && (
              <SubscriptionReminderStrip days={days} isOwner={isOwner} />
            )}
          {children}
          <CommandCenter />
        </LayoutSectionWrapper>
      </LayoutWrapper>
    </SidebarProvider>
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
