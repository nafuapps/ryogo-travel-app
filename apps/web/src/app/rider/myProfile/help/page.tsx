//Account/help page

import { mainClassName } from "@/components/page/pageCommons"
import MyProfileHelpPageComponent from "./help"
import RiderHeader from "../../components/riderHeader"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default async function MyProfileHelpPage() {
  return (
    <div className={mainClassName}>
      <RiderHeader pathName={"/rider/myProfile/help"} />
      <MyProfileHelpPageComponent />
    </div>
  )
}
