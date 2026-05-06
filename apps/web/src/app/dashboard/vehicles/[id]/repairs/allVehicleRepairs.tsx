import { FindAllVehicleRepairsByVehicleIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "@/components/header/vehicleDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import { PBold, Caption, CaptionGrey } from "@/components/typography"
import Link from "next/link"
import { UrlObject } from "url"
import { LucidePencil, Plus } from "lucide-react"
import moment from "moment"
import { Button } from "@/components/ui/button"
import {
  ContentWrapper,
  GridItemWrapper,
  PageWrapper,
} from "@/components/page/pageWrappers"

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
    <PageWrapper id="VehicleRepairsPage">
      <VehicleDetailHeaderTabs selectedTab={"Repairs"} id={vehicleId} />
      <ContentWrapper id="VehicleRepairsList">
        <Link
          href={`/dashboard/vehicles/${vehicleId}/repairs/new`}
          className="w-full md:w-1/2 self-center"
        >
          <Button variant={"outline"} className="w-full">
            <Plus className="size-4 md:size-5 text-slate-700" />
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
      </ContentWrapper>
    </PageWrapper>
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
      <GridItemWrapper>
        <PBold>
          {moment(repair.startDate).format("DD MMM") +
            " - " +
            moment(repair.endDate).format("DD MMM")}
        </PBold>
        {repair.cost && <CaptionGrey>{"₹" + repair.cost}</CaptionGrey>}
      </GridItemWrapper>
      <GridItemWrapper>
        <Caption>{repair.addedByUser.name}</Caption>
        <CaptionGrey>{repair.remarks}</CaptionGrey>
      </GridItemWrapper>
      <GridItemWrapper>
        {repair.isCompleted ? (
          <div className="flex py-2 px-3 lg:py-3 lg:px-4 rounded-full bg-slate-100">
            <CaptionGrey>{t("Completed")}</CaptionGrey>
          </div>
        ) : (
          <div className="flex py-2 px-3 lg:py-3 lg:px-4 rounded-full bg-amber-100">
            <CaptionGrey>{t("Pending")}</CaptionGrey>
          </div>
        )}
      </GridItemWrapper>
      <GridItemWrapper>
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
      </GridItemWrapper>
    </div>
  )
}
