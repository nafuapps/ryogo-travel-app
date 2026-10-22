import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import NewDriverPageComponent from "./newDriver"

export const metadata: Metadata = {
  title: `New Driver - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewDriverPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/drivers/new"} />
      <NewDriverPageComponent
        agencyId={currentUser.agencyId}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        userId={currentUser.userId}
        isSubscribed={currentUser.isSubscribed}
        hasTriedSubscription={currentUser.hasTriedSubscription}
        subscriptionExpiresOn={currentUser.subscriptionExpiresOn}
      />
    </MainWrapper>
  )
}
