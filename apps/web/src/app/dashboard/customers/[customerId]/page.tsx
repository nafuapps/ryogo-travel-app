import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import CustomerDetailsPageComponent from "./customerDetails"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import {
  ProductFeedbackTypeEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import NewFeedbackComponent from "@/components/flows/feedback/newFeedback"

export const metadata: Metadata = {
  title: `Cusomer Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function CustomerDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ customerId: string }>
  searchParams: Promise<{ feedback?: string | undefined }>
}) {
  const { customerId } = await params

  const feedback = (await searchParams).feedback

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const customer = await customerServices.findCustomerDetailsById(customerId)
  if (!customer) {
    redirect("/dashboard/customers", RedirectType.replace)
  }

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
      <CustomerDetailsPageComponent
        customer={customer}
        userId={currentUser.userId}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
      />
    </MainWrapper>
  )
}
