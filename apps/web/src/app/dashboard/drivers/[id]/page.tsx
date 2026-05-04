//Drivers/id (details) page

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import DriverDetailsPageComponent from "./driverDetails"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Driver Details - ${pageTitle}`,
  description: pageDescription,
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
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/drivers/[id]"} />
      <DriverDetailsPageComponent driver={driver} />
    </MainWrapper>
  )
}
