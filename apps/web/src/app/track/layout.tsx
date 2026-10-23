import {
  LayoutSectionWrapper,
  LayoutWrapper,
} from "@/components/layout/layoutWrappers"
import TrackSidebar from "@/components/sidebar/trackSidebar"
import { SIDEBAR_COOKIE_NAME, SidebarProvider } from "@/components/ui/sidebar"
import { readPermissions } from "@/lib/permissions"
import { cookies } from "next/headers"

export default async function TrackingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await readPermissions.redirectIfAuthenticated()

  const cookieStore = await cookies()
  const sidebarCookie = cookieStore.get(SIDEBAR_COOKIE_NAME)
  const defaultOpen = sidebarCookie ? sidebarCookie.value === "true" : false

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
      <LayoutWrapper id="TrackLayout">
        <TrackSidebar />
        <LayoutSectionWrapper id="TrackMainSection">
          {children}
        </LayoutSectionWrapper>
      </LayoutWrapper>
    </SidebarProvider>
  )
}
