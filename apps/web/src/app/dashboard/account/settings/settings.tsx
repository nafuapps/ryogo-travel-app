"use client"

import { useTranslations } from "next-intl"
import { RyogoSelect, RyogoSwitch } from "@/components/form/ryogoFormFields"
import { UserLangEnum } from "@ryogo-travel-app/db/schema"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { toast } from "sonner"
import { changeUserPreferencesAction } from "@/app/actions/users/changeUserPreferencesAction"
import { FormWrapper, PageWrapper } from "@/components/page/pageWrappers"
import AccountDetailHeaderTabs from "@/components/header/detailHeaderTabs/accountDetailHeaderTabs"
import { Separator } from "@/components/ui/separator"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export default function AccountSettingsPageComponent({
  userDetails,
}: {
  userDetails: NonNullable<FindUserDetailsByIdType>
}) {
  const t = useTranslations("Dashboard.AccountSettings")
  const router = useRouter()

  const schema = z.object({
    dark: z.boolean(),
    lang: z.enum(UserLangEnum).nonoptional(t("Field2.Error1")),
  })

  type SchemaType = z.infer<typeof schema>
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      dark: userDetails.prefersDarkTheme ?? false,
      lang: userDetails.languagePref,
    },
  })
  //Submit actions
  const onSubmit = async (data: SchemaType) => {
    const newPreferences = {
      prefersDarkTheme: data.dark,
      languagePref: data.lang,
    }
    const updatedUser = await changeUserPreferencesAction(
      userDetails.id,
      userDetails.agencyId,
      newPreferences,
    )
    if (updatedUser) {
      toast.success(t("Success"))
    } else {
      toast.error(t("Error"))
    }
  }

  const languages = getEnumValueDisplayPairs(UserLangEnum)
  return (
    <PageWrapper id="AccountSettingsPage">
      <AccountDetailHeaderTabs selectedTab="Settings" />
      <FormWrapper<SchemaType>
        form={form}
        id="ChangePreferencesForm"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <RyogoSwitch label={t("Field1.Title")} name="dark" />
        <RyogoSelect
          name={"lang"}
          register={form.register("lang")}
          array={languages}
          title={t("Field2.Title")}
          placeholder={t("Field2.Title")}
        />
        <Separator />
        <RyogoDefaultButton
          size={"lg"}
          label={form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          type="submit"
          disabled={form.formState.isSubmitting}
          showSpinner={form.formState.isSubmitting}
        />
        <RyogoOutlineButton
          size={"lg"}
          label={t("SecondaryCTA")}
          type="button"
          onClick={() => router.back()}
          disabled={form.formState.isSubmitting}
        />
      </FormWrapper>
    </PageWrapper>
  )
}
