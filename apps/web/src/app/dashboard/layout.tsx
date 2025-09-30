//Layout for dashboard pages

import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import DashboardSidebar from "./dashboardSidebar";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const currentUser = await getCurrentUser();

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
      <main
        id="DashboardMainLayout"
        className="flex flex-row w-screen h-screen"
      >
        <DashboardSidebar isOwner={currentUser?.userRole === "owner"} />
        <section>{children}</section>;
      </main>
    </SidebarProvider>
  );
}
