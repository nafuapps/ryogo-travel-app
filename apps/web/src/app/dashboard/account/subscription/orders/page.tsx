//Account page

import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { orderServices } from "@ryogo-travel-app/api/services/order.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import OrdersPageComponent from "./orders"

export const metadata: Metadata = {
  title: `Orders - ${pageTitle}`,
  description: pageDescription,
}

export default async function OrdersPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  //Only owner can access orders page
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
