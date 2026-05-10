import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  RyogoH3,
  RyogoCaption,
  RyogoSmall,
  RyogoH2,
} from "@/components/typography"
import { LucideIcon } from "lucide-react"

export const metricMainClassName =
  "flex flex-col flex-1 gap-3 lg:gap-4 justify-center"

export function DashboardMetricWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-lg flex flex-col p-4 lg:p-5 gap-1 lg:gap-2">
      {children}
    </div>
  )
}

export function DashboardMetricTopWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 lg:gap-5 pb-3 lg:pb-4 mb-auto">
      {children}
    </div>
  )
}

export function DashboardMetricHeader({
  label,
  icon,
}: {
  label: string
  icon: LucideIcon
}) {
  return (
    <div className="flex flex-row gap-2 items-center self-start">
      <RyogoIcon icon={icon} size="sm" />
      <RyogoSmall color="slate">{label}</RyogoSmall>
    </div>
  )
}

export function DashboardMetricMain({
  mainValue,
  children,
}: {
  mainValue: number | string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col flex-1 gap-3 lg:gap-4 justify-center">
      <RyogoH2>{mainValue}</RyogoH2>
      {children}
    </div>
  )
}

export function DashboardMetricSubTitle({
  subtitle,
  icon,
}: {
  subtitle: string
  icon?: LucideIcon
}) {
  return (
    <div className="flex flex-row gap-1 item-center">
      {icon && <RyogoIcon icon={icon} size="sm" />}
      <RyogoCaption color="light">{subtitle}</RyogoCaption>
    </div>
  )
}

export function DashboardMetricGridWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="grid grid-rows-2 grid-cols-2 border-t">{children}</div>
}

export function DashboardMetricGridItem({
  value,
  label,
  borderLeft,
  borderBottom,
  spanTwo,
}: {
  value: number | string
  label: string
  borderLeft?: boolean
  borderBottom?: boolean
  spanTwo?: boolean
}) {
  return (
    <div
      className={`flex flex-col gap-0.5 lg:gap-1 p-1.5 lg:p-2 items-center justify-center ${borderBottom ? "border-b" : ""} ${spanTwo ? "col-span-2" : ""} ${borderLeft ? "border-l" : ""}`}
    >
      <RyogoH3>{value}</RyogoH3>
      <RyogoCaption color="light">{label}</RyogoCaption>
    </div>
  )
}
