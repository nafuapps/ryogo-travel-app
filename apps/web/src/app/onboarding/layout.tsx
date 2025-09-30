//Layout page for onboarding pages

import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function OnboardingHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

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
        className="flex flex-row w-screen h-screen"
      >
        {children}
      </section>
    </SidebarProvider>
  );
}
