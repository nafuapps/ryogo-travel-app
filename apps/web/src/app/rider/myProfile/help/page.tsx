//Account/help page

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import MyProfileHelpPageComponent from "./help"
import RiderHeader from "@/components/header/riderHeader"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyProfileHelpPage() {
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myProfile/help"} />
      <MyProfileHelpPageComponent />
    </MainWrapper>
  )
}
