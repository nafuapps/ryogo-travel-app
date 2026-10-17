import Blog1Component from "@/components/blog/blog1"
import Blog2Component from "@/components/blog/blog2"
import Blog3Component from "@/components/blog/blog3"
import {
  LandingSectionWrapper,
  LandingContentWrapper,
} from "@/components/flows/landing/landingWrappers"
import { notFound } from "next/navigation"

const blogItems = {
  "1": <Blog1Component isLanding />,
  "2": <Blog2Component isLanding />,
  "3": <Blog3Component isLanding />,
} satisfies Record<string, React.ReactNode>

type BlogId = keyof typeof blogItems

function isBlogId(blogId: string): blogId is BlogId {
  return Object.hasOwn(blogItems, blogId)
}

export function generateStaticParams() {
  return Object.keys(blogItems).map((blogId) => ({ blogId }))
}

export const dynamicParams = false

export default async function ResourcesBlogIdPage({
  params,
}: {
  params: Promise<{ blogId: string }>
}) {
  const { blogId } = await params

  if (!isBlogId(blogId)) notFound()

  return (
    <LandingSectionWrapper id="blog1">
      <LandingContentWrapper justifyStart className="md:max-w-3xl">
        {blogItems[blogId]}
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
