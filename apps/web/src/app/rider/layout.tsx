//Layout for Rider pages

import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import RiderSidebar from "./riderSidebar";

export default async function RiderLayout({
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
          "--sidebar-width": "321px",
          "--sidebar-width-icon": "65px",
          "--sidebar-width-mobile": "321px",
        } as React.CSSProperties
      }
    >
      <main id="RiderMainLayout" className="flex flex-row w-screen h-screen">
        <RiderSidebar />
        <section>{children}</section>;
      </main>
    </SidebarProvider>
  );
}
