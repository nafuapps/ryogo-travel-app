import { ExpenseTypesEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import {
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import SelectFilter from "./selectFilter"
import { Route } from "next"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import { ChevronUp, ChevronDown } from "lucide-react"

export default function ExpensesFiltersCard() {
  const t = useTranslations("Dashboard.BookingExpenses")
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const searchParams = useSearchParams()
  const type = searchParams.get("type")
  const role = searchParams.get("role")
  const approved = searchParams.get("approved")

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
    <SectionWrapper id="ExpensesFiltersCard">
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
        className={`grid gap-4 lg:gap-5 grid-cols-2 lg:grid-cols-3 w-full ${isOpen ? "" : "hidden"} `}
      >
        <SelectFilter
          label={t("TypeFilter")}
          enumList={Object.values(ExpenseTypesEnum)}
          value={type ?? "All"}
          onValueChange={(value) => updateFilters({ type: value })}
          disabled={isPending}
        />
        <SelectFilter
          label={t("RoleFilter")}
          enumList={Object.values(UserRolesEnum)}
          value={role ?? "All"}
          onValueChange={(value: string) => updateFilters({ role: value })}
          disabled={isPending}
        />
        <SelectFilter
          label={t("ApprovalFilter")}
          enumList={["True", "False"]}
          value={approved ?? "All"}
          onValueChange={(value) => updateFilters({ approved: value })}
          disabled={isPending}
        />
      </div>
    </SectionWrapper>
  )
}
