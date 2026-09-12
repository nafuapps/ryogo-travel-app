"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { RyogoInput } from "@/components/form/ryogoFormFields"
import { CreateOwnerAccountRequestType } from "@ryogo-travel-app/api/types/user.types"
import { Separator } from "@/components/ui/separator"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"
import { BadgeCheck, Disc, LucideIcon } from "lucide-react"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { PREMIUM_TRIAL_DAYS } from "@ryogo-travel-app/api/apiConfig"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { MIN_PASSWORD_LENGTH } from "@/lib/uiConfig"
import {
  FormContentWrapper,
  FormWrapper,
  SectionColWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"

export function CreateAccountStep4({
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
  const t = useTranslations("Onboarding.CreateAccountPage.Step4")

  const step4Schema = z
    .object({
      password: z
        .string()
        .min(MIN_PASSWORD_LENGTH, t("Field1.Error1"))
        .refine((s) => !s.includes(" "), t("Field1.Error2"))
        .nonoptional(t("Field1.Error1")),
      confirmPassword: z
        .string()
        .min(MIN_PASSWORD_LENGTH, t("Field2.Error1"))
        .refine((s) => !s.includes(" "), t("Field2.Error3"))
        .nonoptional(t("Field2.Error1")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("Field2.Error2"),
      path: ["confirmPassword"], // path of error
    })
  type Step4Type = z.infer<typeof step4Schema>
  const formData = useForm<Step4Type>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      password: finalData.owner.password,
    },
  })

  //Submit actions
  const onSubmit = (data: Step4Type) => {
    updateFinalData({
      agency: {
        ...finalData.agency,
      },
      owner: {
        ...finalData.owner,
        password: data.password,
      },
    })
    onNext()
  }

  return (
    <FormWrapper<Step4Type>
      id="Step4Form"
      form={formData}
      onSubmit={formData.handleSubmit(onSubmit)}
    >
      <FormContentWrapper asCard={false}>
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
        <PlanSelectionCard
          type={SubscriptionPlanEnum.PREMIUM}
          onClick={() => {
            updateFinalData({
              agency: {
                ...finalData.agency,
                tryPremium: true,
              },
              owner: {
                ...finalData.owner,
              },
            })
          }}
          selected={finalData.agency.tryPremium}
          icon={BadgeCheck}
          title={t("Field3.PremiumTitle")}
          desc={t("Field3.PremiumDesc", { day: PREMIUM_TRIAL_DAYS })}
        />
        <PlanSelectionCard
          type={SubscriptionPlanEnum.BASIC}
          onClick={() => {
            updateFinalData({
              agency: {
                ...finalData.agency,
                tryPremium: false,
              },
              owner: {
                ...finalData.owner,
              },
            })
          }}
          selected={!finalData.agency.tryPremium}
          icon={Disc}
          title={t("Field3.BasicTitle")}
          desc={t("Field3.BasicDesc")}
        />
      </FormContentWrapper>
      <StickyActionWrapper>
        <RyogoDefaultButton
          className="w-full"
          type="submit"
          disabled={formData.formState.isSubmitting}
          showSpinner={formData.formState.isSubmitting}
          label={
            formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")
          }
        />
        <RyogoOutlineButton
          type="button"
          onClick={onPrev}
          className="w-full"
          disabled={formData.formState.isSubmitting}
          label={t("SecondaryCTA")}
        />
      </StickyActionWrapper>
    </FormWrapper>
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
      className={`flex border rounded-lg justify-between items-center p-3 lg:p-4 gap-2 lg:gap-3 w-full ${
        selected
          ? "bg-sky-100 dark:bg-sky-800 border-sky-200 dark:border-sky-700"
          : "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 "
      }`}
    >
      <SectionColWrapper>
        <RyogoSmall weight="font-bold">{title}</RyogoSmall>
        <RyogoCaption color={selected ? "slate" : "light"}>{desc}</RyogoCaption>
      </SectionColWrapper>
      {selected && <RyogoIcon icon={icon} size="md" color={"brand"} />}
    </div>
  )
}
