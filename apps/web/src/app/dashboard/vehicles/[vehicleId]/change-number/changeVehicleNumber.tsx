"use client"

import { RyogoInput } from "@/components/form/ryogoFormFields"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  MAX_VEHICLE_NUMBER_LENGTH,
  MIN_VEHICLE_NUMBER_LENGTH,
} from "@/lib/uiConfig"
import {
  FormWrapper,
  FormContentWrapper,
  PageWrapper,
  StickyActionWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { FindExistingVehiclesInAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import { changeVehicleNumberAction } from "@/app/actions/vehicles/changeVehicleNumberAction"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import { RyogoH3 } from "@/components/typography"

export default function ChangeVehicleNumberPageComponent({
  vehicleId,
  agencyId,
  oldVehicleNumber,
  addedByUserId,
  allVehicles,
}: {
  vehicleId: string
  agencyId: string
  oldVehicleNumber: string
  addedByUserId: string
  allVehicles: FindExistingVehiclesInAgencyType
}) {
  const t = useTranslations("Dashboard.VehicleDetails.ChangeVehicleNumber")
  const router = useRouter()

  const schema = z.object({
    vNumber: z
      .string()
      .trim()
      .min(MIN_VEHICLE_NUMBER_LENGTH, t("Field1.Error1"))
      .max(MAX_VEHICLE_NUMBER_LENGTH, t("Field1.Error2"))
      .refine((value) => {
        //Check that vehicleNumber does not already exist in this agency
        return !allVehicles.some(
          (v) => v.vehicleNumber.toUpperCase() === value.toUpperCase(),
        )
      }, t("APIError")),
  })

  type SchemaType = z.infer<typeof schema>

  const formData = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      vNumber: oldVehicleNumber,
    },
  })

  const onSubmit = async (data: SchemaType) => {
    const updatedVehicle = await changeVehicleNumberAction(
      vehicleId,
      agencyId,
      addedByUserId,
      data.vNumber,
      oldVehicleNumber,
    )
    if (updatedVehicle) {
      toast.success(t("Success"))
      router.replace(`/dashboard/vehicles/${vehicleId}`)
    } else {
      toast.error(t("Error"))
    }
  }

  return (
    <PageWrapper id="ChangeVehicleNumberPage">
      <FormWrapper<SchemaType>
        id="ChangeVehicleNumberForm"
        form={formData}
        onSubmit={formData.handleSubmit(onSubmit)}
      >
        <SectionRowWrapper className="items-start justify-between">
          <RyogoH3>{t("Title")}</RyogoH3>
          <HelpIconButton href="/dashboard/support/help-vehicles" />
        </SectionRowWrapper>
        <FormContentWrapper>
          <RyogoInput
            name={"vNumber"}
            type="text"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
        </FormContentWrapper>
        <StickyActionWrapper>
          <RyogoDefaultButton
            size={"lg"}
            type="submit"
            disabled={formData.formState.isSubmitting}
            showSpinner={formData.formState.isSubmitting}
            label={
              formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")
            }
          />
          <RyogoOutlineButton
            disabled={formData.formState.isSubmitting}
            type="button"
            onClick={() => router.back()}
            label={t("Close")}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
