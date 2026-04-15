//Change password flow

import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { mainClassName } from "@/components/page/pageCommons"
import ChangePasswordMyProfileComponent from "./changePassword"
import RiderHeader from "../../components/riderHeader"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Change Password - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
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
