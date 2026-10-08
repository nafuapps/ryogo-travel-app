"use client"

import {
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import SelectFilter from "./selectFilter"
import { Route } from "next"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import { RyogoCaption } from "@/components/typography"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { ChevronUp, ChevronDown } from "lucide-react"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"

export default function RemindersFiltersCard() {
  const t = useTranslations("Dashboard.Reminders")
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const searchParams = useSearchParams()
  const critical = searchParams.get("critical")
  const done = searchParams.get("done")
  const due = searchParams.get("due")
  const type = searchParams.get("type")

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "All" || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}` as Route)
    })
  }

  return (
    <SectionWrapper id="RemindersFiltersCard">
      <SectionRowWrapper
        className="items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <RyogoCaption color="light">{t("Filters")}</RyogoCaption>
        <RyogoIcon
          icon={isOpen ? ChevronUp : ChevronDown}
          color="light"
          size="sm"
          thick
        />
      </SectionRowWrapper>
      <div
        className={`grid gap-4 lg:gap-5 grid-cols-2 lg:grid-cols-4 w-full ${isOpen ? "block" : "hidden"}`}
      >
        <SelectFilter
          label={t("CriticalFilter")}
          enumList={["True", "False"]}
          value={critical ?? "All"}
          onValueChange={(value) => updateFilters({ critical: value })}
          disabled={isPending}
        />
        <SelectFilter
          label={t("DoneFilter")}
          enumList={["True", "False"]}
          value={done ?? "All"}
          onValueChange={(value: string) => updateFilters({ done: value })}
          disabled={isPending}
        />
        <SelectFilter
          label={t("DueFilter")}
          enumList={["True", "False"]}
          value={due ?? "All"}
          onValueChange={(value: string) => updateFilters({ due: value })}
          disabled={isPending}
        />
        <SelectFilter
          label={t("TypeFilter")}
          enumList={Object.values(EntityTypeEnum)}
          value={type ?? "All"}
          onValueChange={(value) => updateFilters({ type: value })}
          disabled={isPending}
        />
      </div>
    </SectionWrapper>
  )
}
