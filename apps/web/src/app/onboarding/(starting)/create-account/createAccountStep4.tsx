"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { RyogoInput } from "@/components/form/ryogoFormFields"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
  OnboardingStepSecondaryAction,
} from "@/components/flows/onboarding/onboardingSteps"
import { Form } from "@/components/ui/form"
import { CreateOwnerAccountRequestType } from "@ryogo-travel-app/api/types/user.types"
import { Separator } from "@/components/ui/separator"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"
import { BadgeCheck, Disc, LucideIcon } from "lucide-react"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { PREMIUM_TRIAL_DAYS } from "@ryogo-travel-app/api/apiConfig"

export function CreateAccountStep4(props: {
  onNext: () => void
  onPrev: () => void
  finalData: CreateOwnerAccountRequestType
  updateFinalData: Dispatch<SetStateAction<CreateOwnerAccountRequestType>>
}) {
  const t = useTranslations("Onboarding.CreateAccountPage.Step4")
  const [wantsPremiumTrial, setWantsPremiumTrial] = useState(true)

  const step4Schema = z
    .object({
      password: z
        .string()
        .min(8, t("Field1.Error1"))
        .refine((s) => !s.includes(" "), t("Field1.Error2")),
      confirmPassword: z
        .string()
        .min(8, t("Field2.Error1"))
        .refine((s) => !s.includes(" "), t("Field2.Error3")),
      wantsPremium: z.boolean(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("Field2.Error2"),
      path: ["confirmPassword"], // path of error
    })
  type Step4Type = z.infer<typeof step4Schema>
  const formData = useForm<Step4Type>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      password: props.finalData.owner.password,
    },
  })

  //Submit actions
  const onSubmit = (data: Step4Type) => {
    props.updateFinalData({
      agency: {
        ...props.finalData.agency,
        tryPremium: wantsPremiumTrial,
      },
      owner: {
        ...props.finalData.owner,
        password: data.password,
      },
    })
    props.onNext()
  }
  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step4Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step4Content">
          <RyogoInput
            name={"password"}
            type="password"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <RyogoInput
            name={"confirmPassword"}
            type="password"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <Separator />
          <RyogoSmall weight="font-bold">{t("Field3.Title")}</RyogoSmall>
          {/* <div className="flex flex-col gap-2 lg:gap-3 border rounded-lg p-4 lg:p-5"> */}
          <PlanSelectionCard
            type={SubscriptionPlanEnum.BASIC}
            onClick={() => {
              setWantsPremiumTrial(true)
            }}
            selected={wantsPremiumTrial}
            icon={BadgeCheck}
            title={t("Field3.PremiumTitle")}
            desc={t("Field3.PremiumDesc", { day: PREMIUM_TRIAL_DAYS })}
          />
          <PlanSelectionCard
            type={SubscriptionPlanEnum.BASIC}
            onClick={() => {
              setWantsPremiumTrial(false)
            }}
            selected={!wantsPremiumTrial}
            icon={Disc}
            title={t("Field3.BasicTitle")}
            desc={t("Field3.BasicDesc")}
          />
          {/* </div> */}
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step4Actions">
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

function PlanSelectionCard({
  type,
  onClick,
  selected,
  title,
  desc,
  icon,
}: {
  type: SubscriptionPlanEnum
  onClick: () => void
  selected: boolean
  title: string
  desc: string
  icon: LucideIcon
}) {
  return (
    <div
      id={type}
      onClick={onClick}
      className={`flex border rounded-lg flex-col p-2 lg:p-3 gap-1.5 lg:gap-2 w-full ${
        selected
          ? "bg-sky-100 dark:bg-sky-800 border-sky-700 dark:border-sky-200"
          : "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 "
      }`}
    >
      <RyogoIcon icon={icon} size="md" />
      <RyogoCaption weight="font-bold">{title}</RyogoCaption>
      <RyogoCaption color="light">{desc}</RyogoCaption>
    </div>
  )
}
