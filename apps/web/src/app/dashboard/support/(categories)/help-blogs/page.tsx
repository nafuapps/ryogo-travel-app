import {
  SupportBlogItem,
  SupportBlogItemType,
} from "@/components/flows/support/supportBlogItem"
import SupportSectionHeader from "@/components/flows/support/supportSectionHeader"
import DashboardHeader from "@/components/header/dashboardHeader"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { getTranslations } from "next-intl/server"

/*
  - Blogs
*/

export default async function SupportHelpBlogsPage() {
  const t = await getTranslations("Dashboard.SupportBlogsHelp")

  //TODO: Replace with actual blog data
  const blogItems: SupportBlogItemType[] = [
    {
      blogLink: "",
      type: t("Blog1.Type"),
      title: t("Blog1.Title"),
      imageSrc: "/logoPWA.png",
    },
  ]

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-blogs"} />
      <PageWrapper id="SupportHelpBlogsPage">
        <SupportSectionHeader
          title={t("Title")}
          description={t("Description")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
          {blogItems.map((item, index) => (
            <SupportBlogItem key={index} {...item} />
          ))}
        </div>
      </PageWrapper>
    </MainWrapper>
  )
}
