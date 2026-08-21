import { SIDEBAR_COOKIE_NAME, SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import RiderSidebar from "@/components/sidebar/riderSidebar"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import {
  LayoutSectionWrapper,
  LayoutWrapper,
} from "@/components/layout/layoutWrappers"
import { logoutAction } from "@/app/actions/users/logoutAction"
import { differenceInHours } from "date-fns"
import { SESSION_COOKIE_REFRESH_HOURS } from "@ryogo-travel-app/api/apiConfig"
import { refreshUserSessionAction } from "@/app/actions/users/refreshUserSessionAction"

export default async function RiderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const sidebarCookie = cookieStore.get(SIDEBAR_COOKIE_NAME)
  const defaultOpen = sidebarCookie ? sidebarCookie.value === "true" : false
  const currentUser = await getCurrentUser()

  //If no user logged in, go to login page
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

  //If not driver, go to dashboard
  if (currentUser.userRole !== UserRolesEnum.DRIVER) {
    redirect("/dashboard", RedirectType.replace)
  }

  //New driver
  if (currentUser.status === UserStatusEnum.NEW) {
    //Go to change-password
    redirect("/onboarding/change-password", RedirectType.replace)
  }

  //Only non-new driver can come to rider pages
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
      <LayoutWrapper id="RiderLayout">
        <RiderSidebar />
        <LayoutSectionWrapper id="RiderMainSection">
          {children}
        </LayoutSectionWrapper>
      </LayoutWrapper>
    </SidebarProvider>
  )
}
