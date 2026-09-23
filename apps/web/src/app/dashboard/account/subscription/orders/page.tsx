//Account page

import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import OrdersPageComponent from "./orders"
import { orderServices } from "@ryogo-travel-app/api/services/order.services"

export const metadata: Metadata = {
  title: `Orders - ${pageTitle}`,
  description: pageDescription,
}

export default async function OrdersPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Only owner can access
  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    redirect("/dashboard/account", RedirectType.replace)
  }

  const allOrders = await orderServices.findAllOrdersByAgencyId(
    currentUser.agencyId,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/account/subscription/orders"} />
      <OrdersPageComponent allOrders={allOrders} />
    </MainWrapper>
  )
}
