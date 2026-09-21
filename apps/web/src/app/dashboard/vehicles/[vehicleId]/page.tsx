import VehicleDetailsPageComponent from "./vehicleDetails"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import {
  UserRolesEnum,
  ProductFeedbackTypeEnum,
} from "@ryogo-travel-app/db/schema"
import { getCurrentUser } from "@/lib/auth"
import NewFeedbackComponent from "@/components/flows/feedback/newFeedback"

export const metadata: Metadata = {
  title: `Vehicle Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function VehicleDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ vehicleId: string }>
  searchParams: Promise<{ feedback?: string | undefined }>
}) {
  const { vehicleId } = await params

  const feedback = (await searchParams).feedback

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

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
      <VehicleDetailsPageComponent
        vehicle={vehicle}
        userId={currentUser.userId}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
      />
    </MainWrapper>
  )
}
