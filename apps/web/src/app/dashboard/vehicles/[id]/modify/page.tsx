//Vehicles/id/modify page

import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import { mainClassName } from "@/components/page/pageCommons"
import ModifyVehiclePageComponent from "./modifyVehicle"
import { getCurrentUser } from "@/lib/auth"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { redirect, RedirectType } from "next/navigation"

/**
 * 
 * 
    brand: varchar("brand", { length: 15 }).notNull(),
     model: varchar("model", { length: 30 }).notNull(),
     color: varchar("color", { length: 15 }).notNull(),
     insuranceExpiresOn: date("insurance_expires_on", { mode: "date" }),
     pucExpiresOn: date("puc_expires_on", { mode: "date" }),
     rcExpiresOn: date("rc_expires_on", { mode: "date" }),
     odometerReading: integer("odometer_reading").notNull().default(0), // in kilometers
     capacity: integer("capacity").notNull().default(4), //number of seats
     hasAC: boolean("has_ac").notNull(),
     type: vehicleTypes().notNull().default(VehicleTypesEnum.CAR),
     insurancePhotoUrl: text("insurance_photo_url"),
     pucPhotoUrl: text("puc_photo_url"),
     rcPhotoUrl: text("rc_photo_url"),
     vehiclePhotoUrl: text("vehicle_photo_url"),
     defaultRatePerKm: integer("default_rate_per_km").notNull().default(18), // in currency units
     defaultAcChargePerDay: integer("extra_ac_charge_per_day")
 */
export default async function ModifyVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await getCurrentUser()

  const vehicle = await vehicleServices.findVehicleDetailsById(id)

  if (!user || user.agencyId != vehicle.agencyId) {
    redirect("/dashboard", RedirectType.replace)
  }

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/vehicles/[id]/modify"} />
      <ModifyVehiclePageComponent vehicle={vehicle} />
    </div>
  )
}
