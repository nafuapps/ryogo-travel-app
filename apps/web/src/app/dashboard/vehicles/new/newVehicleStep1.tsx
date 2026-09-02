"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import z from "zod"
import { Dispatch, SetStateAction } from "react"
import {
  RyogoCombobox,
  RyogoInput,
  RyogoSelect,
} from "@/components/form/ryogoFormFields"
import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import StepsTracker from "@/components/form/stepsTracker"
import {
  VehicleTypesEnum,
  VehicleBrandEnum,
  VehicleColorEnum,
} from "@ryogo-travel-app/db/schema"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { FindExistingVehiclesInAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import {
  NewStepHeaderWrapper,
  NewStepTitleWrapper,
  NewStepWrapper,
  NewFormWrapper,
  NewFormContentWrapper,
  NewFormActionWrapper,
} from "@/components/form/newFormWrappers"
import QuickAddVehicleAlertButton from "@/components/buttons/alert/quickAddVehicleAlertButton"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"

export function NewVehicleStep1({
  onNext,
  newVehicleFormData,
  setNewVehicleFormData,
  agencyId,
  existingVehicles,
}: {
  onNext: () => void
  newVehicleFormData: AddVehicleRequestType
  setNewVehicleFormData: Dispatch<SetStateAction<AddVehicleRequestType>>
  agencyId: string
  existingVehicles: FindExistingVehiclesInAgencyType
}) {
  const t = useTranslations("Dashboard.NewVehicle.Step1")

  const step1Schema = z.object({
    vehicleNumber: z
      .string()
      .trim()
      .min(7, t("Field1.Error1"))
      .max(15, t("Field1.Error2"))
      .refine((value) => {
        //Check that vehicleNumber does not already exist in this agency
        return !existingVehicles.some(
          (v) => v.vehicleNumber.toUpperCase() === value.toUpperCase(),
        )
      }, t("APIError")),
    type: z.enum(VehicleTypesEnum).nonoptional(t("Field2.Error1")),
    brand: z.enum(VehicleBrandEnum).nonoptional(t("Field3.Error1")),
    color: z.enum(VehicleColorEnum).nonoptional(t("Field4.Error1")),
    model: z.string().min(3, t("Field5.Error1")).max(30, t("Field5.Error2")),
  })

  type Step1Type = z.infer<typeof step1Schema>

  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      vehicleNumber: newVehicleFormData.data.vehicleNumber,
      type: newVehicleFormData.data.type,
      brand: newVehicleFormData.data.brand,
      color: newVehicleFormData.data.color,
      model: newVehicleFormData.data.model,
    },
  })

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    setNewVehicleFormData({
      agencyId: agencyId,
      data: {
        ...newVehicleFormData.data,
        vehicleNumber: data.vehicleNumber,
        type: data.type,
        brand: data.brand,
        color: data.color,
        model: data.model,
      },
    })
    onNext()
  }

  return (
    <NewStepWrapper id="NewVehicleStep1">
      <NewStepHeaderWrapper>
        <NewStepTitleWrapper>
          <RyogoH3>{t("Title")}</RyogoH3>
          <RyogoCaption color="light">{t("Subtitle")}</RyogoCaption>
        </NewStepTitleWrapper>
        <StepsTracker steps={"vehicle"} current={0} />
        <RyogoSmall color="slate">{t("Description")}</RyogoSmall>
      </NewStepHeaderWrapper>
      <NewFormWrapper<Step1Type>
        id="Step1Form"
        form={formData}
        onSubmit={formData.handleSubmit(onSubmit)}
      >
        <NewFormContentWrapper>
          <RyogoInput
            name={"vehicleNumber"}
            type="text"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <RyogoSelect
            name={"type"}
            register={formData.register("type")}
            array={getEnumValueDisplayPairs(VehicleTypesEnum)}
            title={t("Field2.Title")}
            placeholder={t("Field2.Title")}
          />
          <RyogoCombobox
            name={"brand"}
            register={formData.register("brand")}
            title={t("Field3.Title")}
            array={getEnumValueDisplayPairs(VehicleBrandEnum)}
            placeholder={t("Field3.Placeholder")}
          />
          <RyogoCombobox
            name={"color"}
            register={formData.register("color")}
            array={getEnumValueDisplayPairs(VehicleColorEnum)}
            title={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
          />
          <RyogoInput
            name={"model"}
            type="text"
            label={t("Field5.Title")}
            placeholder={t("Field5.Placeholder")}
            description={t("Field5.Description")}
          />
        </NewFormContentWrapper>
        <NewFormActionWrapper>
          <RyogoDefaultButton
            size={"lg"}
            type="submit"
            disabled={formData.formState.isSubmitting}
            showSpinner={formData.formState.isSubmitting}
            label={
              formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")
            }
          />

          <QuickAddVehicleAlertButton
            vehicleNumber={formData.getValues("vehicleNumber")}
            type={formData.getValues("type")}
            brand={formData.getValues("brand")}
            color={formData.getValues("color")}
            model={formData.getValues("model")}
            agencyId={agencyId}
            disabled={
              !formData.formState.isValid || formData.formState.isSubmitting
            }
          />
        </NewFormActionWrapper>
      </NewFormWrapper>
    </NewStepWrapper>
  )
}
