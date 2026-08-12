import { getCurrentUser } from "@/lib/auth"
import { CustomerIdRegex } from "@/lib/regex"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { CustomerStatusEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

export default async function CustomerDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Invalid customer id regex check
  if (!CustomerIdRegex.safeParse(id).success) {
    redirect("/dashboard/customers", RedirectType.replace)
  }

  //No customer found or agency mismatch or customer suspended
  const customer = await customerServices.findCustomerDetailsById(id)
  if (
    !customer ||
    customer.agencyId !== currentUser.agencyId ||
    customer.status === CustomerStatusEnum.SUSPENDED
  ) {
    redirect("/dashboard/customers", RedirectType.replace)
  }

  return children
}
