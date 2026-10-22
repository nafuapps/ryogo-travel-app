import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import {
  DoubleContentWrapper,
  MainWrapper,
} from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import SupportPageComponent from "./support"
import SupportSideComponent from "./supportSide"

export const metadata: Metadata = {
  title: `Support - ${pageTitle}`,
  description: pageDescription,
}

export default async function SupportPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support"} />
      <DoubleContentWrapper>
        <SupportPageComponent
          isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        />
        <SupportSideComponent
          isOwner={currentUser.userRole === UserRolesEnum.OWNER}
          isPremium={currentUser.isSubscribed}
        />
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
