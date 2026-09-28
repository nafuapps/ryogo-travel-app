import RiderHeader from "@/components/header/riderHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import MyLeavesPageComponent from "./myLeaves"

export const metadata: Metadata = {
  title: `My Leaves - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyLeavesPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const driver = await driverServices.findDriverByUserId(currentUser.userId)
  if (!driver) {
    redirect("/auth/login", RedirectType.replace)
  }

  const driverLeaves = await driverServices.findAllDriverLeavesByDriverId(
    driver.id,
  )

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myLeaves"} />
      <MyLeavesPageComponent leaves={driverLeaves} driver={driver} />
    </MainWrapper>
  )
}
