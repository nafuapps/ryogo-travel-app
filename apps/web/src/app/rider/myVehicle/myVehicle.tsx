import { getVehicleIcon } from "@/app/dashboard/components/vehicles/vehicleCommon"
import { pageClassName } from "@/components/page/pageCommons"
import {
  H4,
  PBold,
  SmallGrey,
  CaptionRed,
  SmallBold,
  Caption,
} from "@/components/typography"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@radix-ui/react-separator"
import { FindAssignedVehicleByDriverIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { LucideStar } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import Image from "next/image"

export default async function RiderMyVehiclePageComponent({
  vehicle,
}: {
  vehicle: FindAssignedVehicleByDriverIdType
}) {
  const t = await getTranslations("Rider.MyVehicle")

  if (!vehicle) {
    return (
      <div id="VehicleDetailsPage" className={pageClassName}>
        <div
          id="VehicleDetailsInfo"
          className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5 items-center"
        >
          <Caption>{t("NoVehicleAssigned")}</Caption>
        </div>
      </div>
    )
  }

  const IconComponent = getVehicleIcon({ vehicleType: vehicle.type })

  return (
    <div id="VehicleDetailsPage" className={pageClassName}>
      <div
        id="VehicleDetailsInfo"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <VehicleSection sectionTitle={t("BasicInfo")}>
          <div className="flex flex-row gap-3 lg:gap-4 items-start justify-between">
            <div className="flex flex-col gap-2 lg:gap-3 items-start">
              {vehicle.vehiclePhotoUrl ? (
                <div className="relative size-28 lg:size-32 rounded-lg overflow-hidden">
                  <Image
                    src={getFileUrl(vehicle.vehiclePhotoUrl)}
                    alt={t("Photo")}
                    fill
                    sizes="(max-width: 768px) 112px,128px"
                  />
                </div>
              ) : (
                // eslint-disable-next-line react-hooks/static-components
                <IconComponent className="size-20 lg:size-24 text-slate-400" />
              )}
            </div>
            <div className="flex flex-col gap-2 lg:gap-3 items-end">
              <H4>{vehicle.vehicleNumber}</H4>
              <Caption>{vehicle.brand + " " + vehicle.model}</Caption>
              <Caption>{vehicle.color}</Caption>
              <Caption>{vehicle.hasAC ? t("AC") : t("NonAC")}</Caption>
              <Caption>{t("Capacity", { capacity: vehicle.capacity })}</Caption>
              <Caption>
                {t("Odometer", { odometer: vehicle.odometerReading })}
              </Caption>
              <Caption>
                {moment(vehicle.createdAt).format("DD MMM YYYY")}
              </Caption>
              {vehicle.customerRatings &&
                vehicle.customerRatings.length > 1 && (
                  <div className="flex flex-row gap-1 lg:gap-1.5 items-center justify-center">
                    <LucideStar className="text-slate-900 size-5 lg:size-6" />
                    <PBold>
                      {(
                        vehicle.customerRatings.reduce((a, c) => a + c, 0) /
                        vehicle.customerRatings.length
                      ).toFixed(1)}
                    </PBold>
                    <SmallGrey>
                      {t("NumberRatings", {
                        number: vehicle.customerRatings.length,
                      })}
                    </SmallGrey>
                  </div>
                )}
            </div>
          </div>
        </VehicleSection>
        <Separator />
        <VehicleSection sectionTitle={t("PolicyInfo")}>
          <div className="flex flex-row gap-3 lg:gap-4 items-start justify-between">
            <div className="flex flex-col gap-1 lg:gap-1.5">
              <SmallGrey>{t("Insurance")}</SmallGrey>
              {vehicle.insuranceExpiresOn! < new Date() ? (
                <CaptionRed>
                  {t("ValidTill") +
                    moment(vehicle.insuranceExpiresOn).format("DD MMM YYYY")}
                </CaptionRed>
              ) : (
                <Caption>
                  {t("ValidTill") +
                    moment(vehicle.insuranceExpiresOn).format("DD MMM YYYY")}
                </Caption>
              )}
            </div>
            {vehicle.insurancePhotoUrl && (
              <Dialog>
                <DialogTrigger className="relative flex justify-center items-center size-10 lg:size-12 rounded-lg overflow-hidden border border-slate-200 hover:border-slate-500">
                  <Image
                    src={getFileUrl(vehicle.insurancePhotoUrl)}
                    alt={t("InsurancePhoto")}
                    fill
                    className="object-contain"
                  />
                </DialogTrigger>
                <DialogContent className="size-10/12">
                  <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <Image
                    src={getFileUrl(vehicle.insurancePhotoUrl)}
                    alt={t("InsurancePhoto")}
                    fill
                    className="object-contain"
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="flex flex-row gap-3 lg:gap-4 items-start justify-between">
            <div className="flex flex-col gap-1 lg:gap-1.5">
              <SmallGrey>{t("PUC")}</SmallGrey>
              {vehicle.pucExpiresOn! < new Date() ? (
                <CaptionRed>
                  {t("ValidTill") +
                    moment(vehicle.pucExpiresOn).format("DD MMM YYYY")}
                </CaptionRed>
              ) : (
                <Caption>
                  {t("ValidTill") +
                    moment(vehicle.pucExpiresOn).format("DD MMM YYYY")}
                </Caption>
              )}
            </div>
            {vehicle.pucPhotoUrl && (
              <Dialog>
                <DialogTrigger className="relative flex justify-center items-center size-10 lg:size-12 rounded-lg overflow-hidden border border-slate-200 hover:border-slate-500">
                  <Image
                    src={getFileUrl(vehicle.pucPhotoUrl)}
                    alt={t("PUCPhoto")}
                    fill
                    className="object-contain"
                  />
                </DialogTrigger>
                <DialogContent className="size-10/12">
                  <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <Image
                    src={getFileUrl(vehicle.pucPhotoUrl)}
                    alt={t("PUCPhoto")}
                    fill
                    className="object-contain"
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="flex flex-row gap-3 lg:gap-4 items-start justify-between">
            <div className="flex flex-col gap-1 lg:gap-1.5">
              <SmallGrey>{t("RC")}</SmallGrey>
              {vehicle.rcExpiresOn! < new Date() ? (
                <CaptionRed>
                  {t("ValidTill") +
                    moment(vehicle.rcExpiresOn).format("DD MMM YYYY")}
                </CaptionRed>
              ) : (
                <Caption>
                  {t("ValidTill") +
                    moment(vehicle.rcExpiresOn).format("DD MMM YYYY")}
                </Caption>
              )}
            </div>
            {vehicle.rcPhotoUrl && (
              <Dialog>
                <DialogTrigger className="relative flex justify-center items-center size-10 lg:size-12 rounded-lg overflow-hidden border border-slate-200 hover:border-slate-500">
                  <Image
                    src={getFileUrl(vehicle.rcPhotoUrl)}
                    alt={t("RCPhoto")}
                    fill
                    className="object-contain"
                  />
                </DialogTrigger>
                <DialogContent className="size-10/12">
                  <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <Image
                    src={getFileUrl(vehicle.rcPhotoUrl)}
                    alt={t("RCPhoto")}
                    fill
                    className="object-contain"
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </VehicleSection>
      </div>
    </div>
  )
}

type VehicleSectionType = {
  sectionTitle: string
  children: React.ReactNode
}
function VehicleSection(props: VehicleSectionType) {
  return (
    <div id={props.sectionTitle} className="flex flex-col gap-2 lg:gap-3">
      <SmallBold>{props.sectionTitle}</SmallBold>
      {props.children}
    </div>
  )
}
