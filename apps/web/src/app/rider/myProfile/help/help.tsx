//MyProfile/Help page

import { getTranslations } from "next-intl/server"
import MyProfileDetailHeaderTabs from "@/components/header/detailHeaderTabs/myProfileHeaderTabs"
import { SectionWrapper, PageWrapper } from "@/components/page/pageWrappers"

//TODO: MyProfile Help page

export default async function MyProfileHelpPageComponent({
  id,
}: {
  id: string
}) {
  const t = await getTranslations("Rider.MyProfileHelp")

  return (
    <PageWrapper id="RiderHelpPage">
      <MyProfileDetailHeaderTabs id={id} selectedTab="Help" />
      <SectionWrapper id="MyProfileHelpInfo">
        <></>
      </SectionWrapper>
    </PageWrapper>
  )
}
