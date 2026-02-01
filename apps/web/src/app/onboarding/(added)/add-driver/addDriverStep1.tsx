import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import {
  OnboardingFileInput,
  OnboardingInput,
} from "@/app/onboarding/components/onboardingFields"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
} from "@/app/onboarding/components/onboardingSteps"
import { Form } from "@/components/ui/form"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"

export function AddDriverStep1(props: {
  onNext: () => void
  finalData: AddDriverRequestType
  updateFinalData: Dispatch<SetStateAction<AddDriverRequestType>>
  allDrivers: FindAllUsersByRoleType
}) {
  const t = useTranslations("Onboarding.AddDriverPage.Step1")

  const step1Schema = z.object({
    driverName: z
      .string()
      .min(5, t("Field1.Error1"))
      .max(30, t("Field1.Error2")),
    driverPhone: z.string().length(10, t("Field2.Error1")),
    driverEmail: z.email(t("Field3.Error1")).max(60, t("Field3.Error2")),
    driverPhotos: z
      .instanceof(FileList)
      .refine((file) => {
        if (file.length < 1) return true
        return file[0] && file[0]!.size < 1000000
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
          ].includes(file[0]!.type)
        )
      }, t("Field4.Error2"))
      .optional(),
  })

  type Step1Type = z.infer<typeof step1Schema>

  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      driverName: props.finalData.data.name,
      driverPhone: props.finalData.data.phone,
      driverEmail: props.finalData.data.email,
      driverPhotos: props.finalData.data.userPhotos,
    },
  })

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    if (
      props.allDrivers.some(
        (d) => d.email == data.driverEmail && d.phone == data.driverPhone,
      )
    ) {
      //If driver exists with same email and phone already in system, show error
      formData.setError("driverPhone", {
        type: "manual",
        message: t("APIError"),
      })
    }
    props.updateFinalData({
      agencyId: props.finalData.agencyId,
      data: {
        ...props.finalData.data,
        name: data.driverName,
        phone: data.driverPhone,
        email: data.driverEmail,
        userPhotos: data.driverPhotos,
      },
    })
    props.onNext()
  }

  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step1Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step1Content">
          <OnboardingInput
            name={"driverName"}
            type="text"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <OnboardingInput
            name={"driverPhone"}
            type="tel"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <OnboardingInput
            name={"driverEmail"}
            type="email"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
          <OnboardingFileInput
            name={"agenctPhotos"}
            register={formData.register("driverPhotos")}
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step1Actions">
          <OnboardingStepPrimaryAction
            disabled={formData.formState.isSubmitting}
          >
            {formData.formState.isSubmitting && <Spinner />}
            {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </OnboardingStepPrimaryAction>
        </OnboardingStepActions>
      </OnboardingStepForm>
    </Form>
  )
}
