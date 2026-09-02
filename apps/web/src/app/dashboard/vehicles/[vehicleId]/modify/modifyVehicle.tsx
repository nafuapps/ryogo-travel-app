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
  RyogoDatePicker,
  RyogoFileInput,
  RyogoSwitch,
  RyogoCombobox,
} from "@/components/form/ryogoFormFields"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { FormWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { ModifyVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { FileRegex } from "@/lib/regex"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

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
    model: z.string().min(3, t("Field4.Error1")).max(30, t("Field4.Error2")),
    capacity: z.coerce
      .number<number>(t("Field5.Error1"))
      .min(0, t("Field5.Error2"))
      .max(100, t("Field5.Error3"))
      .multipleOf(1, t("Field5.Error4"))
      .nonnegative(t("Field5.Error5")),
    odometerReading: z.coerce
      .number<number>(t("Field6.Error1"))
      .min(0, t("Field6.Error2"))
      .max(1000000, t("Field6.Error3"))
      .multipleOf(1, t("Field6.Error4"))
      .nonnegative(t("Field6.Error5")),
    rcExpiresOn: z
      .date(t("Field7.Error1"))
      .min(vehicle.rcExpiresOn ?? new Date(), t("Field7.Error2"))
      .optional(),
    rcPhotos: FileRegex.refine((file) => {
      if (file.length < 1) return true
      return file[0] && file[0].size < 1000000
    }, t("Field8.Error2"))
      .refine((file) => {
        if (file.length < 1) return true
        return (
          file[0] &&
          [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/bmp",
            "image/webp",
            "application/pdf",
          ].includes(file[0].type)
        )
      }, t("Field8.Error3"))
      .optional(),
    insuranceExpiresOn: z
      .date(t("Field9.Error1"))
      .min(vehicle.insuranceExpiresOn ?? new Date(), t("Field9.Error2"))
      .optional(),
    insurancePhotos: FileRegex.refine((file) => {
      if (file.length < 1) return true
      return file[0] && file[0].size < 1000000
    }, t("Field10.Error2"))
      .refine((file) => {
        if (file.length < 1) return true
        return (
          file[0] &&
          [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/bmp",
            "image/webp",
            "application/pdf",
          ].includes(file[0].type)
        )
      }, t("Field10.Error3"))
      .optional(),
    pucExpiresOn: z
      .date(t("Field11.Error1"))
      .min(vehicle.pucExpiresOn ?? new Date(), t("Field11.Error2"))
      .optional(),
    pucPhotos: FileRegex.refine((file) => {
      if (file.length < 1) return true
      return file[0] && file[0].size < 1000000
    }, t("Field12.Error2"))
      .refine((file) => {
        if (file.length < 1) return true
        return (
          file[0] &&
          [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/bmp",
            "image/webp",
            "application/pdf",
          ].includes(file[0].type)
        )
      }, t("Field12.Error3"))
      .optional(),
    defaultRatePerKm: z.coerce
      .number<number>(t("Field13.Error1"))
      .min(0, t("Field13.Error2"))
      .max(50, t("Field13.Error3"))
      .nonnegative(t("Field13.Error4"))
      .multipleOf(1, t("Field13.Error5")),
    hasAC: z.boolean(),
    defaultAcChargePerDay: z.coerce
      .number<number>()
      .min(0, t("Field15.Error2"))
      .max(10000, t("Field15.Error3"))
      .nonnegative(t("Field15.Error4"))
      .multipleOf(1, t("Field15.Error5")),
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
      rcExpiresOn: vehicle.rcExpiresOn ?? undefined,
      insuranceExpiresOn: vehicle.insuranceExpiresOn ?? undefined,
      pucExpiresOn: vehicle.pucExpiresOn ?? undefined,
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
      rcExpiresOn: data.rcExpiresOn,
      pucExpiresOn: data.pucExpiresOn,
      insuranceExpiresOn: data.insuranceExpiresOn,
      rcPhotos: data.rcPhotos,
      pucPhotos: data.pucPhotos,
      insurancePhotos: data.insurancePhotos,
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
        <RyogoSelect
          name={"type"}
          register={form.register("type")}
          array={getEnumValueDisplayPairs(VehicleTypesEnum)}
          title={t("Field1.Title")}
          placeholder={t("Field1.Title")}
        />
        <RyogoCombobox
          name={"brand"}
          register={form.register("brand")}
          title={t("Field2.Title")}
          array={getEnumValueDisplayPairs(VehicleBrandEnum)}
          placeholder={t("Field2.Placeholder")}
        />
        <RyogoCombobox
          name={"color"}
          register={form.register("color")}
          array={getEnumValueDisplayPairs(VehicleColorEnum)}
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
        <RyogoDatePicker
          name="rcExpiresOn"
          label={t("Field7.Title")}
          placeholder={t("Field7.Placeholder")}
          description={t("Field7.Description")}
        />
        <RyogoFileInput
          name={"rcPhotos"}
          register={form.register("rcPhotos")}
          label={t("Field8.Title")}
          placeholder={t("Field8.Placeholder")}
          description={t("Field8.Description")}
        />
        <RyogoDatePicker
          name="insuranceExpiresOn"
          label={t("Field9.Title")}
          placeholder={t("Field9.Placeholder")}
          description={t("Field9.Description")}
        />
        <RyogoFileInput
          name={"insurancePhotos"}
          register={form.register("insurancePhotos")}
          label={t("Field10.Title")}
          placeholder={t("Field10.Placeholder")}
          description={t("Field10.Description")}
        />
        <RyogoDatePicker
          name="pucExpiresOn"
          label={t("Field11.Title")}
          placeholder={t("Field11.Placeholder")}
          description={t("Field11.Description")}
        />
        <RyogoFileInput
          name={"pucPhotos"}
          register={form.register("pucPhotos")}
          label={t("Field12.Title")}
          placeholder={t("Field12.Placeholder")}
          description={t("Field12.Description")}
        />
        <RyogoInput
          name={"defaultRatePerKm"}
          type="tel"
          label={t("Field13.Title")}
          placeholder={t("Field13.Placeholder")}
          description={t("Field13.Description")}
        />
        <RyogoSwitch name={"hasAC"} label={t("Field14.Title")} />
        <RyogoInput
          name={"defaultAcChargePerDay"}
          type="tel"
          label={t("Field15.Title")}
          placeholder={t("Field15.Placeholder")}
          description={t("Field15.Description")}
          disabled={!acWatch}
        />
        <RyogoDefaultButton
          size={"lg"}
          label={form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          type="submit"
          disabled={form.formState.isSubmitting}
          showSpinner={form.formState.isSubmitting}
        />
        <RyogoOutlineButton
          size={"lg"}
          label={t("SecondaryCTA")}
          type="button"
          onClick={() => router.back()}
          disabled={form.formState.isSubmitting}
        />
      </FormWrapper>
    </PageWrapper>
  )
}
