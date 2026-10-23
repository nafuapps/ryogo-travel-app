import NewFeedbackComponent from "@/components/flows/feedback/newFeedback"
import DashboardHeader from "@/components/header/dashboardHeader"
import VehicleDetailHeaderTabs from "@/components/header/detailHeaderTabs/vehicleDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import {
  ProductFeedbackTypeEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import VehicleDetailsPageComponent from "./vehicleDetails"

export const metadata: Metadata = {
  title: `Vehicle Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function VehicleDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ vehicleId: string }>
  searchParams: Promise<{ feedback?: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { vehicleId } = await params

  const feedback = (await searchParams).feedback

  const vehicle = await vehicleServices.findVehicleDetailsById(vehicleId)

  if (!vehicle) {
    redirect("/dashboard/vehicles", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]"} />
      {feedback === "true" && (
        <NewFeedbackComponent
          entityId={vehicleId}
          feedbackType={ProductFeedbackTypeEnum.NEW_VEHICLE}
          userId={currentUser.userId}
          agencyId={currentUser.agencyId}
        />
      )}
      <VehicleDetailHeaderTabs selectedTab={"Vehicle"} id={vehicleId} />
      <VehicleDetailsPageComponent
        vehicle={vehicle}
        userId={currentUser.userId}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
      />
    </MainWrapper>
  )
}
