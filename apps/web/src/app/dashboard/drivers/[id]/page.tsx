//Drivers/id (details) page

import { mainClassName } from "@/components/page/pageCommons"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import DashboardHeader from "../../components/common/dashboardHeader"
import DriverDetailsPageComponent from "./driverDetails"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Driver Details - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default async function DriverDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const driver = await driverServices.findDriverDetailsById(id)
  if (!driver) {
    redirect("/dashboard/drivers", RedirectType.replace)
  }
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/drivers/[id]"} />
      <DriverDetailsPageComponent driver={driver} />
    </div>
  )
}
