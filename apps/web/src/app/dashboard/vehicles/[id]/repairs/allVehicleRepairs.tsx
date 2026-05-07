import { FindAllVehicleRepairsByVehicleIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "@/components/header/vehicleDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import { RyogoP, RyogoCaption } from "@/components/typography"
import Link from "next/link"
import { UrlObject } from "url"
import { Pencil, Plus } from "lucide-react"
import moment from "moment"
import { Button } from "@/components/ui/button"
import {
  ContentWrapper,
  GridItemWrapper,
  PageWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

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
        <RyogoP weight="font-bold">
          {moment(repair.startDate).format("DD MMM") +
            " - " +
            moment(repair.endDate).format("DD MMM")}
        </RyogoP>
        {repair.cost && (
          <RyogoCaption color="light">{"₹" + repair.cost}</RyogoCaption>
        )}
      </GridItemWrapper>
      <GridItemWrapper>
        <RyogoCaption color="slate">{repair.addedByUser.name}</RyogoCaption>
        <RyogoCaption color="light">{repair.remarks}</RyogoCaption>
      </GridItemWrapper>
      <GridItemWrapper>
        {repair.isCompleted ? (
          <div className="flex py-2 px-3 lg:py-3 lg:px-4 rounded-full bg-slate-100">
            <RyogoCaption color="light">{t("Completed")}</RyogoCaption>
          </div>
        ) : (
          <div className="flex py-2 px-3 lg:py-3 lg:px-4 rounded-full bg-amber-100">
            <RyogoCaption color="light">{t("Pending")}</RyogoCaption>
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
                <RyogoCaption color="light">{t("Edit")}</RyogoCaption>
              </div>
              <RyogoIcon icon={Pencil} size="sm" />
            </div>
          </Link>
        )}
      </GridItemWrapper>
    </div>
  )
}
