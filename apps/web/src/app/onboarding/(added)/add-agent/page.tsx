//(Onboarding) Add agent page

import { Metadata } from "next";
import AddAgentComponent from "./addAgent";
import { getCurrentUser } from "@/lib/auth";
import { redirect, RedirectType } from "next/navigation";

export const metadata: Metadata = {
  title: "Add Agent Page | RyoGo",
  description: "Add Agent page for RyoGo Travel App",
};

export default async function AddAgentPage() {
  const currentUser = await getCurrentUser();
  //If no user logged in, go to login page
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace);
  }
  //If new user
  if (currentUser.status == "new") {
    if (currentUser.userRole !== "owner") {
      //If not owner, go to change password page
      redirect("/onboarding/change-password", RedirectType.replace);
    } else {
      //If owner, go to onboarding vehicle
      redirect("/onboarding/add-driver", RedirectType.replace);
    }
  }

  //If not owner, go to dashboard page
  if (currentUser.userRole !== "owner") {
    redirect("/dashboard", RedirectType.replace);
  }

  return <AddAgentComponent agencyId={currentUser.agencyId} />;
}
