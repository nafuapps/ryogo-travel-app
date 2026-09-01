import { RyogoSmall, RyogoCaption } from "@/components/typography"
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "@/components/ui/select"
import { CalendarDays, CalendarSync } from "lucide-react"
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
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { addDays, differenceInDays, subDays } from "date-fns"

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
  isHistory,
}: {
  title: string
  length: string
  selectedTab: SelectableDays
  setSelectedTab: Dispatch<SetStateAction<SelectableDays>>
  isHistory?: boolean
}) {
  const t = useTranslations(
    isHistory ? "Dashboard.History.Header" : "Dashboard.Schedule.Header",
  )
  return (
    <SectionRowWrapper center>
      <SectionHeaderWrapper>
        <RyogoIcon
          icon={isHistory ? CalendarSync : CalendarDays}
          size="sm"
          color="light"
        />
        <RyogoSmall color="light">{title}</RyogoSmall>
        <RyogoSmall color="light" weight="font-bold">
          {length}
        </RyogoSmall>
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
    <div className="flex flex-row lg:flex-col gap-0.5 w-full bg-slate-50 dark:bg-slate-950">
      {children}
    </div>
  )
}
function DayAxisEmptyBlock() {
  return (
    <div className="flex justify-center bg-white dark:bg-slate-900 items-center p-1 w-16 lg:min-w-24 h-16"></div>
  )
}

export default function DashboardScheduleDayAxis({
  selectedDays,
  isHistory,
}: {
  selectedDays: number
  isHistory?: boolean
}) {
  const chartStartDate = new Date()
  return (
    <div className="flex flex-col lg:flex-row w-16 lg:w-full gap-0.5">
      {!isHistory && <DayAxisEmptyBlock />}
      {Array.from({ length: selectedDays }, (_, index) => (
        <div
          key={index}
          className="flex justify-center bg-white dark:bg-slate-900 items-center p-1 w-16 lg:w-full min-h-16 lg:h-16"
        >
          <RyogoCaption color="light">
            {moment(
              isHistory
                ? subDays(chartStartDate, selectedDays - index)
                : // new Date(
                  //     chartStartDate.getTime() -
                  //       (selectedDays - index) * 24 * 60 * 60 * 1000,
                  //   )
                  addDays(chartStartDate, index),
              // new Date(
              //     chartStartDate.getTime() + index * 24 * 60 * 60 * 1000,
              //   ),
            ).format("D MMM")}
          </RyogoCaption>
        </div>
      ))}
      {isHistory && <DayAxisEmptyBlock />}
    </div>
  )
}

export function DashboardScheduleContent({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="overflow-scroll scrollbar-none w-full flex flex-row gap-0.5 lg:flex-col">
      {children}
    </div>
  )
}

export function DashboardScheduleItem({
  children,
  isHistory,
}: {
  children: React.ReactNode
  isHistory?: boolean
}) {
  return (
    <div
      className={`min-w-20 grow flex ${isHistory ? "flex-col-reverse lg:flex-row-reverse" : "flex-col lg:flex-row"} gap-0.5`}
    >
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
  icon: React.ReactNode
  title: string
  imageAlt: string
  photoUrl: string | null
}) {
  return (
    <div className="flex flex-col p-1 gap-0.5 bg-white dark:bg-slate-900 justify-center items-center shrink-0 min-w-20 h-16 lg:w-24 text-ellipsis whitespace-nowrap">
      {photoUrl ? (
        <RyogoImage src={getFileUrl(photoUrl)} alt={imageAlt} imageSize="xs" />
      ) : (
        icon
      )}
      <RyogoCaption color="light" weight="font-bold">
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

function getScheduleStartEndIndex(startDate: Date, endDate: Date) {
  const chartStartTime = new Date().getTime()
  return {
    startIndex:
      Math.ceil((startDate.getTime() - chartStartTime) / 86400000) + 1,
    endIndex: Math.ceil((endDate.getTime() - chartStartTime) / 86400000) + 2,
  }
}

function getHistoryStartEndIndex(
  startDate: Date,
  endDate: Date,
  selectedDays: number,
) {
  const chartStartDate = subDays(new Date(), selectedDays)
  // new Date(
  //   new Date().getTime() - selectedDays * 24 * 60 * 60 * 1000,
  // ).getTime()
  return {
    startIndex: Math.max(
      differenceInDays(startDate, new Date(chartStartDate)),
      1,
    ),
    // Math.ceil((startDate.getTime() - chartStartTime) / 86400000) + 1,
    endIndex: Math.min(
      differenceInDays(endDate, new Date(chartStartDate)),
      selectedDays + 1,
    ),
    // Math.ceil((endDate.getTime() - chartStartTime) / 86400000) + 2,
  }
}

export function DashboardScheduleItemBar({
  id,
  startDate,
  endDate,
  selectedDays,
  children,
  className,
  isHistory,
}: {
  id: string
  startDate: Date
  endDate: Date
  selectedDays: number
  children: React.ReactNode
  className: string
  isHistory?: boolean
}) {
  const { startIndex, endIndex } = isHistory
    ? getHistoryStartEndIndex(startDate, endDate, selectedDays)
    : getScheduleStartEndIndex(startDate, endDate)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={`flex flex-row p-1 ${className} ${
            endIndex > selectedDays + 1
              ? "lg:rounded-bl-xl rounded-b-none lg:rounded-r-none"
              : "rounded-b-xl lg:rounded-r-xl"
          } ${
            startIndex < 1
              ? "lg:rounded-tr-xl rounded-t-none lg:rounded-l-none"
              : "rounded-t-xl lg:rounded-l-xl"
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
                  ? isHistory
                    ? selectedDays + 1
                    : 2
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
