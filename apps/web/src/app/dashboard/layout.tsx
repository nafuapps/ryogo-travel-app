//Layout for dashboard pages

import { SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import DashboardSidebar from "./components/extra/dashboardSidebar"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  const currentUser = await getCurrentUser()

  // Redirect to auth if the user is not authenticated
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //New user
  if (currentUser.status == UserStatusEnum.NEW) {
    if (currentUser.userRole == UserRolesEnum.OWNER) {
      //If owner, go to vehicle onboarding
      redirect("/onboarding/add-vehicle", RedirectType.replace)
    }
    //Else, go to change-password
    redirect("/onboarding/change-password", RedirectType.replace)
  }

  //Old user
  if (currentUser.userRole == UserRolesEnum.DRIVER) {
    //If old driver, go to rider page
    redirect("/rider", RedirectType.replace)
  }

  //Only old owner/agent can come to dashboard
  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "261px",
          "--sidebar-width-mobile": "261px",
          "--sidebar-width-icon": "65px",
        } as React.CSSProperties
      }
    >
      <main id="DashboardLayout" className="flex flex-row w-screen h-dvh">
        <DashboardSidebar
          isOwner={currentUser.userRole == UserRolesEnum.OWNER}
        />
        <section
          id="DashboardMainSection"
          className="flex flex-row w-full h-dvh"
        >
          {children}
        </section>
      </main>
    </SidebarProvider>
  )
}
