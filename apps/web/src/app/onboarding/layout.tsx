//Layout page for onboarding pages

import { SidebarProvider } from "@/components/ui/sidebar";

export default function OnboardingHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <section
        id="OnboardingMainLayout"
        className="flex flex-row w-screen h-screen"
      >
        {children}
      </section>
    </SidebarProvider>
  );
}
