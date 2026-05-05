//Layout page for onboarding pages

import { LayoutWrapper } from "@/components/bookings/layout/layoutWrappers"
import { SIDEBAR_COOKIE_NAME, SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const sidebarCookie = cookieStore.get(SIDEBAR_COOKIE_NAME)
  const defaultOpen = sidebarCookie ? sidebarCookie.value === "true" : false
  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "50vw",
        } as React.CSSProperties
      }
    >
      <LayoutWrapper id="OnboardingLayout">{children}</LayoutWrapper>
    </SidebarProvider>
  )
}
