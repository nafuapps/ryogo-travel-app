import DashboardHeader from "@/app/dashboard/components/common/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import NewDriverLeavePageComponent from "./newDriverLeave"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "New Driver Leave - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
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
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/leaves/new"} />
      <NewDriverLeavePageComponent
        userId={user.userId}
        agencyId={user.agencyId}
        driverId={id}
      />
    </div>
  )
}
