import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import {
  RyogoCaption,
  RyogoP,
  RyogoSmall,
  RyogoTiny,
} from "@/components/typography"
import { format } from "date-fns"
import { LucideIcon, SquarePen } from "lucide-react"

export function BookingEditTripInfoWrapper({
  label,
  value,
  canEdit,
  icon,
}: {
  label: string
  value: string
  canEdit: boolean
  icon: LucideIcon
}) {
  return (
    <div
      className={`border flex p-3 lg:p-4 gap-2 lg:gap-3 justify-between items-center rounded-md ${canEdit ? "hover:bg-slate-100 dark:hover:bg-slate-800" : ""}`}
    >
      <RyogoEnclosedIcon icon={icon} size="sm" color="black" />
      <SectionColWrapper wFull small>
        <RyogoCaption color="light">{label}</RyogoCaption>
        <RyogoSmall color="slate">{value}</RyogoSmall>
      </SectionColWrapper>
      {canEdit && <RyogoIcon icon={SquarePen} size="sm" />}
    </div>
  )
}

export function BookingAddTripInfoWrapper({
  icon,
  label,
}: {
  icon: LucideIcon
  label: string
}) {
  return (
    <div className="border border-dashed rounded-md flex items-center p-3 lg:p-4 gap-2 lg:gap-3 hover:bg-slate-100 dark:hover:bg-slate-800">
      <RyogoEnclosedIcon icon={icon} size="sm" color="black" />
      <RyogoCaption color="light">{label}</RyogoCaption>
    </div>
  )
}

export function BookingDateWrapper({ date }: { date: Date }) {
  return (
    <div className="rounded-md aspect-square h-18 lg:h-20 bg-slate-100 dark:bg-slate-800 p-2 lg:p-3 flex flex-col items-center justify-center">
      <RyogoCaption color="light">{format(date, "MMM")}</RyogoCaption>
      <RyogoP color="slate" weight="font-bold">
        {format(date, "dd")}
      </RyogoP>
      <RyogoTiny color="light">{format(date, "yyyy")}</RyogoTiny>
    </div>
  )
}
