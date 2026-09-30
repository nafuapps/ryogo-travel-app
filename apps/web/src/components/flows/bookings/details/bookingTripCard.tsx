import { RyogoP, RyogoCaption } from "@/components/typography"
import { AirVent, Users } from "lucide-react"
import {
  DateWrapper,
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoPill } from "@/components/pills/ryogoPills"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import RyogoRoundedDashedTag from "@/components/tags/ryogoRoundedDashedTag"
import { getDisplayEndDate } from "@/lib/utils"
import { BookingTypeEnum } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"

export default function BookingTripCard({
  startDate,
  endDate,
  actualStartDate,
  actualEndDate,
  source,
  destination,
  type,
  passengers,
  citydistance,
  needsAc,
}: {
  startDate: Date
  endDate: Date
  actualStartDate?: Date | null
  actualEndDate?: Date | null
  source: {
    city: string
    state: string
  }
  destination: {
    city: string
    state: string
  }
  type: BookingTypeEnum
  citydistance: number
  passengers: number
  needsAc: boolean
}) {
  const t = useTranslations("Dashboard.BookingDetails")

  const displayStartDate = actualStartDate ?? startDate
  const displayEndDate = getDisplayEndDate(
    startDate,
    endDate,
    actualStartDate,
    actualEndDate,
  )

  return (
    <div id="tripInfo" className="flex flex-col">
      <div className="flex gap-2 lg:gap-3 p-3 lg:p-4 border-x border-t rounded-t-xl rounded-b-2xl items-center justify-between">
        <LocationWrapper city={source.city} state={source.state} />
        <RyogoRoundedDashedTag label={citydistance + t("Km")} />
        <LocationWrapper
          end
          city={destination.city}
          state={destination.state}
        />
      </div>
      <div className="mx-3 lg:mx-4 border-t border-dashed h-0" />
      <SectionRowWrapper className="p-3 lg:p-4 items-center justify-between border-x rounded-t-2xl">
        <DateWrapper date={displayStartDate} />
        <RyogoPill bgColor="slate" label={type} />
        <DateWrapper date={displayEndDate} />
      </SectionRowWrapper>
      <div className="flex gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 items-center justify-between border-x border-b rounded-b-xl bg-slate-100 dark:bg-slate-700">
        <SectionRowWrapper small className="items-center">
          <RyogoIcon icon={Users} size={"sm"} />
          <RyogoCaption color="light" weight="font-bold">
            {t("Passengers", { pax: passengers })}
          </RyogoCaption>
        </SectionRowWrapper>
        <SectionRowWrapper small className="items-center justify-end">
          <RyogoCaption color="light" weight="font-bold">
            {needsAc ? t("Yes") : t("No")}
          </RyogoCaption>
          <RyogoIcon icon={AirVent} size={"sm"} />
        </SectionRowWrapper>
      </div>
    </div>
  )
}

function LocationWrapper({
  city,
  state,
  end = false,
}: {
  city: string
  state: string
  end?: boolean
}) {
  return (
    <SectionColWrapper small className={`${end ? "items-end" : ""}`}>
      <RyogoP weight="font-bold">{city}</RyogoP>
      <RyogoCaption color="slate">{state}</RyogoCaption>
    </SectionColWrapper>
  )
}
