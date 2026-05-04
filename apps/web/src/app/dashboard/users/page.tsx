//All Users page (only accesssible by owner)

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "@/components/header/dashboardHeader"
import UsersPageComponent from "./users"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Users - ${pageTitle}`,
  description: pageDescription,
}

export default async function AllUsersPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const agencyId = currentUser.agencyId
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/users"} />
      <UsersPageComponent agencyId={agencyId} />
    </MainWrapper>
  )
}
