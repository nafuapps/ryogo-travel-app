import { pageClassName } from "@/components/page/pageCommons"
import NewBookingForm from "./newBookingForm"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"

export default async function NewBookingPageComponent({
  userId,
  agencyId,
}: {
  userId: string
  agencyId: string
}) {
  //Get agency Data (for location and commission rate)
  const agency = await agencyServices.findAgencyById(agencyId)

  //Get vehicle Data with their bookings and repairs (for available vehicles and rate per km)
  const vehicles = await vehicleServices.findVehiclesByAgency(agencyId)

  //Get driver Data with their bookings and leaves (for available drivers and allowance per day)
  const drivers = await driverServices.findDriversByAgency(agencyId)

  const customers = await customerServices.findCustomersInAgency(agencyId)

  return (
    <div id="NewBookingPage" className={pageClassName}>
      <NewBookingForm
        agencyId={agencyId}
        agencyLocation={agency.location}
        commissionRate={agency.defaultCommissionRate}
        vehicles={vehicles}
        drivers={drivers}
        userId={userId}
        customers={customers}
      />
    </div>
  )
}
