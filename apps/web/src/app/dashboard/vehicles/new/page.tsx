import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import NewVehiclePageComponent from "./newVehicle"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `New Vehicle - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewVehiclePage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles/new"} />
      <NewVehiclePageComponent agencyId={currentUser.agencyId} />
    </MainWrapper>
  )
}
