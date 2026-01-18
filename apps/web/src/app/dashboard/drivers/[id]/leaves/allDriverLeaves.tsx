import { pageClassName } from "@/components/page/pageCommons"
import { FindAllDriverLeavesByDriverIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "../driverDetailHeaderTabs"

export default function AllDriverLeavesPageComponent({
  leaves,
  id,
}: {
  leaves: FindAllDriverLeavesByDriverIdType
  id: string
}) {
  return (
    <div id="DriverLeavesPage" className={pageClassName}>
      <DriverDetailHeaderTabs selectedTab={"Leaves"} id={id} />
      <div
        id="DriverLeavesList"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      ></div>
    </div>
  )
}
