//Account/agency details page

import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "../../components/common/dashboardHeader"
import AgencyDetailsPageComponent from "./agencyDetails"
import { getCurrentUser } from "@/lib/auth"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Agency - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default async function AgencyDetailsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  const isOwner = currentUser.userRole === UserRolesEnum.OWNER
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/account/agency"} />
      <AgencyDetailsPageComponent agency={agency} isOwner={isOwner} />
    </div>
  )
}
