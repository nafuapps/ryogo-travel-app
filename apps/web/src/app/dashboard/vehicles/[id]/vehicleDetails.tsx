import { pageClassName } from "@/components/page/pageCommons"
import { FindVehicleDetailsByIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "./vehicleDetailHeaderTabs"

export default function VehicleDetailsPageComponent({
  vehicle,
}: {
  vehicle: FindVehicleDetailsByIdType
}) {
  return (
    <div id="VehicleDetailsPage" className={pageClassName}>
      <VehicleDetailHeaderTabs selectedTab={"Details"} id={vehicle.id} />
      <div
        id="VehicleDetailsInfo"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <div id="BasicInfo"></div>
        <div id="LicenseInfo"></div>
        <div id="AgencyInfo"></div>
        <div id="VehicleActions"></div>
      </div>
    </div>
  )
}
