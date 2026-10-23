import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { Metadata } from "next"
import NewDriverLeavePageComponent from "./newDriverLeave"

export const metadata: Metadata = {
  title: `New Driver Leave - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewDriverLeavePage({
  params,
}: {
  params: Promise<{ driverId: string }>
}) {
  const { driverId } = await params

  const currentUser = await readPermissions.getAuthenticatedUser()

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/leaves/new"} />
      <NewDriverLeavePageComponent
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
        driverId={driverId}
      />
    </MainWrapper>
  )
}
