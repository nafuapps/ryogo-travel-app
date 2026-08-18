//New agent loggin in for the first time or existing user resetting password

import { getCurrentUser } from "@/lib/auth"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import ChangePasswordPageComponent from "./changePassword"
import { redirect, RedirectType } from "next/navigation"
import {
  AgencyStatusEnum,
  UserRolesEnum,
  UserStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"

export const metadata: Metadata = {
  title: `Change Password - ${pageTitle}`,
  description: pageDescription,
}

export default async function ChangePasswordPage() {
  const currentUser = await getCurrentUser()
  //If no user logged in, go to login page
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Get agency Data
  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  // Owner
  if (currentUser.userRole === UserRolesEnum.OWNER) {
    if (currentUser.status === UserStatusEnum.NEW) {
      //Owner not verified
      if (!currentUser.isVerified) {
        //This is the first owner and agency which are being onboarded
        if (agency.status === AgencyStatusEnum.NEW) {
          redirect("/onboarding/verify-account", RedirectType.replace)
        }
        //Otherwise, it is a newly added owner to an active agency, can continue
      } else {
        //Verified new owner, go to vehicle onboarding
        redirect("/onboarding/add-vehicle", RedirectType.replace)
      }
    } else {
      //Activated owner, go to dashboard
      redirect("/dashboard", RedirectType.replace)
    }
  } else {
    // Active non-owner
    if (currentUser.status !== UserStatusEnum.NEW) {
      if (currentUser.userRole === UserRolesEnum.DRIVER) {
        //If driver, go to rider
        redirect("/rider", RedirectType.replace)
      } else {
        //If not driver, go to dashboard
        redirect("/dashboard", RedirectType.replace)
      }
    }
  }

  //Only new users can come to change password page
  return (
    <ChangePasswordPageComponent
      userId={currentUser.userId}
      role={currentUser.userRole}
      agencyId={currentUser.agencyId}
    />
  )
}
