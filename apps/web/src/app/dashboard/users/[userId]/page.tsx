//Users/id (details) page (only accesssible by owner)

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import UserDetailsPageComponent from "./userDetails"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import NewFeedbackComponent from "@/components/flows/feedback/newFeedback"
import { ProductFeedbackTypeEnum } from "@ryogo-travel-app/db/schema"

export const metadata: Metadata = {
  title: `User Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function UserDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ feedback?: string | undefined }>
}) {
  const { userId } = await params

  const feedback = (await searchParams).feedback

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
      {feedback === "true" && (
        <NewFeedbackComponent
          entityId={userId}
          feedbackType={ProductFeedbackTypeEnum.NEW_USER}
          userId={currentUser.userId}
          agencyId={currentUser.agencyId}
        />
      )}
      <UserDetailsPageComponent
        user={user}
        currentUserId={currentUser.userId}
        isCurrentUserAdmin={currentUser.isAdmin}
      />
    </MainWrapper>
  )
}
