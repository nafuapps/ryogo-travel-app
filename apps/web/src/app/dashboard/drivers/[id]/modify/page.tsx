//Drivers/id/modify page (only accessible by owner)

import DashboardHeader from "@/components/header/dashboardHeader"
import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import ModifyDriverPageComponent from "./modifyDriver"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Modify Driver - ${pageTitle}`,
  description: pageDescription,
}

export default async function ModifyDriverPage({
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
      <DashboardHeader pathName={"/dashboard/drivers/[id]/modify"} />
      <ModifyDriverPageComponent driver={driver} />
    </div>
  )
}
