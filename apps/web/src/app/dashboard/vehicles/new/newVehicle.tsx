import { pageClassName } from "@/components/page/pageCommons"
import NewVehicleForm from "./newVehicleForm"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"

export default async function NewVehiclePageComponent({
  agencyId,
}: {
  agencyId: string
}) {
  //TODO: Only allow subscribed agencies to add more than 2 vehicles

  const vehicles = (
    await vehicleServices.findExistingVehiclesInAgency(agencyId)
  ).map((v) => v.vehicleNumber)

  return (
    <div id="NewVehiclePage" className={pageClassName}>
      <NewVehicleForm agencyId={agencyId} existingVehicles={vehicles} />
    </div>
  )
}
