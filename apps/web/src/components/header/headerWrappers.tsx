import { RyogoSmall } from "@/components/typography"
import Link from "next/link"

export function HeaderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        "flex flex-row gap-3 lg:gap-4 pb-3 lg:pb-4 justify-between items-center border-b border-slate-200"
      }
    >
      {children}
    </div>
  )
}

export function HeaderLeftWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className={"flex flex-row gap-2 lg:gap-3 items-center"}>
      {children}
    </div>
  )
}

export function HeaderRightWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={"flex flex-row gap-3 lg:gap-4 justify-end items-center"}>
      {children}
    </div>
  )
}

export function DetailsHeaderTabWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex rounded bg-slate-300 flex-row gap-1 lg:gap-1.5 p-1 lg:p-1.5 self-center my-2 lg:my-3">
      {children}
    </div>
  )
}

export function DetailsHeaderTabItem({
  label,
  selected,
}: {
  label: string
  selected: boolean
}) {
  return (
    <div
      className={`flex items-center rounded justify-center px-2 py-1 lg:px-3 lg:py-1.5 ${
        selected ? "bg-white shadow" : ""
      }`}
    >
      <RyogoSmall>{label}</RyogoSmall>
    </div>
  )
}
