import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction, useEffect } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import {
  OnboardingInput,
  OnboardingCheckbox,
  OnboardingTextarea,
  OnboardingFileInput,
} from "../components/onboardingFields"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
  OnboardingStepSecondaryAction,
} from "../components/onboardingSteps"
import { Form } from "@/components/ui/form"
import { FindAllAgenciesType } from "@ryogo-travel-app/api/services/agency.services"
import { CreateOwnerAccountRequestType } from "@ryogo-travel-app/api/types/user.types"

export function CreateAccountStep2(props: {
  onNext: () => void
  onPrev: () => void
  finalData: CreateOwnerAccountRequestType
  updateFinalData: Dispatch<SetStateAction<CreateOwnerAccountRequestType>>
  allAgencies: FindAllAgenciesType
}) {
  const t = useTranslations("Onboarding.CreateAccountPage.Step2")

  const step2Schema = z.object({
    agencyPhone: z.string().length(10, t("Field1.Error1")),
    sameAsOwnerPhone: z.boolean(),
    agencyEmail: z.email(t("Field2.Error1")).max(60, t("Field2.Error2")),
    sameAsOwnerEmail: z.boolean(),
    agencyAddress: z
      .string()
      .min(20, t("Field3.Error1"))
      .max(300, t("Field3.Error2")),
    ownerPhoto: z
      .instanceof(FileList)
      .refine((file) => {
        if (file.length < 1) return true
        return file[0] && file[0].size < 1000000
      }, t("Field4.Error1"))
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
          ].includes(file[0].type)
        )
      }, t("Field4.Error2"))
      .optional(),
  })
  type Step2Type = z.infer<typeof step2Schema>
  const formData = useForm<Step2Type>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      agencyPhone: props.finalData.agency.businessPhone,
      sameAsOwnerPhone: false,
      agencyEmail: props.finalData.agency.businessEmail,
      sameAsOwnerEmail: false,
      agencyAddress: props.finalData.agency.businessAddress,
      ownerPhoto: props.finalData.owner.photos,
    },
  })

  const setValue = formData.setValue
  // Watch the checkbox and the source input field
  const phoneCopySelection = formData.watch("sameAsOwnerPhone")
  const phoneSourceValue = props.finalData.owner.phone

  const emailCopySelection = formData.watch("sameAsOwnerEmail")
  const emailSourceValue = props.finalData.owner.email

  useEffect(() => {
    if (phoneCopySelection) {
      // If the checkbox is checked, set the target input's value
      setValue("agencyPhone", phoneSourceValue)
    } else {
      // Optionally, clear the target input if unchecked
      setValue("agencyPhone", "")
    }
  }, [phoneCopySelection, phoneSourceValue, setValue])

  useEffect(() => {
    if (emailCopySelection) {
      // If the checkbox is checked, set the target input's value
      setValue("agencyEmail", emailSourceValue) // Name of the input to copy to
    } else {
      // Optionally, clear the target input if unchecked
      setValue("agencyEmail", "")
    }
  }, [emailCopySelection, emailSourceValue, setValue])

  //Submit actions
  const onSubmit = async (data: Step2Type) => {
    if (
      props.allAgencies.some(
        (a) =>
          a.businessEmail === data.agencyEmail &&
          a.businessPhone === data.agencyPhone,
      )
    ) {
      formData.setError("agencyPhone", {
        type: "manual",
        message: t("APIError"),
      })
    } else {
      props.updateFinalData({
        agency: {
          ...props.finalData.agency,
          businessPhone: data.agencyPhone,
          businessEmail: data.agencyEmail,
          businessAddress: data.agencyAddress,
        },
        owner: {
          ...props.finalData.owner,
          photos: data.ownerPhoto,
        },
      })
      props.onNext()
    }
  }

  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step2Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step2Content">
          <OnboardingInput
            name={"agencyPhone"}
            type="tel"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <OnboardingCheckbox
            register={formData.register("sameAsOwnerPhone")}
            name={"sameAsOwnerPhone"}
            label={t("Field1.Checkbox")}
          />
          <OnboardingInput
            name={"agencyEmail"}
            type="email"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <OnboardingCheckbox
            register={formData.register("sameAsOwnerEmail")}
            name={"sameAsOwnerEmail"}
            label={t("Field2.Checkbox")}
          />
          <OnboardingTextarea
            name={"agencyAddress"}
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
          />
          <OnboardingFileInput
            name={"ownerPhoto"}
            register={formData.register("ownerPhoto")}
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step2Actions">
          <OnboardingStepPrimaryAction
            disabled={formData.formState.isSubmitting}
          >
            {formData.formState.isSubmitting && <Spinner />}
            {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </OnboardingStepPrimaryAction>
          <OnboardingStepSecondaryAction
            onClick={props.onPrev}
            disabled={formData.formState.isSubmitting}
          >
            {t("SecondaryCTA")}
          </OnboardingStepSecondaryAction>
        </OnboardingStepActions>
      </OnboardingStepForm>
    </Form>
  )
}
