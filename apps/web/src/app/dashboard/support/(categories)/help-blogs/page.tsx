import {
  SupportBlogItem,
  SupportBlogItemType,
} from "@/components/flows/support/supportBlogItem"
import SupportSectionHeader from "@/components/flows/support/supportSectionHeader"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import {
  MainWrapper,
  PageWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

/*
  - Blogs
*/

export const metadata: Metadata = {
  title: `Blogs Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function SupportHelpBlogsPage() {
  const t = await getTranslations("Dashboard.SupportBlogsHelp")

  const b = await getTranslations("Blogs")

  //TODO: Add blog images
  const blogItems: SupportBlogItemType[] = [
    {
      blogId: b("Blog1.Id"),
      type: b("Blog1.Category"),
      title: b("Blog1.Heading"),
      imageSrc: "/logoPWA.png",
    },
    {
      blogId: b("Blog2.Id"),
      type: b("Blog2.Category"),
      title: b("Blog2.Heading"),
      imageSrc: "/logoPWA.png",
    },
    {
      blogId: b("Blog3.Id"),
      type: b("Blog3.Category"),
      title: b("Blog3.Heading"),
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
        <TileGridWrapper>
          {blogItems.map((item) => (
            <SupportBlogItem key={item.blogId} {...item} />
          ))}
        </TileGridWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}
