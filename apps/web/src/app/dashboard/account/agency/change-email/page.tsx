//Account/Agency/change-email page (only accessible to owner)

import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { notFound, redirect, RedirectType } from "next/navigation"
import ChangeAgencyEmailPageComponent from "./changeAgencyEmail"

export const metadata: Metadata = {
  title: `Change Agency Email - ${pageTitle}`,
  description: pageDescription,
}

export default async function ChangeAgencyEmailPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    notFound()
  }

  //Only owners can change agency email
  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    redirect("/dashboard/account/agency", RedirectType.replace)
  }

  //Get all agencies with this agency's phone
  const allAgencies = await agencyServices.findAgenciesByPhone(
    agency.businessPhone,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/account/agency/change-email"} />
      <ChangeAgencyEmailPageComponent
        agency={agency}
        allAgencies={allAgencies}
        userId={currentUser.userId}
      />
    </MainWrapper>
  )
}
