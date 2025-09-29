//Dashboard home page

import { getCurrentUser } from "@/lib/auth";
import { redirect, RedirectType } from "next/navigation";
import DashboardHomeComponent from "./dashboardHome";

export default async function DashboardHomePage() {
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

  if (currentUser?.userRole == "driver") {
    //If driver, go to rider page
    redirect("/rider", RedirectType.replace);
  }

  return <DashboardHomeComponent />;
}
