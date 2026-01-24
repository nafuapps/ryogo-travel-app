//Users/id/activity  page

import { mainClassName } from "@/components/page/pageCommons"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import DashboardHeader from "../../../components/extra/dashboardHeader"
import UserUpcomingBookingsPageComponent from "./userActivity"

export default async function UserActivityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const bookings = await userServices.findUserUpcomingBookingsById(id)

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/users/[id]/upcoming"} />
      <UserUpcomingBookingsPageComponent bookings={bookings} id={id} />
    </div>
  )
}
