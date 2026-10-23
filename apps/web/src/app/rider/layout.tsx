import UserLocationTracker from "@/components/flows/account/userLocationTracker"
import {
  LayoutSectionWrapper,
  LayoutWrapper,
} from "@/components/layout/layoutWrappers"
import RiderSidebar from "@/components/sidebar/riderSidebar"
import { SIDEBAR_COOKIE_NAME, SidebarProvider } from "@/components/ui/sidebar"
import { readPermissions } from "@/lib/permissions"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { cookies } from "next/headers"
import { redirect, RedirectType } from "next/navigation"

export default async function RiderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  //If not driver, go to dashboard
  if (currentUser.userRole !== UserRolesEnum.DRIVER) {
    redirect("/dashboard/home", RedirectType.replace)
  }

  //New driver
  if (currentUser.status === UserStatusEnum.NEW) {
    //Go to change-password
    redirect("/onboarding/change-password", RedirectType.replace)
  }

  const cookieStore = await cookies()
  const sidebarCookie = cookieStore.get(SIDEBAR_COOKIE_NAME)
  const defaultOpen = sidebarCookie ? sidebarCookie.value === "true" : false

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
        <UserLocationTracker
          userId={currentUser.userId}
          agencyId={currentUser.agencyId}
          locatedAt={currentUser.locatedAt}
        />
      </LayoutWrapper>
    </SidebarProvider>
  )
}
