import { pageClassName } from "@/components/page/pageCommons";
import NewBookingForm from "./newBookingForm";
import { getCurrentUser } from "@/lib/auth";
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services";
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services";
import { driverServices } from "@ryogo-travel-app/api/services/driver.services";

export default async function NewBookingPageComponent() {
  const currentUser = await getCurrentUser();

  //Get agency Data (for location and commission rate)
  const agency = await agencyServices.findAgencyById(currentUser!.agencyId);

  //Get vehicle Data with their bookings and repairs (for available vehicles and rate per km)
  const vehicles = await vehicleServices.findVehiclesByAgency(
    currentUser!.agencyId
  );

  //Get driver Data with their bookings and leaves (for available drivers and allowance per day)
  const drivers = await driverServices.findDriversByAgency(
    currentUser!.agencyId
  );

  return (
    <div id="NewBookingPage" className={pageClassName}>
      <NewBookingForm
        agencyId={currentUser!.agencyId}
        agencyLocation={agency.location}
        commissionRate={agency.defaultCommissionRate}
        vehicles={vehicles}
        drivers={drivers}
        userId={currentUser!.userId}
      />
    </div>
  );
}
