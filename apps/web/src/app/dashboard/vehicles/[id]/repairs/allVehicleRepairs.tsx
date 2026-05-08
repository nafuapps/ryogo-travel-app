import { FindAllVehicleRepairsByVehicleIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "@/components/header/detailHeaderTabs/vehicleDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import { RyogoP, RyogoCaption } from "@/components/typography"
import Link from "next/link"
import { Plus } from "lucide-react"
import moment from "moment"
import { Button } from "@/components/ui/button"
import {
  SectionWrapper,
  GridItemWrapper,
  PageWrapper,
  GridWrapper,
} from "@/components/page/pageWrappers"
import { RepairStatusPill } from "@/components/statusPills/statusPills"
import { RyogoIconButton } from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

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
      <SectionWrapper id="VehicleRepairsList">
        <Link
          href={`/dashboard/vehicles/${vehicleId}/repairs/new`}
          className="w-full md:w-1/2 self-center"
        >
          <Button variant={"outline"} className="w-full">
            <RyogoIcon icon={Plus} size="sm" />
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
      </SectionWrapper>
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
    <GridWrapper>
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
        <RepairStatusPill
          status={repair.isCompleted ? t("Completed") : t("Pending")}
          completed={repair.isCompleted}
        />
      </GridItemWrapper>
      <GridItemWrapper>
        {canModify && (
          <Link
            href={`/dashboard/vehicles/${repair.vehicleId}/repairs/modify/${repair.id}`}
          >
            <RyogoIconButton label={t("Edit")} />
          </Link>
        )}
      </GridItemWrapper>
    </GridWrapper>
  )
}
