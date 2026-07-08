//Account/help page

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import MySupportPageComponent from "./support"
import RiderHeader from "@/components/header/riderHeader"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export const metadata: Metadata = {
  title: `Support - ${pageTitle}`,
  description: pageDescription,
}

export default async function MySupportPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport"} />
      <MySupportPageComponent id={currentUser.userId} />
    </MainWrapper>
  )
}
