import { getTranslations } from "next-intl/server"
import { SectionWrapper, PageWrapper } from "@/components/page/pageWrappers"

//TODO: Dashboard Support page

export default async function SupportPageComponent({
  id,
  isOwner,
  isPremium,
}: {
  id: string
  isOwner: boolean
  isPremium: boolean
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
