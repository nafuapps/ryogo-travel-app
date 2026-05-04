//Change email flow

import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { redirect, RedirectType } from "next/navigation"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import ChangeEmailMyProfileComponent from "./changeEmail"
import RiderHeader from "@/components/header/riderHeader"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Change Email - ${pageTitle}`,
  description: pageDescription,
}

export default async function ChangeEmailMyProfilePage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }
  const usersWithPhoneRole = await userServices.findUserAccountsByPhoneRole(
    user.phone,
    user.userRole,
  )
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myProfile/change-email"} />
      <ChangeEmailMyProfileComponent
        usersWithPhoneRole={usersWithPhoneRole}
        userId={user.userId}
        agencyId={user.agencyId}
      />
    </MainWrapper>
  )
}
