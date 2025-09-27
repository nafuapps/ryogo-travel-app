//(Onboarding) Add vehicle page

import { Metadata } from "next";
import AddVehicleComponent from "./addVehicle";
import { getCurrentUser } from "@/lib/auth";
import { redirect, RedirectType } from "next/navigation";
export const metadata: Metadata = {
  title: "Add Vehicle Page",
  description: "Add Vehicle page for RyoGo Travel App",
};
export default async function AddVehiclePage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace);
  }
  return <AddVehicleComponent agencyId={currentUser.agencyId} />;
}
