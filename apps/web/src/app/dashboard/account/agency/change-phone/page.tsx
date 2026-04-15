//Account/agency/change-phone page (only accessible to owner)

import DashboardHeader from "@/app/dashboard/components/common/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import ChangeAgencyPhonePageComponent from "./changeAgencyPhone"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Change Agency Phone - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default async function ChangeAgencyPhonePage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    redirect("/dashboard/account/agency", RedirectType.replace)
  }

  //Get all agencies with this agency's email
  const allAgencies = await agencyServices.findAgenciesByEmail(
    agency.businessEmail,
  )

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/account/agency/change-phone"} />
      <ChangeAgencyPhonePageComponent
        agency={agency}
        allAgencies={allAgencies}
      />
    </div>
  )
}
