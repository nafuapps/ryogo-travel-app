import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import {
  DoubleContentWrapper,
  MainWrapper,
} from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import SupportPageComponent from "./support"
import SupportSideComponent from "./supportSide"

export const metadata: Metadata = {
  title: `Support - ${pageTitle}`,
  description: pageDescription,
}

export default async function SupportPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()
  const isOwner = currentUser.userRole === UserRolesEnum.OWNER

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support"} />
      <DoubleContentWrapper>
        <SupportPageComponent isOwner={isOwner} />
        <SupportSideComponent
          isOwner={isOwner}
          isPremium={currentUser.isSubscribed}
        />
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
