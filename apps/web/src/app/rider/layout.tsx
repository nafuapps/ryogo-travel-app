//Layout for Rider pages

import { SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import RiderHeader from "./components/riderHeader"
import RiderSidebar from "./components/riderSidebar"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"

export default async function RiderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  const currentUser = await getCurrentUser()

  //If no user logged in, go to login page
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //New user
  if (currentUser?.status == UserStatusEnum.NEW) {
    if (currentUser?.userRole == UserRolesEnum.OWNER) {
      //If owner, go to vehicle onboarding
      redirect("/onboarding/add-vehicle", RedirectType.replace)
    }
    //Else, go to change-password
    redirect("/onboarding/change-password", RedirectType.replace)
  }

  if (currentUser?.userRole != UserRolesEnum.DRIVER) {
    //If not driver, go to dashboard
    redirect("/dashboard", RedirectType.replace)
  }

  //Only old driver can come to rider pages
  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "261px",
          "--sidebar-width-icon": "65px",
          "--sidebar-width-mobile": "261px",
        } as React.CSSProperties
      }
    >
      <main id="RiderLayout" className="flex flex-row w-screen h-dvh">
        <RiderSidebar />
        <section id="RiderMainSection" className="flex flex-row w-full h-dvh">
          <div className="flex flex-col w-full h-dvh bg-slate-50 p-4 lg:p-5">
            <RiderHeader />
            {children}
          </div>
        </section>
      </main>
    </SidebarProvider>
  )
}
