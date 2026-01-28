//Account/help page

import { mainClassName } from "@/components/page/pageCommons"
import MyProfileHelpPageComponent from "./help"
import RiderHeader from "../../components/riderHeader"

export default async function MyProfileHelpPage() {
  return (
    <div className={mainClassName}>
      <RiderHeader pathName={"/rider/myProfile/help"} />
      <MyProfileHelpPageComponent />
    </div>
  )
}
