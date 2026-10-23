import { readPermissions } from "@/lib/permissions"
import { CustomerIdRegex } from "@/lib/regex"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { CustomerStatusEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

export default async function CustomerDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ customerId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { customerId } = await params

  //Invalid customer id regex check
  if (!CustomerIdRegex.safeParse(customerId).success) {
    redirect("/dashboard/customers", RedirectType.replace)
  }

  //No customer found or agency mismatch or customer suspended
  const customer = await customerServices.findCustomerDetailsById(customerId)
  if (
    !customer ||
    customer.agencyId !== currentUser.agencyId ||
    customer.status === CustomerStatusEnum.SUSPENDED
  ) {
    redirect("/dashboard/customers", RedirectType.replace)
  }

  return children
}
