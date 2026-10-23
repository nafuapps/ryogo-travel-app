import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { notFound, redirect, RedirectType } from "next/navigation"
import ChangeAgencyPhonePageComponent from "./changeAgencyPhone"

export const metadata: Metadata = {
  title: `Change Agency Phone - ${pageTitle}`,
  description: pageDescription,
}

export default async function ChangeAgencyPhonePage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    notFound()
  }

  //Only owners can change agency phone
  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    redirect("/dashboard/account/agency", RedirectType.replace)
  }

  //Get all agencies with this agency's email
  const allAgencies = await agencyServices.findAgenciesByEmail(
    agency.businessEmail,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/account/agency/change-phone"} />
      <ChangeAgencyPhonePageComponent
        agency={agency}
        allAgencies={allAgencies}
      />
    </MainWrapper>
  )
}
