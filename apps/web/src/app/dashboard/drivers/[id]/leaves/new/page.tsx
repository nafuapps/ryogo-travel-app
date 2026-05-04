import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import NewDriverLeavePageComponent from "./newDriverLeave"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `New Driver Leave - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewDriverLeavePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/leaves/new"} />
      <NewDriverLeavePageComponent
        userId={user.userId}
        agencyId={user.agencyId}
        driverId={id}
      />
    </MainWrapper>
  )
}
