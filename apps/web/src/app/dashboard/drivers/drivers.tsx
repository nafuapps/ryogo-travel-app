import { pageClassName } from "@/components/page/pageCommons"
import OnTripDriversComponent from "./(all)/onTripDriversComponent"
import AllDriversListComponent from "./(all)/allDriversListComponent"
import DriversHistoryComponent from "./(all)/driversHistoryComponent"
import DriversScheduleComponent from "./(all)/driversScheduleComponent"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"

/**
 *  Show in progress drivers
 *  Show all drivers list (except suspended)
 *  Driver schedule (7/14 days)
 *  TODO: Driver history
 *  TODO: Driver actions
 */

export default async function DriversPageComponent() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/dashboard", RedirectType.replace)
  }
  const agencyId = user.agencyId

  return (
    <div id="BookingsPage" className={pageClassName}>
      <OnTripDriversComponent agencyId={agencyId} />
      <AllDriversListComponent agencyId={agencyId} />
      <DriversScheduleComponent agencyId={agencyId} />
      {/* <DriversHistoryComponent agencyId={agencyId} /> */}
      {/*<DriverActionsComponent agencyId={agencyId}/> */}
    </div>
  )
}
