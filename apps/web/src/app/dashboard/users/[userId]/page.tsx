//Users/id (details) page (only accesssible by owner)

import NewFeedbackComponent from "@/components/flows/feedback/newFeedback"
import DashboardHeader from "@/components/header/dashboardHeader"
import UserDetailHeaderTabs from "@/components/header/detailHeaderTabs/userDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { ProductFeedbackTypeEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import UserDetailsPageComponent from "./userDetails"

export const metadata: Metadata = {
  title: `User Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function UserDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ feedback?: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { userId } = await params

  const feedback = (await searchParams).feedback

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
      <UserDetailHeaderTabs selectedTab={"User"} id={userId} />
      <UserDetailsPageComponent
        user={user}
        currentUserId={currentUser.userId}
        isCurrentUserAdmin={currentUser.isAdmin}
      />
    </MainWrapper>
  )
}
