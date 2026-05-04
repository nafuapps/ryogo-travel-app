"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import z from "zod"
import { Form } from "@/components/ui/form"
import { Dispatch, SetStateAction } from "react"
import { RyogoInput, RyogoSelect } from "@/components/form/ryogoFormFields"
import {
  newBookingActionBlockClassName,
  newBookingFormBlockClassName,
  newBookingFormClassName,
  newBookingHeaderClassName,
  newBookingHeaderLineClassName,
} from "../../bookings/new/newBookingCommon"
import { CaptionGrey, H4, SmallGrey } from "@/components/typography"
import StepsTracker from "@/components/form/stepsTracker"
import { Button } from "@/components/ui/button"
import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { FindExistingVehiclesInAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { NewStepWrapper } from "@/components/page/pageWrappers"

export function NewVehicleStep1(props: {
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
      .max(15, t("Field1.Error2")),
    type: z.enum(VehicleTypesEnum).nonoptional(t("Field2.Error1")),
    brand: z.string().min(3, t("Field3.Error1")).max(15, t("Field3.Error2")),
    color: z.string().min(3, t("Field4.Error1")).max(15, t("Field4.Error2")),
    model: z.string().min(3, t("Field5.Error1")).max(30, t("Field5.Error2")),
  })

  type Step1Type = z.infer<typeof step1Schema>

  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      vehicleNumber: props.newVehicleFormData.data.vehicleNumber,
      type: props.newVehicleFormData.data.type,
      brand: props.newVehicleFormData.data.brand,
      color: props.newVehicleFormData.data.color,
      model: props.newVehicleFormData.data.model,
    },
  })

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    // Check if a vehicle with same number exists in this agency
    if (
      props.existingVehicles.some((v) => v.vehicleNumber === data.vehicleNumber)
    ) {
      formData.setError("vehicleNumber", {
        type: "manual",
        message: t("APIError"),
      })
    } else {
      props.setNewVehicleFormData({
        agencyId: props.agencyId,
        data: {
          ...props.newVehicleFormData.data,
          vehicleNumber: data.vehicleNumber,
          type: data.type,
          brand: data.brand,
          color: data.color,
          model: data.model,
        },
      })
      props.onNext()
    }
  }

  return (
    <NewStepWrapper id="NewVehicleStep1">
      <div id="Header" className={newBookingHeaderClassName}>
        <div className={newBookingHeaderLineClassName}>
          <H4>{t("Title")}</H4>
          <CaptionGrey>{t("Subtitle")}</CaptionGrey>
        </div>
        <StepsTracker total={5} current={0} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </div>
      <Form {...formData}>
        <form
          id="Step1Form"
          onSubmit={formData.handleSubmit(onSubmit)}
          className={newBookingFormClassName}
        >
          <div id="Step1Fields" className={newBookingFormBlockClassName}>
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
            <RyogoInput
              name={"brand"}
              type="text"
              label={t("Field3.Title")}
              placeholder={t("Field3.Placeholder")}
              description={t("Field3.Description")}
            />
            <RyogoInput
              name={"color"}
              type="text"
              label={t("Field4.Title")}
              placeholder={t("Field4.Placeholder")}
              description={t("Field4.Description")}
            />
            <RyogoInput
              name={"model"}
              type="text"
              label={t("Field5.Title")}
              placeholder={t("Field5.Placeholder")}
              description={t("Field5.Description")}
            />
          </div>
          <div id="FormActions" className={newBookingActionBlockClassName}>
            <Button
              variant={"default"}
              size={"lg"}
              type="submit"
              disabled={formData.formState.isSubmitting}
            >
              {formData.formState.isSubmitting && <Spinner />}
              {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
            </Button>
          </div>
        </form>
      </Form>
    </NewStepWrapper>
  )
}
