//Account/help page

import RiderHeader from "@/components/header/riderHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { Metadata } from "next"
import MySupportPageComponent from "./riderSupport"

export const metadata: Metadata = {
  title: `Support - ${pageTitle}`,
  description: pageDescription,
}

export default async function MySupportPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport"} />
      <MySupportPageComponent isPremium={currentUser.isSubscribed} />
    </MainWrapper>
  )
}
