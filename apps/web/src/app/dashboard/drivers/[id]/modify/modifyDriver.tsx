"use client"

import { modifyDriverAction } from "@/app/dashboard/drivers/[id]/modify/modifyDriverAction"
import {
  DashboardTextarea,
  DashboardMultipleCheckbox,
  DashboardInput,
  DashboardDatePicker,
  DashboardFileInput,
} from "@/components/form/dashboardFormFields"
import { pageClassName } from "@/components/page/pageCommons"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Spinner } from "@/components/ui/spinner"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { FindDriverDetailsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export default function ModifyDriverPageComponent({
  driver,
}: {
  driver: FindDriverDetailsByIdType
}) {
  const t = useTranslations("Dashboard.ModifyDriver")
  const router = useRouter()

  const modifyDriverSchema = z.object({
    address: z
      .string()
      .min(20, t("Field1.Error1"))
      .max(300, t("Field1.Error2")),
    canDriveVehicleTypes: z
      .array(z.enum(VehicleTypesEnum))
      .min(1, t("Field2.Error1")),
    defaultAllowancePerDay: z.coerce
      .number<number>(t("Field3.Error1"))
      .min(1, t("Field3.Error2"))
      .max(10000, t("Field3.Error3"))
      .positive(t("Field3.Error4"))
      .multipleOf(1, t("Field3.Error5")),
    licenseNumber: z
      .string()
      .trim()
      .min(12, t("Field4.Error1"))
      .max(20, t("Field4.Error2")),
    licenseExpiresOn: z
      .date(t("Field5.Error1"))
      .min(driver.licenseExpiresOn ?? new Date(), t("Field5.Error2"))
      .nonoptional(t("Field5.Error1")),
    licensePhotos: z
      .instanceof(FileList)
      .refine((file) => {
        if (file.length < 1) return true
        return file[0]!.size < 1000000
      }, t("Field6.Error2"))
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
      }, t("Field6.Error3"))
      .optional(),
  })
  type ModifyDriverType = z.infer<typeof modifyDriverSchema>

  const formData = useForm<ModifyDriverType>({
    resolver: zodResolver(modifyDriverSchema),
    defaultValues: {
      address: driver.address,
      canDriveVehicleTypes: driver.canDriveVehicleTypes,
      defaultAllowancePerDay: driver.defaultAllowancePerDay,
      licenseNumber: driver.licenseNumber,
      licenseExpiresOn: driver.licenseExpiresOn ?? undefined,
    },
  })

  //Submit actions
  async function onSubmit(data: ModifyDriverType) {
    const modifyDriverData = {
      address: data.address,
      canDriveVehicleTypes: data.canDriveVehicleTypes,
      defaultAllowancePerDay: data.defaultAllowancePerDay,
      licenseNumber: data.licenseNumber,
      licenseExpiresOn: data.licenseExpiresOn,
      licensePhotos: data.licensePhotos,
    }
    const modifiedDriver = await modifyDriverAction(driver.id, modifyDriverData)
    if (modifiedDriver) {
      router.replace(`/dashboard/drivers/${driver.id}`)
      toast.success(t("Success"))
    } else {
      router.back()
      toast.error(t("Error"))
    }
  }

  return (
    <div id="ModifyDriver" className={pageClassName}>
      <Form {...formData}>
        <form
          id="ModifyDriverForm"
          onSubmit={formData.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 lg:gap-4 p-4 lg:p-5 bg-white rounded-lg shadow w-full"
        >
          <DashboardTextarea
            name={"address"}
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
          />
          <DashboardMultipleCheckbox
            array={getEnumValueDisplayPairs(VehicleTypesEnum)}
            name={"canDriveVehicleTypes"}
            label={t("Field2.Title")}
            register={formData.register("canDriveVehicleTypes")}
          />
          <DashboardInput
            name={"defaultAllowancePerDay"}
            type="tel"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
          <DashboardInput
            name={"licenseNumber"}
            type="text"
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
          />
          <DashboardDatePicker
            name="licenseExpiresOn"
            label={t("Field5.Title")}
            placeholder={t("Field5.Placeholder")}
            description={t("Field5.Description")}
          />
          <DashboardFileInput
            name={"licensePhotos"}
            register={formData.register("licensePhotos")}
            label={t("Field6.Title")}
            placeholder={t("Field6.Placeholder")}
            description={t("Field6.Description")}
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
