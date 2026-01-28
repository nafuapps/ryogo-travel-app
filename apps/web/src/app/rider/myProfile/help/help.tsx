//MyProfile/Help page

import { getTranslations } from "next-intl/server"
import { pageClassName } from "@/components/page/pageCommons"
import MyProfileDetailHeaderTabs from "../myProfileHeaderTabs"

//TODO: MyProfile Help page

export default async function MyProfileHelpPageComponent() {
  const t = await getTranslations("Rider.MyProfileHelp")

  return (
    <div id="MyProfileHelpPage" className={pageClassName}>
      <MyProfileDetailHeaderTabs selectedTab="Help" />
      <div
        id="MyProfileHelpInfo"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      ></div>
    </div>
  )
}
