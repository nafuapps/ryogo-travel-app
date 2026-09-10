"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import {
  RyogoInput,
  RyogoMultipleCheckbox,
  RyogoTextarea,
} from "@/components/form/ryogoFormFields"
import { RyogoH3, RyogoCaption, RyogoSmall } from "@/components/typography"
import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import StepsTracker from "@/components/form/stepsTracker"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  MIN_PER_DAY_CHARGE,
  MAX_PER_DAY_CHARGE,
  MAX_FIELD_DESC_LENGTH,
  MIN_FIELD_DESC_LENGTH,
} from "@/lib/uiConfig"
import {
  SectionRowWrapper,
  PageWrapper,
  StickyActionWrapper,
  FormContentWrapper,
  FormWrapper,
} from "@/components/page/pageWrappers"

export function NewDriverStep3({
  onNext,
  onPrev,
  newDriverFormData,
  setNewDriverFormData,
}: {
  onNext: () => void
  onPrev: () => void
  newDriverFormData: AddDriverRequestType
  setNewDriverFormData: Dispatch<SetStateAction<AddDriverRequestType>>
}) {
  const t = useTranslations("Dashboard.NewDriver.Step3")
  const step3Schema = z.object({
    driverAddress: z
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
  })
  type Step3Type = z.infer<typeof step3Schema>
  const formData = useForm<Step3Type>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      driverAddress: newDriverFormData.data.address,
      canDriveVehicleTypes: newDriverFormData.data.canDriveVehicleTypes,
      defaultAllowancePerDay: newDriverFormData.data.defaultAllowancePerDay,
    },
  })

  //Submit actions
  const onSubmit = (data: Step3Type) => {
    setNewDriverFormData({
      ...newDriverFormData,
      data: {
        ...newDriverFormData.data,
        address: data.driverAddress,
        canDriveVehicleTypes: data.canDriveVehicleTypes,
        defaultAllowancePerDay: data.defaultAllowancePerDay,
      },
    })
    onNext()
  }

  return (
    <PageWrapper id="NewDriverStep3">
      <FormWrapper<Step3Type>
        id="Step3Form"
        form={formData}
        onSubmit={formData.handleSubmit(onSubmit)}
      >
        <SectionRowWrapper end>
          <RyogoH3>{t("Title")}</RyogoH3>
          <RyogoCaption color="light">{t("Subtitle")}</RyogoCaption>
        </SectionRowWrapper>
        <StepsTracker steps={"driver"} current={2} />
        <RyogoSmall color="slate">{t("Description")}</RyogoSmall>
        <FormContentWrapper>
          <RyogoTextarea
            name={"driverAddress"}
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
            size={"lg"}
            type="button"
            onClick={onPrev}
            disabled={formData.formState.isSubmitting}
            label={t("SecondaryCTA")}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
