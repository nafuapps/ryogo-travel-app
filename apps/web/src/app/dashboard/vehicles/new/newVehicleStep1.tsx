"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import z from "zod"
import { Dispatch, SetStateAction } from "react"
import { RyogoInput, RyogoSelect } from "@/components/form/ryogoFormFields"
import {
  VehicleTypesEnum,
  VehicleBrandEnum,
  VehicleColorEnum,
} from "@ryogo-travel-app/db/schema"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { FindExistingVehiclesInAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import QuickAddVehicleAlertButton from "@/components/buttons/alert/quickAddVehicleAlertButton"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import {
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
  MAX_VEHICLE_NUMBER_LENGTH,
  MIN_VEHICLE_NUMBER_LENGTH,
  AddVehicleTotalSteps,
} from "@/lib/uiConfig"
import {
  PageWrapper,
  StickyActionWrapper,
  FormContentWrapper,
  FormWrapper,
} from "@/components/page/pageWrappers"
import FormStepHeader from "@/components/form/formStepHeader"

export function NewVehicleStep1({
  onNext,
  newVehicleFormData,
  setNewVehicleFormData,
  agencyId,
  userId,
  existingVehicles,
}: {
  onNext: () => void
  newVehicleFormData: AddVehicleRequestType
  setNewVehicleFormData: Dispatch<SetStateAction<AddVehicleRequestType>>
  agencyId: string
  userId: string
  existingVehicles: FindExistingVehiclesInAgencyType
}) {
  const t = useTranslations("Dashboard.NewVehicle.Step1")

  const step1Schema = z.object({
    vehicleNumber: z
      .string()
      .trim()
      .min(MIN_VEHICLE_NUMBER_LENGTH, t("Field1.Error1"))
      .max(MAX_VEHICLE_NUMBER_LENGTH, t("Field1.Error2"))
      .refine((value) => {
        //Check that vehicleNumber does not already exist in this agency
        return !existingVehicles.some(
          (v) => v.vehicleNumber.toUpperCase() === value.toUpperCase(),
        )
      }, t("APIError")),
    type: z.enum(VehicleTypesEnum).nonoptional(t("Field2.Error1")),
    brand: z.enum(VehicleBrandEnum).nonoptional(t("Field3.Error1")),
    color: z.enum(VehicleColorEnum).nonoptional(t("Field4.Error1")),
    model: z
      .string()
      .min(MIN_NAME_LENGTH, t("Field5.Error1"))
      .max(MAX_NAME_LENGTH, t("Field5.Error2")),
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
      ...newVehicleFormData,
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
    <PageWrapper id="NewVehicleStep1">
      <FormStepHeader
        totalSteps={AddVehicleTotalSteps}
        currentStepIndex={1}
        title={t("Title")}
        stepLabel={t("Subtitle", {
          current: 2,
          total: AddVehicleTotalSteps,
        })}
        description={t("Description")}
      />
      <FormWrapper<Step1Type>
        id="Step1Form"
        form={formData}
        onSubmit={formData.handleSubmit(onSubmit)}
      >
        <FormContentWrapper>
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
          <RyogoSelect
            name={"brand"}
            register={formData.register("brand")}
            title={t("Field3.Title")}
            description={t("Field3.Description")}
            array={getEnumValueDisplayPairs(VehicleBrandEnum)}
            placeholder={t("Field3.Placeholder")}
          />
          <RyogoSelect
            name={"color"}
            register={formData.register("color")}
            description={t("Field4.Description")}
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

          <QuickAddVehicleAlertButton
            vehicleNumber={formData.getValues("vehicleNumber")}
            type={formData.getValues("type")}
            brand={formData.getValues("brand")}
            color={formData.getValues("color")}
            model={formData.getValues("model")}
            agencyId={agencyId}
            addedByUserId={userId}
            disabled={
              !formData.formState.isValid || formData.formState.isSubmitting
            }
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
