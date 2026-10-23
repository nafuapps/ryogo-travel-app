import DashboardSidebar from "@/components/sidebar/dashboardSidebar"
import { SIDEBAR_COOKIE_NAME, SidebarProvider } from "@/components/ui/sidebar"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { cookies } from "next/headers"
import { redirect, RedirectType } from "next/navigation"
// import CommandCenter from "@/components/command/commandCenter"
import UserLocationTracker from "@/components/flows/account/userLocationTracker"
import {
  LayoutSectionWrapper,
  LayoutWrapper,
} from "@/components/layout/layoutWrappers"
import { readPermissions } from "@/lib/permissions"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()
  const isOwner = currentUser.userRole === UserRolesEnum.OWNER

  //Driver
  if (currentUser.userRole === UserRolesEnum.DRIVER) {
    //Go to rider page
    redirect("/rider/home", RedirectType.replace)
  }

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

  const cookieStore = await cookies()
  const sidebarCookie = cookieStore.get(SIDEBAR_COOKIE_NAME)
  const defaultOpen = sidebarCookie ? sidebarCookie.value === "true" : false

  //Only non-new owner/agent can come to dashboard
  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "201px",
          // "--sidebar-width-mobile": "201px",
          "--sidebar-width-icon": "65px",
        } as React.CSSProperties
      }
    >
      <LayoutWrapper id="DashboardLayout">
        <DashboardSidebar isOwner={isOwner} />
        <LayoutSectionWrapper id="DashboardMainSection">
          {children}
          {/* <CommandCenter /> */}
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
