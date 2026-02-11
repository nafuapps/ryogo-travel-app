//Search page

import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "../components/extra/dashboardHeader"
import SearchPageComponent from "./search"
import { mainClassName } from "@/components/page/pageCommons"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"

export default async function SearchPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const searchData = await agencyServices.findAgencySearchData(
    currentUser.agencyId,
  )

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/search"} />
      <SearchPageComponent
        agencyId={currentUser.agencyId}
        currentUserId={currentUser.userId}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        searchData={searchData}
      />
    </div>
  )
}
