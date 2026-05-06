//MyProfile/Help page

import { getTranslations } from "next-intl/server"
import MyProfileDetailHeaderTabs from "@/components/header/myProfileHeaderTabs"
import { ContentWrapper, PageWrapper } from "@/components/page/pageWrappers"

//TODO: MyProfile Help page

export default async function MyProfileHelpPageComponent() {
  const t = await getTranslations("Rider.MyProfileHelp")

  return (
    <PageWrapper id="RiderHelpPage">
      <MyProfileDetailHeaderTabs selectedTab="Help" />
      <ContentWrapper id="MyProfileHelpInfo">
        <></>
      </ContentWrapper>
    </PageWrapper>
  )
}
