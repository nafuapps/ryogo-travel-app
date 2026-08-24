"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { RyogoCaption } from "@/components/typography"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import {
  VehicleTypesEnum,
  VehicleBrandEnum,
  VehicleColorEnum,
} from "@ryogo-travel-app/db/schema"
import { addVehicleAction } from "@/app/actions/vehicles/addVehicleAction"

export default function QuickAddVehicleAlertButton(props: {
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
        agencyId: props.agencyId,
        data: {
          vehicleNumber: props.vehicleNumber,
          type: props.type,
          brand: props.brand,
          color: props.color,
          model: props.model,
        },
      }
      const addedVehicle = await addVehicleAction(newVehicleData)

      if (addedVehicle) {
        toast.success(t("Success"))
        router.replace(
          props.isOnboarding
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
      labelChild={
        <Button variant={"outline"} disabled={props.disabled}>
          <RyogoCaption color="slate">{t("Label")}</RyogoCaption>
        </Button>
      }
    >
      <Button
        variant={"default"}
        onClick={quickAddVehicle}
        disabled={isPending}
      >
        {isPending && <Spinner />}
        <RyogoCaption color="white">
          {isPending ? t("Loading") : t("YesCTA")}
        </RyogoCaption>
      </Button>
    </RyogoAlertDialog>
  )
}
