//Users/id/modify page (only accessible to owner)

import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import ChangeUserPhonePageComponent from "./changeUserPhone"

export const metadata: Metadata = {
  title: `Change User Phone - ${pageTitle}`,
  description: pageDescription,
}

export default async function ChangeUserPhonePage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  const user = await userServices.findUserDetailsById(userId)
  if (!user) {
    redirect("/dashboard/users", RedirectType.replace)
  }

  //Get all users with this user's role
  const allUsers = await userServices.findAllUsersByRole([user.userRole])

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/users/[id]/change-phone"} />
      <ChangeUserPhonePageComponent user={user} allUsers={allUsers} />
    </MainWrapper>
  )
}
