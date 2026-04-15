//All Users page (only accesssible by owner)

import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import DashboardHeader from "../components/common/dashboardHeader"
import UsersPageComponent from "./users"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Users - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default async function AllUsersPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const agencyId = currentUser.agencyId
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/users"} />
      <UsersPageComponent agencyId={agencyId} />
    </div>
  )
}
