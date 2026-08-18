//Users/id (details) page (only accesssible by owner)

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import UserDetailsPageComponent from "./userDetails"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"

export const metadata: Metadata = {
  title: `User Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const user = await userServices.findUserDetailsById(userId)
  if (!user) {
    redirect("/dashboard/users", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/users/[id]"} />
      <UserDetailsPageComponent
        user={user}
        currentUserId={currentUser.userId}
        isCurrentUserAdmin={currentUser.isAdmin}
      />
    </MainWrapper>
  )
}
