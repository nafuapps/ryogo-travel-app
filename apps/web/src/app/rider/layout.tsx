//Layout for Rider pages

import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import RiderHeader from "./components/riderHeader";
import RiderSidebar from "./components/riderSidebar";
import { getCurrentUser } from "@/lib/auth";
import { redirect, RedirectType } from "next/navigation";

export default async function RiderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const currentUser = await getCurrentUser();

  //If no user logged in, go to login page
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace);
  }

  //New user
  if (currentUser?.status == "new") {
    if (currentUser?.userRole == "owner") {
      //If owner, go to vehicle onboarding
      redirect("/onboarding/add-vehicle", RedirectType.replace);
    }
    //Else, go to change-password
    redirect("/onboarding/change-password", RedirectType.replace);
  }

  if (currentUser?.userRole != "driver") {
    //If not driver, go to dashboard
    redirect("/dashboard", RedirectType.replace);
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
      <main id="DashboardLayout" className="flex flex-row w-screen h-screen">
        <RiderSidebar />
        <section
          id="DashboardMainSection"
          className="flex flex-row w-full h-screen"
        >
          <div className="flex flex-col w-full h-screen bg-slate-100 p-4 lg:p-5">
            <RiderHeader />
            {children}
          </div>
        </section>
      </main>
    </SidebarProvider>
  );
}
