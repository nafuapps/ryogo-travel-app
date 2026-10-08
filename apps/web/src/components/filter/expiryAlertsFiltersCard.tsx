"use client"

import {
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import SelectFilter from "./selectFilter"
import { Route } from "next"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useTransition, useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"

export default function ExpiryAlertsFiltersCard() {
  const t = useTranslations("Dashboard.ExpiryAlerts")
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const searchParams = useSearchParams()
  const expired = searchParams.get("expired")
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
    <SectionWrapper id="ExpiryAlertsFiltersCard">
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
        className={`grid gap-4 lg:gap-5 grid-cols-2 w-full ${isOpen ? "block" : "hidden"}`}
      >
        <SelectFilter
          label={t("ExpiredFilter")}
          enumList={["True", "False"]}
          value={expired ?? "All"}
          onValueChange={(value) => updateFilters({ expired: value })}
          disabled={isPending}
        />
        <SelectFilter
          label={t("TypeFilter")}
          enumList={["RC", "PUC", "Insurance", "License"]}
          value={type ?? "All"}
          onValueChange={(value: string) => updateFilters({ type: value })}
          disabled={isPending}
        />
      </div>
    </SectionWrapper>
  )
}
