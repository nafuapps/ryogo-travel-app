import OnTripDriversComponent from "./(all)/onTripDriversComponent"
import AllDriversListComponent from "./(all)/allDriversListComponent"
import DriversHistoryComponent from "./(all)/driversHistoryComponent"
import DriversScheduleComponent from "./(all)/driversScheduleComponent"
import { PageWrapper } from "@/components/page/pageWrappers"

/**
 *  Show in progress drivers
 *  Show all drivers list (except suspended)
 *  Driver schedule (7/14 days)
 *  TODO: Driver history
 *  TODO: Driver actions
 */

export default async function DriversPageComponent({
  agencyId,
}: {
  agencyId: string
}) {
  return (
    <PageWrapper id="DriversPage">
      <OnTripDriversComponent agencyId={agencyId} />
      <AllDriversListComponent agencyId={agencyId} />
      <DriversScheduleComponent agencyId={agencyId} />
      {/* <DriversHistoryComponent agencyId={agencyId} /> */}
      {/*<DriverActionsComponent agencyId={agencyId}/> */}
    </PageWrapper>
  )
}
