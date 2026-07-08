//Account/Help page

import { getTranslations } from "next-intl/server"
import { SectionWrapper, PageWrapper } from "@/components/page/pageWrappers"

//TODO: Support page

export default async function SupportPageComponent({
  id,
  isOwner,
}: {
  id: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.Support")

  return (
    <PageWrapper id="SupportPage">
      <SectionWrapper id="SupportPageInfo">
        <></>
      </SectionWrapper>
    </PageWrapper>
  )
}
