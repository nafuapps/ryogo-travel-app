import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import AllCustomersListComponent from "./allCustomersListComponent"

export const metadata: Metadata = {
  title: `Customers - ${pageTitle}`,
  description: pageDescription,
}

export default async function AllCustomersPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const t = await getTranslations("Dashboard.Customers.All")

  const allCustomers = await customerServices.findCustomersInAgency(
    currentUser.agencyId,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/customers"} />
      <PageWrapper id="CustomersPage">
        <AllCustomersListComponent allCustomers={allCustomers} />
        <StickyActionWrapper>
          <Link href={"/dashboard/customers/new"}>
            <RyogoDefaultButton label={t("AddCustomer")} className="w-full" />
          </Link>
          <HelpIconButton
            href={"/dashboard/support/help-customers#adding"}
            showLabelSmall
          />
        </StickyActionWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}
