"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import {
  VehicleTypesEnum,
  VehicleBrandEnum,
  VehicleColorEnum,
} from "@ryogo-travel-app/db/schema"
import { addVehicleAction } from "@/app/actions/vehicles/addVehicleAction"
import {
  RyogoOutlineButton,
  RyogoDefaultButton,
} from "@/components/buttons/ryogoButtons"

export default function QuickAddVehicleAlertButton({
  agencyId,
  vehicleNumber,
  type,
  brand,
  color,
  model,
  disabled,
  isOnboarding,
}: {
  agencyId: string
  vehicleNumber: string
  type: VehicleTypesEnum
  brand: VehicleBrandEnum
  color: VehicleColorEnum
  model: string
  disabled: boolean
  isOnboarding?: boolean
}) {
  const t = useTranslations("Dashboard.Buttons.QuickAddVehicle")

  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function quickAddVehicle() {
    startTransition(async () => {
      const newVehicleData: AddVehicleRequestType = {
        agencyId: agencyId,
        data: {
          vehicleNumber: vehicleNumber,
          type: type,
          brand: brand,
          color: color,
          model: model,
        },
      }
      const addedVehicle = await addVehicleAction(newVehicleData)

      if (addedVehicle) {
        toast.success(t("Success"))
        router.replace(
          isOnboarding
            ? `/onboarding/add-driver`
            : `/dashboard/vehicles/${addedVehicle.id}`,
        )
      } else {
        //If failed, show error
        toast.error(t("Error"))
      }
    })
  }

  return (
    <RyogoAlertDialog
      title={t("Title")}
      desc={t("Desc")}
      noCTA={t("NoCTA")}
      labelChild={<RyogoOutlineButton disabled={disabled} label={t("Label")} />}
    >
      <RyogoDefaultButton
        onClick={quickAddVehicle}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
      />
    </RyogoAlertDialog>
  )
}
