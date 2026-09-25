import { FindAllVehicleRepairsByVehicleIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "@/components/header/detailHeaderTabs/vehicleDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import { RyogoP, RyogoCaption } from "@/components/typography"
import Link from "next/link"
import { ChevronRight, Wrench } from "lucide-react"
import moment from "moment"
import {
  SectionWrapper,
  GridItemWrapper,
  PageWrapper,
  PlainGridWrapper,
  TileGridWrapper,
  SectionHeaderWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RepairStatusPill } from "@/components/pills/ryogoPills"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { HelpIconButton } from "@/components/flows/support/helpButtons"

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
        <SectionHeaderWrapper
          icon={Wrench}
          label={t("Title")}
          count={repairs.length}
        />
        <TileGridWrapper>
          {repairs.map((repair) => (
            <VehicleRepairComponent
              key={repair.id}
              repair={repair}
              isOwner={isOwner}
              userId={userId}
            />
          ))}
        </TileGridWrapper>
      </SectionWrapper>
      <StickyActionWrapper>
        <Link
          href={`/dashboard/vehicles/${vehicleId}/repairs/new`}
          className="w-full"
        >
          <RyogoDefaultButton
            label={t("AddRepair")}
            size="lg"
            className="w-full"
          />
        </Link>
        <HelpIconButton
          href={"/dashboard/support/help-vehicles#repairs"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}

//TODO:Revamp UI
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
    <PlainGridWrapper>
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
            <RyogoOutlineButton label={t("Edit")}>
              <RyogoIcon icon={ChevronRight} size="sm" />
            </RyogoOutlineButton>
          </Link>
        )}
      </GridItemWrapper>
    </PlainGridWrapper>
  )
}
