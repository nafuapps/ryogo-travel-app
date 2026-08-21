import { SIDEBAR_COOKIE_NAME, SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import DashboardSidebar from "@/components/sidebar/dashboardSidebar"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
// import CommandCenter from "@/components/command/commandCenter"
import {
  LayoutSectionWrapper,
  LayoutWrapper,
} from "@/components/layout/layoutWrappers"
import { logoutAction } from "@/app/actions/users/logoutAction"
import { differenceInHours } from "date-fns"
import { SESSION_COOKIE_REFRESH_HOURS } from "@ryogo-travel-app/api/apiConfig"
import { refreshUserSessionAction } from "@/app/actions/users/refreshUserSessionAction"

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

  //Update current user session cookie from DB every X hours
  if (
    differenceInHours(new Date(), currentUser.updatedAt) >=
    SESSION_COOKIE_REFRESH_HOURS
  ) {
    await refreshUserSessionAction()
  }
  //If suspended, logout user
  if (currentUser.status === UserStatusEnum.SUSPENDED) {
    await logoutAction()
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
      //This is the creator owner, need to verify and continue onboarding
      if (currentUser.isAdmin) {
        if (!currentUser.isVerified) {
          redirect("/onboarding/verify-account", RedirectType.replace)
        }
        redirect("/onboarding/add-vehicle", RedirectType.replace)
      }
      //Otherwise, it is an added owner, need to change password
      if (!currentUser.isVerified) {
        redirect("/onboarding/change-password", RedirectType.replace)
      }
    } else {
      //Else, go to change-password
      redirect("/onboarding/change-password", RedirectType.replace)
    }
  }

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
          {children}
          {/* //TODO <CommandCenter /> */}
        </LayoutSectionWrapper>
      </LayoutWrapper>
    </SidebarProvider>
  )
}
