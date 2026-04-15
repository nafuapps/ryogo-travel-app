//MyProfile page

import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "../components/riderHeader"
import RiderProfilePageComponent from "./riderPofile"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Profile - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default async function MyProfilePage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const driverDetails = await driverServices.findDriverByUserId(
    currentUser.userId,
  )

  if (!driverDetails) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <RiderHeader pathName={"/rider/myProfile"} />
      <RiderProfilePageComponent driverDetails={driverDetails} />
    </div>
  )
}
