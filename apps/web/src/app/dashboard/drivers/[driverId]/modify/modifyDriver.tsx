"use client"

import { modifyDriverAction } from "@/app/actions/drivers/modifyDriverAction"
import {
  RyogoTextarea,
  RyogoMultipleCheckbox,
  RyogoInput,
  RyogoDatePicker,
  RyogoFileInput,
} from "@/components/form/ryogoFormFields"
import {
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { FindDriverDetailsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { ModifyDriverRequestType } from "@ryogo-travel-app/api/types/driver.types"
import { FileRegex, SupportedImageFormats } from "@/lib/regex"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  MAX_FIELD_DESC_LENGTH,
  MAX_FILE_UPLOAD_SIZE,
  MAX_LICENSE_LENGTH,
  MAX_PER_DAY_CHARGE,
  MIN_FIELD_DESC_LENGTH,
  MIN_LICENSE_LENGTH,
  MIN_PER_DAY_CHARGE,
} from "@/lib/uiConfig"

export default function ModifyDriverPageComponent({
  driver,
}: {
  driver: NonNullable<FindDriverDetailsByIdType>
}) {
  const t = useTranslations("Dashboard.ModifyDriver")
  const router = useRouter()

  const modifyDriverSchema = z.object({
    address: z
      .string()
      .min(MIN_FIELD_DESC_LENGTH, t("Field1.Error1"))
      .max(MAX_FIELD_DESC_LENGTH, t("Field1.Error2")),
    canDriveVehicleTypes: z
      .array(z.enum(VehicleTypesEnum))
      .min(1, t("Field2.Error1")),
    defaultAllowancePerDay: z.coerce
      .number<number>(t("Field3.Error1"))
      .min(MIN_PER_DAY_CHARGE, t("Field3.Error2"))
      .max(MAX_PER_DAY_CHARGE, t("Field3.Error3"))
      .positive(t("Field3.Error4"))
      .multipleOf(1, t("Field3.Error5")),
    licenseNumber: z
      .string()
      .trim()
      .min(MIN_LICENSE_LENGTH, t("Field4.Error1"))
      .max(MAX_LICENSE_LENGTH, t("Field4.Error2")),
    licenseExpiresOn: z
      .date(t("Field5.Error1"))
      .min(driver.licenseExpiresOn ?? new Date(), t("Field5.Error2"))
      .nonoptional(t("Field5.Error1")),
    licensePhotos: FileRegex.refine((file) => {
      if (file.length < 1) return true
      return file[0] && file[0].size < MAX_FILE_UPLOAD_SIZE
    }, t("Field6.Error2"))
      .refine((file) => {
        if (file.length < 1) return true
        return file[0] && SupportedImageFormats.includes(file[0].type)
      }, t("Field6.Error3"))
      .optional(),
  })

  type ModifyDriverType = z.infer<typeof modifyDriverSchema>

  const form = useForm<ModifyDriverType>({
    resolver: zodResolver(modifyDriverSchema),
    defaultValues: {
      address: driver.address ?? undefined,
      canDriveVehicleTypes: driver.canDriveVehicleTypes,
      defaultAllowancePerDay: driver.defaultAllowancePerDay,
      licenseNumber: driver.licenseNumber ?? undefined,
      licenseExpiresOn: driver.licenseExpiresOn ?? undefined,
    },
  })

  //Submit actions
  async function onSubmit(data: ModifyDriverType) {
    const modifyDriverData: ModifyDriverRequestType = {
      driverId: driver.id,
      agencyId: driver.agencyId,
      address: data.address,
      canDriveVehicleTypes: data.canDriveVehicleTypes,
      defaultAllowancePerDay: data.defaultAllowancePerDay,
      licenseNumber: data.licenseNumber,
      licenseExpiresOn: data.licenseExpiresOn,
      licensePhotos: data.licensePhotos,
    }
    const updatedDriver = await modifyDriverAction(modifyDriverData)
    if (updatedDriver) {
      router.replace(`/dashboard/drivers/${driver.id}`)
      toast.success(t("Success"))
    } else {
      toast.error(t("Error"))
    }
  }

  return (
    <PageWrapper id="ModifyDriver">
      <FormWrapper<ModifyDriverType>
        form={form}
        id="ModifyDriverForm"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormContentWrapper>
          <RyogoTextarea
            name={"address"}
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
          />
          <RyogoMultipleCheckbox
            array={getEnumValueDisplayPairs(VehicleTypesEnum)}
            name={"canDriveVehicleTypes"}
            label={t("Field2.Title")}
          />
          <RyogoInput
            name={"defaultAllowancePerDay"}
            type="tel"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
          <RyogoInput
            name={"licenseNumber"}
            type="text"
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
          />
          <RyogoDatePicker
            name="licenseExpiresOn"
            label={t("Field5.Title")}
            placeholder={t("Field5.Placeholder")}
            description={t("Field5.Description")}
          />
          <RyogoFileInput
            name={"licensePhotos"}
            register={form.register("licensePhotos")}
            label={t("Field6.Title")}
            placeholder={t("Field6.Placeholder")}
            description={t("Field6.Description")}
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
