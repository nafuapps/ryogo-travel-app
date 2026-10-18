"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"
import {
  RyogoCombobox,
  RyogoFileInput,
  RyogoInput,
} from "@/components/form/ryogoFormFields"
import stateCityData from "@/lib/states_cities.json"
import { CreateOwnerAccountRequestType } from "@ryogo-travel-app/api/types/user.types"
import { FileRegex } from "@/lib/regex"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { MAX_COMMISSION_RATE, MIN_COMMISSION_RATE } from "@/lib/uiConfig"
import {
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { checkImageFileSize, checkImageFileType } from "@/lib/utils"
import compressImage from "@/lib/imageCompression"

export function CreateAccountStep3({
  onNext,
  onPrev,
  finalData,
  updateFinalData,
}: {
  onNext: () => void
  onPrev: () => void
  finalData: CreateOwnerAccountRequestType
  updateFinalData: Dispatch<SetStateAction<CreateOwnerAccountRequestType>>
}) {
  const t = useTranslations("Onboarding.CreateAccountPage.Step3")
  const step3Schema = z.object({
    agencyLogo: FileRegex.refine((file) => {
      if (file.length < 1) return true
      return checkImageFileSize(file)
    }, t("Field1.Error1"))
      .refine((file) => {
        if (file.length < 1) return true
        return checkImageFileType(file)
      }, t("Field1.Error2"))
      .optional(),
    commissionRate: z.coerce
      .number<number>(t("Field2.Error1"))
      .min(MIN_COMMISSION_RATE, t("Field2.Error2"))
      .max(MAX_COMMISSION_RATE, t("Field2.Error3"))
      .positive(t("Field2.Error4"))
      .multipleOf(1, t("Field2.Error5"))
      .optional(),
    agencyState: z
      .string()
      .trim()
      .min(1, t("Field3.Error1"))
      .nonoptional(t("Field3.Error1")),
    agencyCity: z
      .string()
      .trim()
      .min(1, t("Field4.Error1"))
      .nonoptional(t("Field4.Error1")),
    qrCode: FileRegex.refine((file) => {
      if (file.length < 1) return true
      return checkImageFileSize(file)
    }, t("Field5.Error1"))
      .refine((file) => {
        if (file.length < 1) return true
        return checkImageFileType(file)
      }, t("Field5.Error2"))
      .optional(),
  })
  type Step3Type = z.infer<typeof step3Schema>
  const formData = useForm<Step3Type>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      commissionRate: finalData.agency.commissionRate,
      agencyState: finalData.agency.agencyState,
      agencyCity: finalData.agency.agencyCity,
    },
  })

  //Submit actions
  const onSubmit = async (data: Step3Type) => {
    updateFinalData({
      ...finalData,
      agency: {
        ...finalData.agency,
        logo: await compressImage(data.agencyLogo),
        commissionRate: data.commissionRate,
        agencyState: data.agencyState,
        agencyCity: data.agencyCity,
      },
    })
    onNext()
  }

  const data: Record<string, string[]> = stateCityData
  const selectedState = useWatch({
    name: "agencyState",
    control: formData.control,
  })
  const cityOptions = data[selectedState] ?? [t("Field4.Title")]

  return (
    <FormWrapper<Step3Type>
      id="Step3Form"
      form={formData}
      onSubmit={formData.handleSubmit(onSubmit)}
    >
      <FormContentWrapper asCard={false}>
        <RyogoFileInput
          name={"agencyLogo"}
          register={formData.register("agencyLogo")}
          label={t("Field1.Title")}
          placeholder={t("Field1.Placeholder")}
          description={t("Field1.Description")}
          existingFile={finalData.agency.logo}
        />
        <RyogoInput
          name={"commissionRate"}
          type="tel"
          label={t("Field2.Title")}
          placeholder={t("Field2.Placeholder")}
          description={t("Field2.Description")}
        />
        <RyogoCombobox
          name={"agencyState"}
          register={formData.register("agencyState")}
          title={t("Field3.Title")}
          array={Object.keys(data)}
          placeholder={t("Field3.Title")}
          resetField={() => {
            formData.setValue("agencyCity", "")
          }}
        />
        <RyogoCombobox
          name={"agencyCity"}
          register={formData.register("agencyCity")}
          title={t("Field4.Title")}
          array={cityOptions}
          placeholder={t("Field4.Title")}
        />
        <RyogoFileInput
          name={"qrCode"}
          register={formData.register("qrCode")}
          label={t("Field5.Title")}
          placeholder={t("Field5.Placeholder")}
          description={t("Field5.Description")}
          existingFile={finalData.agency.qrCode}
        />
      </FormContentWrapper>
      <StickyActionWrapper bgTransparent>
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
  )
}
