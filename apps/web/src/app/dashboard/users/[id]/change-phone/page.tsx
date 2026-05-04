//Users/id/modify page (only accessible to owner)

import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import ChangeUserPhonePageComponent from "./changeUserPhone"
import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Change User Phone - ${pageTitle}`,
  description: pageDescription,
}

export default async function ChangeUserPhonePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const user = await userServices.findUserDetailsById(id)
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
