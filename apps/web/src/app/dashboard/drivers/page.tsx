import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import DriversPageComponent from "./drivers"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Drivers - ${pageTitle}`,
  description: pageDescription,
}

export default async function AllDriversPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }
  const agencyId = user.agencyId
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/drivers"} />
      <DriversPageComponent agencyId={agencyId} />
    </MainWrapper>
  )
}
