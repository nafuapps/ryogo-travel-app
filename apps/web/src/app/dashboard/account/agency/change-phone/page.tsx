//Account/agency/change-phone page (only accessible to owner)

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import ChangeAgencyPhonePageComponent from "./changeAgencyPhone"

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
