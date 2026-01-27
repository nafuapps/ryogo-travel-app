//Account/Agency/change-email page (only accessible to owner)

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import ChangeAgencyEmailPageComponent from "./changeAgencyEmail"
import { getCurrentUser } from "@/lib/auth"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export default async function ChangeAgencyEmailPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  if (currentUser.userRole != UserRolesEnum.OWNER) {
    redirect("/dashboard/account/agency", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)

  //Get all agencies with this agency's phone
  const allAgencies = await agencyServices.findAgenciesByPhone(
    agency.businessPhone,
  )

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/account/agency/change-email"} />
      <ChangeAgencyEmailPageComponent
        agency={agency}
        allAgencies={allAgencies}
      />
    </div>
  )
}
