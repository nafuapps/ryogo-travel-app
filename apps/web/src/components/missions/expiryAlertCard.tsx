import { getTranslations } from "next-intl/server"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import moment from "moment"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { differenceInDays } from "date-fns"
import {
  AlarmSmoke,
  Ambulance,
  IdCard,
  IdCardLanyard,
  TreePalm,
  Wrench,
} from "lucide-react"
import { EXPIRY_WARNING_DAYS } from "@/lib/uiConfig"
import { CarouselItem } from "@/components/ui/carousel"

type ExpiryType = "License" | "PUC" | "RC" | "Insurance" | "Leave" | "Repair"

export default async function ExpiryAlertCard({
  expiryType,
  entityId,
  entityName,
  dueDate,
}: {
  expiryType: ExpiryType
  entityId: string
  entityName: string
  dueDate: Date
}) {
  const t = await getTranslations("Dashboard.MissionControl.ExpiryAlerts")
  const expiryDays = differenceInDays(dueDate, new Date())
  return (
    <CarouselItem
      className={`flex flex-col gap-2 lg:gap-3 basis-full md:basis-1/2 xl:basis-1/3 p-4 lg:p-5 rounded-lg transition-all delay-200 duration-300 ease-in bg-white shadow ${expiryDays < 0 ? "border-l-6 border-red-600" : expiryDays < 0 ? "border-l-6 border-yellow-600" : "border-l-6 border-sky-700"}`}
    >
      <SectionRowWrapper center>
        <SectionRowWrapper justifyStart center>
          <RyogoEnclosedIcon
            icon={getExpiryIcon(expiryType)}
            size="sm"
            color="slate"
            bgColor="slate"
            circular
          />
          <div className="flex flex-col gap-0.5">
            <RyogoCaption color="slate" weight="font-bold">
              {t(expiryType as Parameters<typeof t>[0])}
            </RyogoCaption>
            <RyogoCaption color="light">{"(" + entityId + ")"}</RyogoCaption>
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
      <RyogoSmall weight="font-bold" color="dark">
        {t(("Title." + expiryType) as Parameters<typeof t>[0], {
          expired: expiryDays < 0 ? "true" : "false",
          entityName: entityName,
        })}
      </RyogoSmall>
      <ExpiryLink type={expiryType} entityId={entityId}>
        <Button variant="default" className="w-full">
          <RyogoCaption color="white" weight="font-bold">
            {t("CheckNow")}
          </RyogoCaption>
        </Button>
      </ExpiryLink>
    </CarouselItem>
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
    case "Leave":
      return TreePalm
    case "Repair":
      return Wrench
  }
}

function ExpiryLink({
  children,
  type,
  entityId,
}: {
  children: React.ReactNode
  type: ExpiryType
  entityId: string
}) {
  switch (type) {
    case "License":
    case "Leave":
      return (
        <Link href={`/dashboard/drivers/${entityId}`} className="mt-auto">
          {children}
        </Link>
      )
    case "PUC":
    case "RC":
    case "Insurance":
    case "Repair":
      return (
        <Link href={`/dashboard/vehicles/${entityId}`} className="mt-auto">
          {children}
        </Link>
      )
  }
}
