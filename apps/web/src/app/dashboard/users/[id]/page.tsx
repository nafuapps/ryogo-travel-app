//Users/id (details) page (only accesssible by owner)

import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import UserDetailsPageComponent from "./userDetails"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `User Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await userServices.findUserDetailsById(id)
  if (!user) {
    redirect("/dashboard/users", RedirectType.replace)
  }
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/users/[id]"} />
      <UserDetailsPageComponent user={user} />
    </div>
  )
}
