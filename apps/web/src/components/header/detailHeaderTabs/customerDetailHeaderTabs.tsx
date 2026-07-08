import { RyogoH2 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  DetailsHeaderTabItem,
  DetailsHeaderTabWrapper,
} from "@/components/header/headerWrappers"
import CopyClipboardButton from "@/components/buttons/copy/copyClipboardButton"
import { SectionRowWrapper } from "@/components/page/pageWrappers"

type CustomerDetailHeaderTab = "Customer" | "Upcoming" | "Completed"

export default async function CustomerDetailHeaderTabs({
  id,
  selectedTab,
}: {
  id: string
  selectedTab: CustomerDetailHeaderTab
}) {
  const t = await getTranslations("Dashboard.CustomerDetailsHeaderTabs")

  const links = {
    Customer: `/dashboard/customers/${id}`,
    Upcoming: `/dashboard/customers/${id}/upcoming`,
    Completed: `/dashboard/customers/${id}/completed`,
  } as const

  return (
    <div className="flex flex-col md:flex-row justify-between items-center">
      <SectionRowWrapper>
        <RyogoH2 color="brand">{id}</RyogoH2>
        <CopyClipboardButton />
      </SectionRowWrapper>
      <DetailsHeaderTabWrapper>
        {(Object.keys(links) as CustomerDetailHeaderTab[]).map((tab) => (
          <Link href={links[tab]} key={tab}>
            <DetailsHeaderTabItem
              label={t(tab)}
              selected={selectedTab === tab}
            />
          </Link>
        ))}
      </DetailsHeaderTabWrapper>
    </div>
  )
}
