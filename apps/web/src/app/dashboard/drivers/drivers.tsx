import OnTripDriversComponent from "@/components/flows/drivers/home/onTripDriversComponent"
import AllDriversListComponent from "@/components/flows/drivers/home/allDriversListComponent"
import DriversScheduleComponent from "@/components/flows/drivers/home/driversScheduleComponent"
import { PageWrapper } from "@/components/page/pageWrappers"

/**
 *  Show in progress drivers
 *  Show all drivers list (except suspended)
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
    </PageWrapper>
  )
}
