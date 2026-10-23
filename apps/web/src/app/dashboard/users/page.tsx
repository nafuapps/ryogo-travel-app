//All Users page (only accesssible by owner)

import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { Metadata } from "next"
import UsersPageComponent from "./users"

export const metadata: Metadata = {
  title: `Users - ${pageTitle}`,
  description: pageDescription,
}

export default async function AllUsersPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const allUsers = await userServices.findAllUsersInAgency(currentUser.agencyId)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/users"} />
      <UsersPageComponent
        allUsers={allUsers}
        isPremium={currentUser.isSubscribed}
        hasTriedSubscription={currentUser.hasTriedSubscription}
      />
    </MainWrapper>
  )
}
