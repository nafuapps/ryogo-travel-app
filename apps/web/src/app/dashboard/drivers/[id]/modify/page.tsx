//Drivers/id/modify page (only accessible by owner)

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import ModifyDriverPageComponent from "./modifyDriver"
import { getCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { redirect, RedirectType } from "next/navigation"

/**
 * 
 * 
 * Driver table:
        address: varchar("address", { length: 300 }).notNull(),
       licenseNumber: varchar("license_number", { length: 20 }).notNull(),
       licenseExpiresOn: date("license_expires_on", { mode: "date" }),
       licensePhotoUrl: text("license_photo_url"),
       canDriveVehicleTypes: vehicleTypes()
         .array()
         .notNull()
         .default([VehicleTypesEnum.CAR]),
       defaultAllowancePerDay: integer("default_allowance_per_day")
         .notNull()
         .default(500), // in currency unit

    User table:
     photoUrl: text("photo_url"),
 */
export default async function ModifyDriverPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await getCurrentUser()

  const driver = await driverServices.findDriverDetailsById(id)

  if (!user || user.agencyId != driver.agencyId) {
    redirect("/dashboard", RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/modify"} />
      <ModifyDriverPageComponent driver={driver} />
    </div>
  )
}
