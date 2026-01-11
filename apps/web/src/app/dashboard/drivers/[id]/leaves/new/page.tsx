import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import NewDriverLeavePageComponent from "./newDriverLeave"

//New Driver Leave Page
export default async function NewDriverLeavePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/leaves/new"} />
      <NewDriverLeavePageComponent
        userId={user!.userId}
        agencyId={user!.agencyId}
        driverId={id}
      />
    </div>
  )
}
