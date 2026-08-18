//Users/new page (only accessible to owner)

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "@/components/header/dashboardHeader"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import AddOwnerPageComponent from "./addOwner"

export const metadata: Metadata = {
  title: `Add Owner - ${pageTitle}`,
  description: pageDescription,
}

export default async function AddOwnerPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Only agency admin can add more owners
  if (!currentUser.isAdmin) {
    redirect("/dashboard/users", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/users/add-owner"} />
      <AddOwnerPageComponent agency={agency} />
    </MainWrapper>
  )
}
