//MyProfile/Help page

import { getTranslations } from "next-intl/server"
import MyProfileDetailHeaderTabs from "../myProfileHeaderTabs"
import { PageWrapper } from "@/components/page/pageWrappers"

//TODO: MyProfile Help page

export default async function MyProfileHelpPageComponent() {
  const t = await getTranslations("Rider.MyProfileHelp")

  return (
    <PageWrapper id="RiderHelpPage">
      <MyProfileDetailHeaderTabs selectedTab="Help" />
      <div
        id="MyProfileHelpInfo"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      ></div>
    </PageWrapper>
  )
}
