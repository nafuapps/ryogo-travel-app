import { FindAllVehicleRepairsByVehicleIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "../vehicleDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import { PBold, Caption, CaptionGrey } from "@/components/typography"
import Link from "next/link"
import { UrlObject } from "url"
import { LucidePencil } from "lucide-react"
import { gridItemClassName, pageClassName } from "@/components/page/pageCommons"
import moment from "moment"
import { Button } from "@/components/ui/button"

//TODO: User can mark vehicle has gone for repair

export default async function AllVehicleRepairsPageComponent({
  repairs,
  vehicleId,
  userId,
  isOwner,
}: {
  repairs: FindAllVehicleRepairsByVehicleIdType
  vehicleId: string
  userId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.VehicleRepairs")

  return (
    <div id="VehicleRepairsPage" className={pageClassName}>
      <VehicleDetailHeaderTabs selectedTab={"Repairs"} id={vehicleId} />
      <div
        id="VehicleRepairsList"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <Link
          href={`/dashboard/vehicles/${vehicleId}/repairs/new`}
          className="min-w-1/2 self-center"
        >
          <Button variant={"default"} className="w-full">
            {t("AddRepair")}
          </Button>
        </Link>
        {repairs.map((repair) => (
          <VehicleRepairComponent
            key={repair.id}
            repair={repair}
            isOwner={isOwner}
            userId={userId}
          />
        ))}
      </div>
    </div>
  )
}

async function VehicleRepairComponent({
  repair,
  userId,
  isOwner,
}: {
  repair: FindAllVehicleRepairsByVehicleIdType[number]
  userId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.VehicleRepairs")

  const canModify = isOwner || userId === repair.addedByUserId
  return (
    <div className="grid border border-slate-100 rounded-lg grid-cols-2 grid-rows-2 sm:grid-cols-4 sm:grid-rows-1 gap-3 lg:gap-4 p-3 lg:p-4">
      <div className={gridItemClassName}>
        <PBold>
          {moment(repair.startDate).format("DD MMM") +
            " - " +
            moment(repair.endDate).format("DD MMM")}
        </PBold>
        {repair.cost && <CaptionGrey>{"₹" + repair.cost}</CaptionGrey>}
      </div>
      <div className={gridItemClassName}>
        <Caption>{repair.addedByUser.name}</Caption>
        <CaptionGrey>{repair.remarks}</CaptionGrey>
      </div>
      <div className={gridItemClassName}>
        {repair.isCompleted ? (
          <div className="flex py-2 px-3 lg:py-3 lg:px-4 rounded-full bg-slate-100">
            <CaptionGrey>{t("Completed")}</CaptionGrey>
          </div>
        ) : (
          <div className="flex py-2 px-3 lg:py-3 lg:px-4 rounded-full bg-amber-100">
            <CaptionGrey>{t("Pending")}</CaptionGrey>
          </div>
        )}
      </div>
      <div className={gridItemClassName}>
        {canModify && (
          <Link
            href={
              `/dashboard/vehicles/${repair.vehicleId}/repairs/modify/${repair.id}` as unknown as UrlObject
            }
          >
            <div className="flex p-3 lg:pl-4 lg:gap-1 rounded-lg bg-slate-200 justify-center items-center hover:bg-slate-300 lg:cursor-pointer transition">
              <div className="hidden lg:flex">
                <CaptionGrey>{t("Edit")}</CaptionGrey>
              </div>
              <LucidePencil className="size-4 lg:size-5 text-slate-500" />
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
