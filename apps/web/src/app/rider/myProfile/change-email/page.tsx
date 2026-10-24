import ChangeEmailPageComponent from "@/components/flows/account/changeEmailPage"
import RiderHeader from "@/components/header/riderHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: `Change Email - ${pageTitle}`,
  description: pageDescription,
}

export default async function ChangeEmailMyProfilePage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const user = await userServices.findUserDetailsById(currentUser.userId)
  if (!user) {
    notFound()
  }

  const usersWithPhoneRole = await userServices.findUserAccountsByPhoneRole({
    role: currentUser.userRole,
    phone: user.phone,
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
