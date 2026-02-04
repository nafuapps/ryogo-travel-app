//Layout page for onboarding pages

import { SIDEBAR_COOKIE_NAME, SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"

export default async function OnboardingHomeLayout({
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
      <section
        id="OnboardingMainLayout"
        className="flex flex-row w-screen h-dvh"
      >
        {children}
      </section>
    </SidebarProvider>
  )
}
