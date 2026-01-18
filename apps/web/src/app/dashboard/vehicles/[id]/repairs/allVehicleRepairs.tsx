import { pageClassName } from "@/components/page/pageCommons"
import { FindAllVehicleRepairsByVehicleIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "../vehicleDetailHeaderTabs"

export default function AllVehicleRepairsPageComponent({
  repairs,
  id,
}: {
  repairs: FindAllVehicleRepairsByVehicleIdType
  id: string
}) {
  return (
    <div id="VehicleRepairsPage" className={pageClassName}>
      <VehicleDetailHeaderTabs selectedTab={"Repairs"} id={id} />
      <div
        id="VehicleRepairsList"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      ></div>
    </div>
  )
}
