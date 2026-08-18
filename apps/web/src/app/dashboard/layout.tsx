import { SIDEBAR_COOKIE_NAME, SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import DashboardSidebar from "@/components/sidebar/dashboardSidebar"
import { getCurrentUser, logout, updateCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import {
  AgencyStatusEnum,
  UserRolesEnum,
  UserStatusEnum,
} from "@ryogo-travel-app/db/schema"
// import CommandCenter from "@/components/command/commandCenter"
import {
  LayoutSectionWrapper,
  LayoutWrapper,
} from "@/components/layout/layoutWrappers"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"

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
  await updateCurrentUser()

  //If suspended, logout user
  if (currentUser.status === UserStatusEnum.SUSPENDED) {
    await logout()
  }

  //Driver
  if (currentUser.userRole === UserRolesEnum.DRIVER) {
    //Go to rider page
    redirect("/rider", RedirectType.replace)
  }

  //Get agency Data
  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  const isOwner = currentUser.userRole === UserRolesEnum.OWNER

  //New user
  if (currentUser.status === UserStatusEnum.NEW) {
    if (isOwner) {
      if (!currentUser.isVerified) {
        //This is the first owner and agency which are being onboarded
        if (agency.status === AgencyStatusEnum.NEW) {
          redirect("/onboarding/verify-account", RedirectType.replace)
        }
        //This is an added owner to an active agency, go for password change
        redirect("/onboarding/change-password", RedirectType.replace)
      }
      redirect("/onboarding/add-vehicle", RedirectType.replace)
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
