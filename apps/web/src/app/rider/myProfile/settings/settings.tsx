"use client"

import { useTranslations } from "next-intl"
import {
  DashboardSelect,
  DashboardSwitch,
} from "@/components/form/dashboardFormFields"
import { UserLangEnum } from "@ryogo-travel-app/db/schema"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { Form } from "@/components/ui/form"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { toast } from "sonner"
import { changeUserPreferencesAction } from "./changeUserPreferencesAction"

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
    console.log({ data })
    const newPreferences = {
      prefersDarkTheme: data.dark,
      languagePref: data.lang,
    }
    const updatedUser = await changeUserPreferencesAction(
      userDetails.id,
      newPreferences,
    )
    if (updatedUser) {
      router.replace("/rider/myProfile")
      toast.success(t("Success"))
    } else {
      toast.error(t("Error"))
    }
  }

  const languages = getEnumValueDisplayPairs(UserLangEnum)
  return (
    <div
      id="AccountSettingsInfo"
      className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
    >
      <Form {...formData}>
        <form
          id="ChangePreferencesForm"
          onSubmit={formData.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 lg:gap-4 p-4 lg:p-5 bg-white rounded-lg shadow w-full"
        >
          <DashboardSwitch label={t("Field1.Title")} name="dark" />
          <DashboardSelect
            name={"lang"}
            register={formData.register("lang")}
            array={languages}
            title={t("Field2.Title")}
            placeholder={t("Field2.Title")}
          />
          <Button
            variant={"default"}
            size={"lg"}
            type="submit"
            disabled={formData.formState.isSubmitting}
          >
            {formData.formState.isSubmitting && <Spinner />}
            {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </Button>
          <Button
            variant={"secondary"}
            size={"lg"}
            type="button"
            onClick={() => router.back()}
            disabled={formData.formState.isSubmitting}
          >
            {t("SecondaryCTA")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
