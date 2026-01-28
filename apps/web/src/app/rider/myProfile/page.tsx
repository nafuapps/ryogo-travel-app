//MyProfile page

import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "../components/riderHeader"
import RiderProfilePageComponent from "./riderPofile"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"

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
