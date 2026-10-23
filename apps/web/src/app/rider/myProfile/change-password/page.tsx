import ChangePasswordPageComponent from "@/components/flows/account/changePasswordPage"
import RiderHeader from "@/components/header/riderHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Change Password - ${pageTitle}`,
  description: pageDescription,
}

export default async function ChangePasswordMyProfilePage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myProfile/change-password"} />
      <ChangePasswordPageComponent
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
        isRider
      />
    </MainWrapper>
  )
}
