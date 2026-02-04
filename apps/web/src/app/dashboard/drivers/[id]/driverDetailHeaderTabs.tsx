import { Small } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

type DriverDetailHeaderTab = "Details" | "Assigned" | "Completed" | "Leaves"

type DriverDetailHeaderTabsProps = {
  selectedTab: DriverDetailHeaderTab
  id: string
}
export default async function DriverDetailHeaderTabs(
  props: DriverDetailHeaderTabsProps,
) {
  const t = await getTranslations("Dashboard.DriverDetailsHeaderTabs")

  const links = {
    Details: `/dashboard/drivers/${props.id}`,
    Assigned: `/dashboard/drivers/${props.id}/assigned`,
    Completed: `/dashboard/drivers/${props.id}/completed`,
    Leaves: `/dashboard/drivers/${props.id}/leaves`,
  } as const

  return (
    <div className="flex rounded bg-slate-300 flex-row gap-1 lg:gap-1.5 p-1 lg:p-1.5 self-center my-2 lg:my-3">
      {(Object.keys(links) as DriverDetailHeaderTab[]).map((tab) => (
        <Link href={links[tab]} key={tab}>
          <div
            className={`flex items-center rounded justify-center px-2 py-1 lg:px-3 lg:py-1.5 ${
              props.selectedTab === tab ? "bg-white shadow" : ""
            }`}
          >
            <Small>{t(tab)}</Small>
          </div>
        </Link>
      ))}
    </div>
  )
}
