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

  //Not owner
  if (currentUser.userRole !== "owner") {
    if (currentUser.status == "new") {
      //If new, go to change password
      redirect("/onboarding/change-password", RedirectType.replace);
    }
    //Not new users
    if (currentUser.userRole == "driver") {
      //If driver, go to rider page
      redirect("/rider", RedirectType.replace);
    }
    //Else, go to dashboard
    redirect("/dashboard", RedirectType.replace);
  }

  //Only owner can add agent
  return (
    <AddAgentComponent
      agencyId={currentUser.agencyId}
      ownerId={currentUser.userId}
      status={currentUser.status}
    />
  );
}
