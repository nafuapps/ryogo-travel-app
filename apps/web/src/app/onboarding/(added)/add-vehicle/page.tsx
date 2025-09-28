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
  //If not owner, go to change password page
  if (currentUser.userRole !== "owner") {
    if (currentUser.status !== "new") {
      //If user already onboarded, go to dashboard
      redirect("/dashboard", RedirectType.replace);
    } else {
      //Else, go to change password
      redirect("/onboarding/change-password", RedirectType.replace);
    }
  }

  return (
    <AddVehicleComponent
      agencyId={currentUser.agencyId}
      status={currentUser.status}
    />
  );
}
