//Change email flow

import ChangeEmailPageComponent from "@/components/flows/account/changeEmailPage"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Change Email - ${pageTitle}`,
  description: pageDescription,
}

export default async function ChangeEmailAccountPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const usersWithPhoneRole = await userServices.findUserAccountsByPhoneRole({
    phone: currentUser.phone,
    role: currentUser.userRole,
  })
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/account/change-email"} />
      <ChangeEmailPageComponent
        usersWithPhoneRole={usersWithPhoneRole}
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
      />
    </MainWrapper>
  )
}
