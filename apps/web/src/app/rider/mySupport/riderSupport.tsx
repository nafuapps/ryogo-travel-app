//MyProfile/Help page

import { getTranslations } from "next-intl/server"
import { SectionWrapper, PageWrapper } from "@/components/page/pageWrappers"

//TODO: Rider Support page

export default async function MySupportPageComponent({ id }: { id: string }) {
  const t = await getTranslations("Rider.MySupport")

  return (
    <PageWrapper id="RiderSupportPage">
      <SectionWrapper id="MySupportInfo">
        <></>
      </SectionWrapper>
    </PageWrapper>
  )
}
