//(Onboarding) Add vehicle page

import { Metadata } from "next";
import AddVehicleComponent from "./addVehicle";
import { getCurrentUser } from "@/lib/auth";
import { redirect, RedirectType } from "next/navigation";

export const metadata: Metadata = {
  title: "Add Vehicle Page | RyoGo",
  description: "Add Vehicle page for RyoGo Travel App",
};

export default async function AddVehiclePage() {
  const currentUser = await getCurrentUser();
  //If not logged in, go to login page
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

  //Owner
  if (currentUser.status !== "new") {
    //If not new, go to dashboard
    redirect("/dashboard", RedirectType.replace);
  }

  //Only new owner can add vehicle
  return (
    <AddVehicleComponent
      agencyId={currentUser.agencyId}
      status={currentUser.status}
    />
  );
}
