import ChangeEmailPageComponent from "@/components/flows/account/changeEmailPage"
import RiderHeader from "@/components/header/riderHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Change Email - ${pageTitle}`,
  description: pageDescription,
}

export default async function ChangeEmailMyProfilePage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const usersWithPhoneRole = await userServices.findUserAccountsByPhoneRole({
    phone: currentUser.phone,
    role: currentUser.userRole,
  })
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myProfile/change-email"} />
      <ChangeEmailPageComponent
        usersWithPhoneRole={usersWithPhoneRole}
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
        isRider
      />
    </MainWrapper>
  )
}
