import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import {
  OnboardingFileInput,
  OnboardingInput,
  OnboardingSelect,
} from "../components/onboardingFields"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepSecondaryAction,
  OnboardingStepPrimaryAction,
} from "../components/onboardingSteps"
import stateCityData from "@/lib/states_cities.json"
import { Form } from "@/components/ui/form"
import {
  getArrayValueDisplayPairs,
  getStringValueDisplayPairs,
} from "@/lib/utils"
import { CreateOwnerAccountRequestType } from "@ryogo-travel-app/api/types/user.types"

export function CreateAccountStep3(props: {
  onNext: () => void
  onPrev: () => void
  finalData: CreateOwnerAccountRequestType
  updateFinalData: Dispatch<SetStateAction<CreateOwnerAccountRequestType>>
}) {
  const t = useTranslations("Onboarding.CreateAccountPage.Step3")
  const step3Schema = z.object({
    agencyLogo: z
      .instanceof(FileList)
      .refine((file) => {
        if (file.length < 1) return true
        return file[0] && file[0].size < 1000000
      }, t("Field1.Error1"))
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
      }, t("Field1.Error2"))
      .optional(),
    commissionRate: z.coerce
      .number<number>(t("Field2.Error1"))
      .min(1, t("Field2.Error2"))
      .max(100, t("Field2.Error3"))
      .positive(t("Field2.Error4"))
      .multipleOf(1, t("Field2.Error5"))
      .optional(),
    agencyState: z.string().min(1, t("Field3.Error1")),
    agencyCity: z.string().min(1, t("Field4.Error1")),
  })
  type Step3Type = z.infer<typeof step3Schema>
  const formData = useForm<Step3Type>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      agencyLogo: props.finalData.agency.logo,
      commissionRate: props.finalData.agency.commissionRate,
      agencyState: props.finalData.agency.agencyState,
      agencyCity: props.finalData.agency.agencyCity,
    },
    shouldUnregister: false,
  })

  //Submit actions
  const onSubmit = (data: Step3Type) => {
    props.updateFinalData({
      agency: {
        ...props.finalData.agency,
        logo: data.agencyLogo,
        commissionRate: data.commissionRate,
        agencyState: data.agencyState,
        agencyCity: data.agencyCity,
      },
      owner: {
        ...props.finalData.owner,
      },
    })
    props.onNext()
  }

  const data: Record<string, string[]> = stateCityData
  const selectedState = formData.watch("agencyState")
  const cityOptions = selectedState
    ? (data[selectedState] ?? [t("Field4.Title")])
    : []
  const setValue = formData.setValue

  const isFirstRender = useRef(true)

  useEffect(() => {
    // Skip on the initial render of the component
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setValue("agencyCity", "") // Reset the city dropdown's value when the state dropdown changes
  }, [selectedState, setValue])

  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step3Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step3Content">
          <OnboardingFileInput
            name={"agencyLogo"}
            register={formData.register("agencyLogo")}
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <OnboardingInput
            name={"commissionRate"}
            type="tel"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <OnboardingSelect
            name={"agencyState"}
            register={formData.register("agencyState")}
            title={t("Field3.Title")}
            array={getArrayValueDisplayPairs(data)}
            placeholder={t("Field3.Title")}
          />
          <OnboardingSelect
            name={"agencyCity"}
            register={formData.register("agencyCity")}
            title={t("Field4.Title")}
            array={getStringValueDisplayPairs(cityOptions)}
            placeholder={t("Field4.Title")}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step3Actions">
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
