"use client"

import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoSmall, RyogoTiny } from "@/components/typography"
import { EXPIRY_WARNING_DAYS } from "@/lib/uiConfig"
import { differenceInDays } from "date-fns"
import {
  AlarmSmoke,
  Ambulance,
  ChevronRight,
  IdCard,
  IdCardLanyard,
} from "lucide-react"
import moment from "moment"
import { useTranslations } from "next-intl"
import Link from "next/link"

type ExpiryType = "License" | "PUC" | "RC" | "Insurance"

export default function ExpiryAlertCard({
  expiryType,
  entityId,
  entityName,
  dueDate,
  isDriver,
}: {
  expiryType: ExpiryType
  entityId: string
  entityName: string
  dueDate: Date
  isDriver?: boolean
}) {
  const t = useTranslations("Dashboard.ExpiryAlerts")
  const expiryDays = differenceInDays(dueDate, new Date())
  return (
    <SectionWrapper id={entityId}>
      <SectionRowWrapper className="items-center justify-between">
        <SectionRowWrapper className="items-center justify-start">
          <RyogoEnclosedIcon
            icon={getExpiryIcon(expiryType)}
            size="sm"
            color="slate"
            circular
          />
          <div className="flex flex-col gap-0.5">
            <RyogoCaption color="slate" weight="font-bold">
              {expiryType}
            </RyogoCaption>
            <RyogoTiny color="light">{entityId}</RyogoTiny>
          </div>
        </SectionRowWrapper>
        <RyogoCaption
          color={
            expiryDays < 0
              ? "red"
              : expiryDays < EXPIRY_WARNING_DAYS
                ? "yellow"
                : "slate"
          }
        >
          {moment(dueDate).fromNow()}
        </RyogoCaption>
      </SectionRowWrapper>
      <RyogoSmall weight="font-bold" color="slate">
        {t(("Title." + expiryType) as Parameters<typeof t>[0], {
          expired: expiryDays < 0 ? "true" : "false",
          entityName: entityName,
        })}
      </RyogoSmall>
      <Link
        href={
          getExpiryLink(expiryType, entityId, isDriver) as React.ComponentProps<
            typeof Link
          >["href"]
        }
        className="mt-auto"
        prefetch={false}
      >
        <RyogoOutlineButton className="w-full" label={t("CheckNow")}>
          <RyogoIcon icon={ChevronRight} size="xs" color="light" thick />
        </RyogoOutlineButton>
      </Link>
    </SectionWrapper>
  )
}

function getExpiryIcon(type: ExpiryType) {
  switch (type) {
    case "License":
      return IdCardLanyard
    case "PUC":
      return AlarmSmoke
    case "RC":
      return IdCard
    case "Insurance":
      return Ambulance
  }
}

function getExpiryLink(type: ExpiryType, entityId: string, isDriver?: boolean) {
  switch (type) {
    case "License":
      return isDriver
        ? `/rider/myProfile#RiderDriverDetails`
        : `/dashboard/drivers/${entityId}#DriverLicenseDetails`
    case "PUC":
      return isDriver
        ? `/rider/myVehicle#VehiclePUCDetails`
        : `/dashboard/vehicles/${entityId}#VehiclePUCDetails`
    case "RC":
      return isDriver
        ? `/rider/myVehicle#VehicleRCDetails`
        : `/dashboard/vehicles/${entityId}#VehicleRCDetails`
    case "Insurance":
      return isDriver
        ? `/rider/myVehicle#VehicleInsuranceDetails`
        : `/dashboard/vehicles/${entityId}#VehicleInsuranceDetails`
  }
}
