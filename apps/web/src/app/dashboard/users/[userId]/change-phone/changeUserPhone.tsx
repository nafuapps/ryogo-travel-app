"use client"

import { RyogoInput } from "@/components/form/ryogoFormFields"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  FindUserAccountsByPhoneRoleType,
  FindUserDetailsByIdType,
} from "@ryogo-travel-app/api/services/user.services"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { changeUserPhoneAction } from "@/app/actions/users/changeUserPhoneAction"
import {
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { PHONE_LENGTH } from "@/lib/uiConfig"

export default function ChangeUserPhonePageComponent({
  user,
  allUsers,
}: {
  user: NonNullable<FindUserDetailsByIdType>
  allUsers: FindUserAccountsByPhoneRoleType
}) {
  const t = useTranslations("Dashboard.UserDetails.ChangePhone")
  const router = useRouter()

  const modifyUserSchema = z.object({
    newPhone: z.string().length(PHONE_LENGTH, t("Field1.Error1")),
  })
  type ModifyUserType = z.infer<typeof modifyUserSchema>

  const form = useForm<ModifyUserType>({
    resolver: zodResolver(modifyUserSchema),
    defaultValues: {
      newPhone: user.phone,
    },
  })

  async function onSubmit(data: ModifyUserType) {
    //Check if same phone number has been entered
    if (data.newPhone === user.phone) {
      form.setError("newPhone", {
        type: "manual",
        message: t("Field1.Error2"),
      })
    } else if (
      //check if another user with same role has this phone number already
      allUsers.some((u) => u.phone === data.newPhone)
    ) {
      form.setError("newPhone", {
        type: "manual",
        message: t("Field1.Error3"),
      })
    } else {
      const modifiedUser = await changeUserPhoneAction(
        user.id,
        data.newPhone,
        user.userRole,
      )
      if (modifiedUser) {
        router.replace(`/dashboard/users/${user.id}`)
        toast.success(t("Success"))
      } else {
        toast.error(t("Error"))
      }
    }
  }

  return (
    <PageWrapper id="ChangeUserPhonePage">
      <FormWrapper<ModifyUserType>
        form={form}
        id="ChangeUserPhoneForm"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormContentWrapper>
          <RyogoInput
            name={"newPhone"}
            type="tel"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
        </FormContentWrapper>
        <StickyActionWrapper>
          <RyogoDefaultButton
            size={"lg"}
            label={form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            showSpinner={form.formState.isSubmitting}
          />
          <RyogoOutlineButton
            size={"lg"}
            label={t("SecondaryCTA")}
            type="button"
            onClick={() => router.back()}
            disabled={form.formState.isSubmitting}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
