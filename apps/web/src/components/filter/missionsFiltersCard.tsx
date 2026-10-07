import { SectionWrapper } from "@/components/page/pageWrappers"
import SelectFilter from "./selectFilter"
import { Route } from "next"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useTransition } from "react"

export default function MissionsFiltersCard({
  isPremium,
}: {
  isPremium: boolean
}) {
  const t = useTranslations("Dashboard.Missions")

  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const searchParams = useSearchParams()
  const critical = searchParams.get("critical")
  const read = searchParams.get("read")
  const custom = searchParams.get("custom")

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
      <div className="grid gap-4 lg:gap-5 grid-cols-2 lg:grid-cols-3 w-full">
        <SelectFilter
          label={t("CriticalFilter")}
          enumList={["True", "False"]}
          value={critical ?? "All"}
          onValueChange={(value) => updateFilters({ critical: value })}
          disabled={isPending}
        />
        <SelectFilter
          label={t("ReadFilter")}
          enumList={["True", "False"]}
          value={read ?? "All"}
          onValueChange={(value: string) => updateFilters({ read: value })}
          disabled={isPending}
        />
        {isPremium && (
          <SelectFilter
            label={t("CustomFilter")}
            enumList={["True", "False"]}
            value={custom ?? "All"}
            onValueChange={(value) => updateFilters({ custom: value })}
            disabled={isPending}
          />
        )}
      </div>
    </SectionWrapper>
  )
}
