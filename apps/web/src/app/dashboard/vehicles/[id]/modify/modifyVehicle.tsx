"use client"

import { FindVehicleDetailsByIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { pageClassName } from "@/components/page/pageCommons"
import { modifyVehicleAction } from "../../../../actions/modifyVehicleAction"
import {
  DashboardSelect,
  DashboardInput,
  DashboardDatePicker,
  DashboardFileInput,
  DashboardSwitch,
} from "@/components/form/dashboardFormFields"
import { getEnumValueDisplayPairs } from "@/lib/utils"

export default function ModifyVehiclePageComponent({
  vehicle,
}: {
  vehicle: FindVehicleDetailsByIdType
}) {
  const t = useTranslations("Dashboard.ModifyVehicle")
  const router = useRouter()

  const modifyVehicleSchema = z.object({
    type: z.enum(VehicleTypesEnum).nonoptional(t("Field1.Error1")),
    brand: z.string().min(3, t("Field3.Error1")).max(15, t("Field2.Error2")),
    color: z.string().min(3, t("Field4.Error1")).max(15, t("Field3.Error2")),
    model: z.string().min(3, t("Field5.Error1")).max(30, t("Field4.Error2")),
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
      .nonoptional(t("Field7.Error1")),
    rcPhotos: z
      .instanceof(FileList)
      .refine((file) => {
        if (file.length < 1) return true
        return file[0]!.size < 1000000
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
      .nonoptional(t("Field9.Error1")),
    insurancePhotos: z
      .instanceof(FileList)
      .refine((file) => {
        if (file.length < 1) return true
        return file[0]!.size < 1000000
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
          ].includes(file[0]!.type)
        )
      }, t("Field10.Error3"))
      .optional(),
    pucExpiresOn: z
      .date(t("Field11.Error1"))
      .min(vehicle.pucExpiresOn ?? new Date(), t("Field11.Error2"))
      .nonoptional(t("Field11.Error1")),
    pucPhotos: z
      .instanceof(FileList)
      .refine((file) => {
        if (file.length < 1) return true
        return file[0]!.size < 1000000
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
          ].includes(file[0]!.type)
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

  const formData = useForm<ModifyVehicleType>({
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

  //Submit actions
  async function onSubmit(data: ModifyVehicleType) {
    const modifyVehicleData = {
      type: data.type,
      brand: data.brand,
      color: data.color,
      model: data.model,
      capacity: data.capacity,
      odometerReading: data.odometerReading,
      rcExpiresOn: data.rcExpiresOn,
      insuranceExpiresOn: data.insuranceExpiresOn,
      pucExpiresOn: data.pucExpiresOn,
      rcPhotos: data.rcPhotos,
      insurancePhotos: data.insurancePhotos,
      pucPhotos: data.pucPhotos,
      defaultRatePerKm: data.defaultRatePerKm,
      hasAC: data.hasAC,
      defaultAcChargePerDay: data.defaultAcChargePerDay,
    }
    const modifiedVehicle = await modifyVehicleAction(
      vehicle.id,
      modifyVehicleData,
    )
    if (modifiedVehicle) {
      router.replace(`/dashboard/vehicles/${vehicle.id}`)
      toast.success(t("Success"))
    } else {
      router.back()
      toast.error(t("Error"))
    }
  }

  return (
    <div id="ModifyVehicle" className={pageClassName}>
      <Form {...formData}>
        <form
          id="ModifyVehicleForm"
          onSubmit={formData.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 lg:gap-4 p-4 lg:p-5 bg-white rounded-lg shadow w-full"
        >
          <DashboardSelect
            name={"type"}
            register={formData.register("type")}
            array={getEnumValueDisplayPairs(VehicleTypesEnum)}
            title={t("Field1.Title")}
            placeholder={t("Field1.Title")}
          />
          <DashboardInput
            name={"brand"}
            type="text"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <DashboardInput
            name={"color"}
            type="text"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
          <DashboardInput
            name={"model"}
            type="text"
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
          />
          <DashboardInput
            name={"capacity"}
            type="tel"
            label={t("Field5.Title")}
            placeholder={t("Field5.Placeholder")}
            description={t("Field5.Description")}
          />
          <DashboardInput
            name={"odometerReading"}
            type="tel"
            label={t("Field6.Title")}
            placeholder={t("Field6.Placeholder")}
            description={t("Field6.Description")}
          />
          <DashboardDatePicker
            name="rcExpiresOn"
            label={t("Field7.Title")}
            placeholder={t("Field7.Placeholder")}
            description={t("Field7.Description")}
          />
          <DashboardFileInput
            name={"rcPhotos"}
            register={formData.register("rcPhotos")}
            label={t("Field8.Title")}
            placeholder={t("Field8.Placeholder")}
            description={t("Field8.Description")}
          />
          <DashboardDatePicker
            name="insuranceExpiresOn"
            label={t("Field9.Title")}
            placeholder={t("Field9.Placeholder")}
            description={t("Field9.Description")}
          />
          <DashboardFileInput
            name={"insurancePhotos"}
            register={formData.register("insurancePhotos")}
            label={t("Field10.Title")}
            placeholder={t("Field10.Placeholder")}
            description={t("Field10.Description")}
          />
          <DashboardDatePicker
            name="pucExpiresOn"
            label={t("Field11.Title")}
            placeholder={t("Field11.Placeholder")}
            description={t("Field11.Description")}
          />
          <DashboardFileInput
            name={"pucPhotos"}
            register={formData.register("pucPhotos")}
            label={t("Field12.Title")}
            placeholder={t("Field12.Placeholder")}
            description={t("Field12.Description")}
          />
          <DashboardInput
            name={"defaultRatePerKm"}
            type="tel"
            label={t("Field13.Title")}
            placeholder={t("Field13.Placeholder")}
            description={t("Field13.Description")}
          />
          <DashboardSwitch name={"hasAC"} label={t("Field14.Title")} />
          <DashboardInput
            name={"defaultAcChargePerDay"}
            type="tel"
            label={t("Field15.Title")}
            placeholder={t("Field15.Placeholder")}
            description={t("Field15.Description")}
            disabled={!formData.watch("hasAC")}
          />
          <Button
            variant={"default"}
            size={"lg"}
            type="submit"
            disabled={formData.formState.isSubmitting}
          >
            {formData.formState.isSubmitting && <Spinner />}
            {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </Button>
          <Button
            variant={"secondary"}
            size={"lg"}
            type="button"
            onClick={() => router.back()}
            disabled={formData.formState.isSubmitting}
          >
            {t("SecondaryCTA")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
