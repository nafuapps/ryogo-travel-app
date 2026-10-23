import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import NewVehiclePageComponent from "./newVehicle"

export const metadata: Metadata = {
  title: `New Vehicle - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewVehiclePage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles/new"} />
      <NewVehiclePageComponent
        agencyId={currentUser.agencyId}
        userId={currentUser.userId}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        isSubscribed={currentUser.isSubscribed}
        hasTriedSubscription={currentUser.hasTriedSubscription}
        subscriptionExpiresOn={currentUser.subscriptionExpiresOn}
      />
    </MainWrapper>
  )
}
