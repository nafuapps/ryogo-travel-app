//Change password flow

import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import ChangePasswordMyProfileComponent from "./changePassword"
import RiderHeader from "@/components/header/riderHeader"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Change Password - ${pageTitle}`,
  description: pageDescription,
}

export default async function ChangePasswordMyProfilePage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }
  return (
    <div className={mainClassName}>
      <RiderHeader pathName={"/rider/myProfile/change-password"} />
      <ChangePasswordMyProfileComponent
        userId={user.userId}
        agencyId={user.agencyId}
      />
    </div>
  )
}
