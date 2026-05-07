import { RyogoH2, RyogoSmall } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

type VehicleDetailHeaderTab = "Details" | "Assigned" | "Completed" | "Repairs"

type VehicleDetailHeaderTabsProps = {
  selectedTab: VehicleDetailHeaderTab
  id: string
}
export default async function VehicleDetailHeaderTabs(
  props: VehicleDetailHeaderTabsProps,
) {
  const t = await getTranslations("Dashboard.VehicleDetailsHeaderTabs")

  const links = {
    Details: `/dashboard/vehicles/${props.id}`,
    Assigned: `/dashboard/vehicles/${props.id}/assigned`,
    Completed: `/dashboard/vehicles/${props.id}/completed`,
    Repairs: `/dashboard/vehicles/${props.id}/repairs`,
  } as const

  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <RyogoH2 color="brand">{props.id}</RyogoH2>
      <div className="flex rounded bg-slate-300 flex-row gap-1 lg:gap-1.5 p-1 lg:p-1.5 self-center my-2 lg:my-3">
        {(Object.keys(links) as VehicleDetailHeaderTab[]).map((tab) => (
          <Link href={links[tab]} key={tab}>
            <div
              className={`flex items-center rounded justify-center px-2 py-1 lg:px-3 lg:py-1.5 ${
                props.selectedTab === tab ? "bg-white shadow" : ""
              }`}
            >
              <RyogoSmall>{t(tab)}</RyogoSmall>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
