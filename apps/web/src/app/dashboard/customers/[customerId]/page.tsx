import NewFeedbackComponent from "@/components/flows/feedback/newFeedback"
import DashboardHeader from "@/components/header/dashboardHeader"
import CustomerDetailHeaderTabs from "@/components/header/detailHeaderTabs/customerDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import {
  ProductFeedbackTypeEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import CustomerDetailsPageComponent from "./customerDetails"

export const metadata: Metadata = {
  title: `Cusomer Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function CustomerDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ customerId: string }>
  searchParams: Promise<{ feedback?: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { customerId } = await params

  const customer = await customerServices.findCustomerDetailsById(customerId)
  if (!customer) {
    redirect("/dashboard/customers", RedirectType.replace)
  }

  const feedback = (await searchParams).feedback

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/customers/[id]"} />
      {feedback === "true" && (
        <NewFeedbackComponent
          entityId={customerId}
          feedbackType={ProductFeedbackTypeEnum.NEW_CUSTOMER}
          userId={currentUser.userId}
          agencyId={currentUser.agencyId}
        />
      )}
      <CustomerDetailHeaderTabs selectedTab={"Customer"} id={customer.id} />
      <CustomerDetailsPageComponent
        customer={customer}
        userId={currentUser.userId}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
      />
    </MainWrapper>
  )
}
