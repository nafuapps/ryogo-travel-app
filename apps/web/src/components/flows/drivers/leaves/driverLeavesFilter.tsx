"use client"

import SelectFilter from "@/components/filter/selectFilter"
import { DriverLeaveStatusEnum } from "@ryogo-travel-app/db/schema"
import { Route } from "next"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useTransition } from "react"

export default function DriverLeavesFilterSelect() {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const searchParams = useSearchParams()
  const status = searchParams.get("status")

  const updateStatusFilter = ({ status }: { status: string }) => {
    const params = new URLSearchParams(
      status === "All" ? undefined : `status=${status}`,
    )

    startTransition(() => {
      router.push(`${pathname}?${params}` as Route)
    })
  }

  return (
    <SelectFilter
      enumList={Object.values(DriverLeaveStatusEnum)}
      value={status ?? "All"}
      onValueChange={(value: string) => updateStatusFilter({ status: value })}
      disabled={isPending}
    />
  )
}
