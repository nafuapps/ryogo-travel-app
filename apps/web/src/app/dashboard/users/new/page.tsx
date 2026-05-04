//Users/new page (only accessible to owner)

import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "@/components/header/dashboardHeader"
import NewAgentPageComponent from "./newAgent"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `New User - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewUserPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const agencyId = currentUser.agencyId
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/users/new"} />
      <NewAgentPageComponent agencyId={agencyId} />
    </div>
  )
}
