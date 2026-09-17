"use client"

import { FindVehicleDetailsByIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import { useTranslations } from "next-intl"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  VehicleBrandEnum,
  VehicleColorEnum,
  VehicleTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { useRouter } from "next/navigation"
import { modifyVehicleAction } from "@/app/actions/vehicles/modifyVehicleAction"
import {
  RyogoSelect,
  RyogoInput,
  RyogoSwitch,
} from "@/components/form/ryogoFormFields"
import {
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { ModifyVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  MAX_NAME_LENGTH,
  MAX_ODOMETER_LIMIT,
  MAX_PER_DAY_CHARGE,
  MAX_VEHICLE_CAPCITY,
  MAX_VEHICLE_RATE,
  MIN_NAME_LENGTH,
  MIN_ODOMETER_LIMIT,
  MIN_PER_DAY_CHARGE,
  MIN_VEHICLE_CAPCITY,
  MIN_VEHICLE_RATE,
} from "@/lib/uiConfig"

export default function ModifyVehiclePageComponent({
  vehicle,
}: {
  vehicle: NonNullable<FindVehicleDetailsByIdType>
}) {
  const t = useTranslations("Dashboard.ModifyVehicle")
  const router = useRouter()

  const modifyVehicleSchema = z.object({
    type: z.enum(VehicleTypesEnum).nonoptional(t("Field1.Error1")),
    brand: z.enum(VehicleBrandEnum).nonoptional(t("Field2.Error1")),
    color: z.enum(VehicleColorEnum).nonoptional(t("Field3.Error1")),
    model: z
      .string()
      .min(MIN_NAME_LENGTH, t("Field4.Error1"))
      .max(MAX_NAME_LENGTH, t("Field4.Error2")),
    capacity: z.coerce
      .number<number>(t("Field5.Error1"))
      .min(MIN_VEHICLE_CAPCITY, t("Field5.Error2"))
      .max(MAX_VEHICLE_CAPCITY, t("Field5.Error3"))
      .multipleOf(1, t("Field5.Error4"))
      .nonnegative(t("Field5.Error5")),
    odometerReading: z.coerce
      .number<number>(t("Field6.Error1"))
      .min(MIN_ODOMETER_LIMIT, t("Field6.Error2"))
      .max(MAX_ODOMETER_LIMIT, t("Field6.Error3"))
      .multipleOf(1, t("Field6.Error4"))
      .nonnegative(t("Field6.Error5")),
    defaultRatePerKm: z.coerce
      .number<number>(t("Field7.Error1"))
      .min(MIN_VEHICLE_RATE, t("Field7.Error2"))
      .max(MAX_VEHICLE_RATE, t("Field7.Error3"))
      .nonnegative(t("Field7.Error4"))
      .multipleOf(1, t("Field7.Error5")),
    hasAC: z.boolean(),
    defaultAcChargePerDay: z.coerce
      .number<number>(t("Field9.Error1"))
      .min(MIN_PER_DAY_CHARGE, t("Field9.Error2"))
      .max(MAX_PER_DAY_CHARGE, t("Field9.Error3"))
      .nonnegative(t("Field9.Error4"))
      .multipleOf(1, t("Field9.Error5")),
  })

  type ModifyVehicleType = z.infer<typeof modifyVehicleSchema>

  const form = useForm<ModifyVehicleType>({
    resolver: zodResolver(modifyVehicleSchema),
    defaultValues: {
      type: vehicle.type,
      brand: vehicle.brand,
      color: vehicle.color,
      model: vehicle.model,
      capacity: vehicle.capacity,
      odometerReading: vehicle.odometerReading,
      defaultRatePerKm: vehicle.defaultRatePerKm,
      hasAC: vehicle.hasAC,
      defaultAcChargePerDay: vehicle.defaultAcChargePerDay,
    },
  })

  const acWatch = useWatch({
    name: "hasAC",
    control: form.control,
  })

  //Submit actions
  async function onSubmit(data: ModifyVehicleType) {
    const modifyVehicleData: ModifyVehicleRequestType = {
      vehicleId: vehicle.id,
      agencyId: vehicle.agencyId,
      type: data.type,
      brand: data.brand,
      color: data.color,
      model: data.model,
      capacity: data.capacity,
      odometerReading: data.odometerReading,
      defaultRatePerKm: data.defaultRatePerKm,
      hasAC: data.hasAC,
      defaultAcChargePerDay: data.defaultAcChargePerDay,
    }
    const modifiedVehicle = await modifyVehicleAction(modifyVehicleData)
    if (modifiedVehicle) {
      router.replace(`/dashboard/vehicles/${vehicle.id}`)
      toast.success(t("Success"))
    } else {
      router.back()
      toast.error(t("Error"))
    }
  }

  return (
    <PageWrapper id="ModifyVehiclePage">
      <FormWrapper<ModifyVehicleType>
        id="ModifyVehicleForm"
        onSubmit={form.handleSubmit(onSubmit)}
        form={form}
      >
        <FormContentWrapper>
          <RyogoSelect
            name={"type"}
            register={form.register("type")}
            array={Object.values(VehicleTypesEnum)}
            title={t("Field1.Title")}
            placeholder={t("Field1.Title")}
          />
          <RyogoSelect
            name={"brand"}
            register={form.register("brand")}
            title={t("Field2.Title")}
            description={t("Field2.Description")}
            array={Object.values(VehicleBrandEnum)}
            placeholder={t("Field2.Placeholder")}
          />
          <RyogoSelect
            name={"color"}
            register={form.register("color")}
            description={t("Field3.Description")}
            array={Object.values(VehicleColorEnum)}
            title={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
          />
          <RyogoInput
            name={"model"}
            type="text"
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
          />
          <RyogoInput
            name={"capacity"}
            type="tel"
            label={t("Field5.Title")}
            placeholder={t("Field5.Placeholder")}
            description={t("Field5.Description")}
          />
          <RyogoInput
            name={"odometerReading"}
            type="tel"
            label={t("Field6.Title")}
            placeholder={t("Field6.Placeholder")}
            description={t("Field6.Description")}
          />
        </FormContentWrapper>
        <FormContentWrapper>
          <RyogoInput
            name={"defaultRatePerKm"}
            type="tel"
            label={t("Field7.Title")}
            placeholder={t("Field7.Placeholder")}
            description={t("Field7.Description")}
          />
          <RyogoSwitch name={"hasAC"} label={t("Field8.Title")} />
          <RyogoInput
            name={"defaultAcChargePerDay"}
            type="tel"
            label={t("Field9.Title")}
            placeholder={t("Field9.Placeholder")}
            description={t("Field9.Description")}
            disabled={!acWatch}
          />
        </FormContentWrapper>
        <StickyActionWrapper>
          <RyogoDefaultButton
            size={"lg"}
            label={form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            showSpinner={form.formState.isSubmitting}
          />
          <RyogoOutlineButton
            size={"lg"}
            label={t("SecondaryCTA")}
            type="button"
            onClick={() => router.back()}
            disabled={form.formState.isSubmitting}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
