import { RyogoP, RyogoSmall, RyogoCaption } from "@/components/typography"
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "@/components/ui/select"
import { CalendarDays, LucideIcon } from "lucide-react"
import { Dispatch, SetStateAction } from "react"
import { useTranslations } from "next-intl"
import moment from "moment"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  SectionHeaderWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"

export enum SelectableDays {
  SEVEN = "7Days",
  FOURTEEN = "14Days",
}
export function getSelectedDays(selectedTab: SelectableDays) {
  if (selectedTab === SelectableDays.FOURTEEN) {
    return 14
  }
  return 7
}

export function DashboardScheduleHeader({
  title,
  length,
  selectedTab,
  setSelectedTab,
}: {
  title: string
  length: string
  selectedTab: SelectableDays
  setSelectedTab: Dispatch<SetStateAction<SelectableDays>>
}) {
  const t = useTranslations("Dashboard.Schedule.Header")
  return (
    <SectionRowWrapper center>
      <SectionHeaderWrapper>
        <RyogoIcon icon={CalendarDays} size="sm" />
        <RyogoSmall color="slate">{title}</RyogoSmall>
        <RyogoP color="slate"> {length}</RyogoP>
      </SectionHeaderWrapper>
      <Select
        value={selectedTab}
        onValueChange={(value: SelectableDays) => setSelectedTab(value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={SelectableDays.SEVEN}>{t("7Days")}</SelectItem>
            <SelectItem value={SelectableDays.FOURTEEN}>
              {t("14Days")}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </SectionRowWrapper>
  )
}

export function DashboardScheduleChart({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-row lg:flex-col gap-0.5 w-full bg-slate-50">
      {children}
    </div>
  )
}

export default function DashboardScheduleDayAxis({
  selectedDays,
}: {
  selectedDays: number
}) {
  const chartStartDate = new Date()
  return (
    <div className="flex flex-col lg:flex-row w-16 lg:w-full gap-0.5">
      <div className="flex justify-center bg-white items-center p-1 w-16 lg:min-w-24 h-16"></div>
      {Array.from({ length: selectedDays }, (_, index) => (
        <div
          key={index}
          className="flex justify-center bg-white items-center p-1 w-16 lg:w-full min-h-16 lg:h-16"
        >
          <RyogoCaption color="light">
            {moment(
              new Date(chartStartDate.getTime() + index * 24 * 60 * 60 * 1000),
            ).format("D MMM")}
          </RyogoCaption>
        </div>
      ))}
    </div>
  )
}

export function DashboardScheduleContent({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="overflow-scroll w-full flex flex-row gap-0.5 lg:flex-col">
      {children}
    </div>
  )
}

export function DashboardScheduleItem({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-w-20 grow flex flex-col lg:flex-row gap-0.5">
      {children}
    </div>
  )
}

export function DashboardScheduleItemID({
  icon,
  title,
  imageAlt,
  photoUrl,
}: {
  icon: LucideIcon
  title: string
  imageAlt: string
  photoUrl: string | null
}) {
  return (
    <div className="flex flex-col p-1 gap-0.5 bg-white justify-center items-center shrink-0 min-w-20 h-16 lg:w-24 text-ellipsis whitespace-nowrap">
      {photoUrl ? (
        <RyogoImage src={getFileUrl(photoUrl)} alt={imageAlt} imageSize="xs" />
      ) : (
        <RyogoEnclosedIcon icon={icon} size="md" circular />
      )}
      <RyogoCaption color="slate" weight="font-bold">
        {title}
      </RyogoCaption>
    </div>
  )
}

export function DashboardScheduleItemGrid({
  numberGrids,
  children,
}: {
  numberGrids: number
  children: React.ReactNode
}) {
  return (
    <div
      className="grow grid grid-cols-1 lg:grid-rows-1 gap-0.5 p-0.5
                  grid-rows-[repeat(var(--items),1fr)] lg:grid-cols-[repeat(var(--items),1fr)]"
      style={
        {
          "--items": numberGrids,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}

export function getStartEndIndex(startDate: Date, endDate: Date) {
  const chartStartTime = new Date().getTime()
  return {
    startIndex:
      Math.ceil((startDate.getTime() - chartStartTime) / 86400000) + 1,
    endIndex: Math.ceil((endDate.getTime() - chartStartTime) / 86400000) + 2,
  }
}

export function DashboardScheduleItemBar({
  id,
  startDate,
  endDate,
  selectedDays,
  addedClass,
  children,
}: {
  id: string
  startDate: Date
  endDate: Date
  selectedDays: number
  addedClass: string
  children: React.ReactNode
}) {
  const { startIndex, endIndex } = getStartEndIndex(startDate, endDate)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={`flex flex-row p-1 ${addedClass} ${
            endIndex > selectedDays + 1
              ? "lg:rounded-bl-2xl rounded-b-none lg:rounded-r-none"
              : "rounded-b-2xl lg:rounded-r-2xl"
          } ${
            startIndex < 1
              ? "lg:rounded-tr-2xl rounded-t-none lg:rounded-l-none"
              : "rounded-t-2xl lg:rounded-l-2xl"
          } justify-center items-center min-w-0
                    col-start-1
                    col-end-2
                    row-start-(--startIndex)
                    row-end-(--endIndex)
                    lg:row-start-1
                    lg:row-end-2
                    lg:col-start-(--startIndex)
                    lg:col-end-(--endIndex)
                    `}
          style={
            {
              "--startIndex": startIndex < 1 ? 1 : startIndex,
              "--endIndex":
                endIndex < 2
                  ? 2
                  : endIndex > selectedDays + 1
                    ? selectedDays + 1
                    : endIndex,
            } as React.CSSProperties
          }
        >
          <RyogoCaption color="slate">{id}</RyogoCaption>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto">{children}</PopoverContent>
    </Popover>
  )
}
