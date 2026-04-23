//Account/help page

import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import MyProfileHelpPageComponent from "./help"
import RiderHeader from "../../components/riderHeader"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyProfileHelpPage() {
  return (
    <div className={mainClassName}>
      <RiderHeader pathName={"/rider/myProfile/help"} />
      <MyProfileHelpPageComponent />
    </div>
  )
}
