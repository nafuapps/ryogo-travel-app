import Blog1Component from "@/components/blog/blog1"
import Blog2Component from "@/components/blog/blog2"
import Blog3Component from "@/components/blog/blog3"
import DashboardHeader from "@/components/header/dashboardHeader"
import {
  MainWrapper,
  PageWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { notFound } from "next/navigation"

const blogItems = {
  "1": <Blog1Component />,
  "2": <Blog2Component />,
  "3": <Blog3Component />,
} satisfies Record<string, React.ReactNode>

type BlogId = keyof typeof blogItems

function isBlogId(blogId: string): blogId is BlogId {
  return Object.hasOwn(blogItems, blogId)
}

export function generateStaticParams() {
  return Object.keys(blogItems).map((blogId) => ({ blogId }))
}

export const dynamicParams = false

export default async function SupportBlogIdPage({
  params,
}: {
  params: Promise<{ blogId: string }>
}) {
  const { blogId } = await params

  if (!isBlogId(blogId)) notFound()

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-blogs"} />
      <PageWrapper id="SupportBlogPage">
        <SectionWrapper id="blog" className="max-w-3xl mx-auto">
          {blogItems[blogId]}
        </SectionWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}
