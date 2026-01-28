//Change email flow

import { getCurrentUser } from "@/lib/auth"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { redirect, RedirectType } from "next/navigation"
import { mainClassName } from "@/components/page/pageCommons"
import ChangeEmailMyProfileComponent from "./changeEmail"
import RiderHeader from "../../components/riderHeader"

export default async function ChangeEmailMyProfilePage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }
  const usersWithPhoneRole = await userServices.findUserAccountsByPhoneRole(
    user.phone,
    user.userRole,
  )
  return (
    <div className={mainClassName}>
      <RiderHeader pathName={"/rider/myProfile/change-email"} />
      <ChangeEmailMyProfileComponent
        usersWithPhoneRole={usersWithPhoneRole}
        userId={user.userId}
      />
    </div>
  )
}
