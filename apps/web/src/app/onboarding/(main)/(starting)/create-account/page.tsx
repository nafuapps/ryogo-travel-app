//(Onboarding) Add agency and owner page

import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import CreateAccountPageComponent from "./createAccount"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { PhoneRegex } from "@/lib/regex"

export const metadata: Metadata = {
  title: `Onboarding Create Account - ${pageTitle}`,
  description: pageDescription,
}

export default async function CreateAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { phone } = await searchParams

  const allOwners = await userServices.findAllUsersByRole([UserRolesEnum.OWNER])
  const allAgencies = await agencyServices.findAllAgencies()

  return (
    <CreateAccountPageComponent
      allOwners={allOwners}
      allAgencies={allAgencies}
      phone={
        typeof phone === "string" && PhoneRegex.safeParse(phone).success
          ? phone
          : undefined
      }
    />
  )
}
