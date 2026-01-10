import { pageClassName } from "@/components/page/pageCommons"
import NewVehicleForm from "./newVehicleForm"
import { getCurrentUser } from "@/lib/auth"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"

export default async function NewVehiclePageComponent() {
  const currentUser = await getCurrentUser()

  //TODO: Only allow subscribed agencies to add more than 2 vehicles

  const vehicles = (
    await vehicleServices.findExistingVehiclesInAgency(currentUser!.agencyId)
  ).map((v) => v.vehicleNumber)

  return (
    <div id="NewVehiclePage" className={pageClassName}>
      <NewVehicleForm
        agencyId={currentUser!.agencyId}
        existingVehicles={vehicles}
      />
    </div>
  )
}
