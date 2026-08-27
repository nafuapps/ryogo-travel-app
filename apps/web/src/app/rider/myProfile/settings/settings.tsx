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
import MyProfileDetailHeaderTabs from "@/components/header/detailHeaderTabs/myProfileHeaderTabs"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export default function MyProfileSettingsPageComponent({
  userDetails,
}: {
  userDetails: NonNullable<FindUserDetailsByIdType>
}) {
  const t = useTranslations("Rider.MyProfileSettings")
  const router = useRouter()

  const schema = z.object({
    dark: z.boolean(),
    lang: z.enum(UserLangEnum).nonoptional(t("Field2.Error1")),
  })

  type SchemaType = z.infer<typeof schema>
  const formData = useForm<SchemaType>({
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
    <PageWrapper id="RiderAccountSettingsPage">
      <MyProfileDetailHeaderTabs selectedTab="Settings" />
      <FormWrapper<SchemaType>
        form={formData}
        id="ChangePreferencesForm"
        onSubmit={formData.handleSubmit(onSubmit)}
      >
        <RyogoSwitch label={t("Field1.Title")} name="dark" />
        <RyogoSelect
          name={"lang"}
          register={formData.register("lang")}
          array={languages}
          title={t("Field2.Title")}
          placeholder={t("Field2.Title")}
        />
        <RyogoDefaultButton
          size={"lg"}
          label={
            formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")
          }
          type="submit"
          disabled={formData.formState.isSubmitting}
          showSpinner={formData.formState.isSubmitting}
        />
        <RyogoOutlineButton
          size={"lg"}
          label={t("SecondaryCTA")}
          type="button"
          onClick={() => router.back()}
          disabled={formData.formState.isSubmitting}
        />
      </FormWrapper>
    </PageWrapper>
  )
}
