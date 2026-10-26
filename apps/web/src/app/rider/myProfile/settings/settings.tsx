"use client"

import { changeUserPreferencesAction } from "@/app/actions/users/changeUserPreferencesAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { RyogoSelect, RyogoSwitch } from "@/components/form/ryogoFormFields"
import {
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { zodResolver } from "@hookform/resolvers/zod"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { UserLangEnum } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

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
  const onSubmit = async (values: SchemaType) => {
    const updatedUser = await changeUserPreferencesAction({
      userId: userDetails.id,
      agencyId: userDetails.agencyId,
      prefersDarkTheme: values.dark,
      languagePref: values.lang,
    })
    if (updatedUser) {
      toast.success(t("Success"))
      router.refresh()
    } else {
      toast.error(t("Error"))
    }
  }

  const languages = Object.values(UserLangEnum)

  return (
    <PageWrapper id="RiderAccountSettingsPage">
      <FormWrapper<SchemaType>
        form={formData}
        id="ChangePreferencesForm"
        onSubmit={formData.handleSubmit(onSubmit)}
      >
        <FormContentWrapper>
          <RyogoSwitch label={t("Field1.Title")} name="dark" />
          <RyogoSelect
            name={"lang"}
            register={formData.register("lang")}
            array={languages}
            title={t("Field2.Title")}
            placeholder={t("Field2.Title")}
            translateLang
          />
        </FormContentWrapper>
        <StickyActionWrapper>
          <RyogoDefaultButton
            size={"lg"}
            label={
              formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")
            }
            type="submit"
            disabled={
              formData.formState.isSubmitting || !formData.formState.isDirty
            }
            showSpinner={formData.formState.isSubmitting}
          />
          <RyogoOutlineButton
            size={"lg"}
            label={t("SecondaryCTA")}
            type="button"
            onClick={() => router.back()}
            disabled={formData.formState.isSubmitting}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
