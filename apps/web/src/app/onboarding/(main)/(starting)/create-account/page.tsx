//(Onboarding) Add agency and owner page

import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { readPermissions } from "@/lib/permissions"
import { PhoneRegex } from "@/lib/regex"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import CreateAccountPageComponent from "./createAccount"

export const metadata: Metadata = {
  title: `Onboarding Create Account - ${pageTitle}`,
  description: pageDescription,
}

export default async function CreateAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>
}) {
  await readPermissions.redirectIfAuthenticated()

  const { phone } = await searchParams

  const allOwners = await userServices.findAllUsersByRole([UserRolesEnum.OWNER])
  const allAgencies = await agencyServices.findAllAgencies()

  return (
    <CreateAccountPageComponent
      allOwners={allOwners}
      allAgencies={allAgencies}
      phone={PhoneRegex.safeParse(phone).success ? phone : undefined}
    />
  )
}
