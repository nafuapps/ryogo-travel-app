"use client"

import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  RyogoCheckbox,
  RyogoFileInput,
  RyogoInput,
  RyogoOTPInput,
  RyogoTextarea,
} from "@/components/form/ryogoFormFields"
import {
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import compressImage from "@/lib/imageCompression"
import { FileRegex } from "@/lib/regex"
import {
  MAX_EMAIL_LENGTH,
  MAX_FIELD_DESC_LENGTH,
  MIN_FIELD_DESC_LENGTH,
  PHONE_LENGTH,
} from "@/lib/uiConfig"
import { checkImageFileSize, checkImageFileType } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { FindAllAgenciesType } from "@ryogo-travel-app/api/services/agency.services"
import { CreateOwnerAccountRequestType } from "@ryogo-travel-app/api/types/user.types"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction, useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"

export function CreateAccountStep2({
  onNext,
  onPrev,
  finalData,
  updateFinalData,
  allAgencies,
}: {
  onNext: () => void
  onPrev: () => void
  finalData: CreateOwnerAccountRequestType
  updateFinalData: Dispatch<SetStateAction<CreateOwnerAccountRequestType>>
  allAgencies: FindAllAgenciesType
}) {
  const t = useTranslations("Onboarding.CreateAccountPage.Step2")

  const step2Schema = z.object({
    agencyPhone: z.string().length(PHONE_LENGTH, t("Field1.Error1")),
    sameAsOwnerPhone: z.boolean(),
    agencyEmail: z
      .email(t("Field2.Error1"))
      .max(MAX_EMAIL_LENGTH, t("Field2.Error2")),
    sameAsOwnerEmail: z.boolean(),
    agencyAddress: z
      .string()
      .min(MIN_FIELD_DESC_LENGTH, t("Field3.Error1"))
      .max(MAX_FIELD_DESC_LENGTH, t("Field3.Error2")),
    ownerPhoto: FileRegex.refine((file) => {
      return checkImageFileSize(file, true)
    }, t("Field4.Error1"))
      .refine((file) => {
        return checkImageFileType(file, true)
      }, t("Field4.Error2"))
      .optional(),
  })
  type Step2Type = z.infer<typeof step2Schema>
  const formData = useForm<Step2Type>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      agencyPhone: finalData.agency.businessPhone,
      sameAsOwnerPhone: false,
      agencyEmail: finalData.agency.businessEmail,
      sameAsOwnerEmail: false,
      agencyAddress: finalData.agency.businessAddress,
    },
  })

  // Watch the checkbox and the source input field
  const phoneCopySelection = useWatch({
    name: "sameAsOwnerPhone",
    control: formData.control,
  })

  const emailCopySelection = useWatch({
    name: "sameAsOwnerEmail",
    control: formData.control,
  })

  //Set agencyPhone field based on checkbox selection
  useEffect(() => {
    formData.setValue(
      "agencyPhone",
      phoneCopySelection ? finalData.owner.phone : "",
    )
  }, [phoneCopySelection])

  //Set agencyEmail field based on checkbox selection
  useEffect(() => {
    formData.setValue(
      "agencyEmail",
      emailCopySelection ? finalData.owner.email : "",
    )
  }, [emailCopySelection])

  //Submit actions
  const onSubmit = async (values: Step2Type) => {
    if (
      allAgencies.some(
        (a) =>
          a.businessEmail === values.agencyEmail &&
          a.businessPhone === values.agencyPhone,
      )
    ) {
      formData.setError("agencyPhone", {
        type: "manual",
        message: t("APIError"),
      })
    } else {
      updateFinalData({
        agency: {
          ...finalData.agency,
          businessPhone: values.agencyPhone,
          businessEmail: values.agencyEmail,
          businessAddress: values.agencyAddress,
        },
        owner: {
          ...finalData.owner,
          photos:
            (await compressImage(values.ownerPhoto)) ?? finalData.owner.photos,
        },
      })
      onNext()
    }
  }

  return (
    <FormWrapper<Step2Type>
      id="Step2Form"
      form={formData}
      onSubmit={formData.handleSubmit(onSubmit)}
    >
      <FormContentWrapper asCard={false}>
        <RyogoOTPInput
          length={10}
          name={"agencyPhone"}
          label={t("Field1.Title")}
          description={t("Field1.Description")}
        />
        <RyogoCheckbox name={"sameAsOwnerPhone"} label={t("Field1.Checkbox")} />
        <RyogoInput
          name={"agencyEmail"}
          type="email"
          label={t("Field2.Title")}
          placeholder={t("Field2.Placeholder")}
          description={t("Field2.Description")}
        />
        <RyogoCheckbox name={"sameAsOwnerEmail"} label={t("Field2.Checkbox")} />
        <RyogoTextarea
          name={"agencyAddress"}
          label={t("Field3.Title")}
          placeholder={t("Field3.Placeholder")}
        />
        <RyogoFileInput
          name={"ownerPhoto"}
          register={formData.register("ownerPhoto")}
          label={t("Field4.Title")}
          placeholder={t("Field4.Placeholder")}
          description={t("Field4.Description")}
          existingFile={finalData.owner.photos}
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
