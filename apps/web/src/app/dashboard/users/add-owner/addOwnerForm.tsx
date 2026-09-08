"use client"

import { RyogoInput, RyogoFileInput } from "@/components/form/ryogoFormFields"
import { zodResolver } from "@hookform/resolvers/zod"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { AddOwnerRequestType } from "@ryogo-travel-app/api/types/user.types"
import { FormWrapper } from "@/components/page/pageWrappers"
import { addOwnerAction } from "@/app/actions/users/addOwnerAction"
import { FileRegex, SupportedImageFormats } from "@/lib/regex"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  MAX_EMAIL_LENGTH,
  MAX_FILE_UPLOAD_SIZE,
  MAX_NAME_LENGTH,
  MIN_NAME_LENGTH,
  PHONE_LENGTH,
} from "@/lib/uiConfig"

export default function AddOwnerForm({
  agencyId,
  agencyName,
  allOwners,
}: {
  agencyId: string
  agencyName: string
  allOwners: FindAllUsersByRoleType
}) {
  const t = useTranslations("Dashboard.AddOwner")
  const router = useRouter()

  const addOwnerSchema = z.object({
    ownerName: z
      .string()
      .min(MIN_NAME_LENGTH, t("Field1.Error1"))
      .max(MAX_NAME_LENGTH, t("Field1.Error2")),
    ownerPhone: z.string().length(PHONE_LENGTH, t("Field2.Error1")),
    ownerEmail: z
      .email(t("Field3.Error1"))
      .max(MAX_EMAIL_LENGTH, t("Field3.Error2")),
    ownerPhotos: FileRegex.refine((file) => {
      if (file.length < 1) return true
      return file[0] && file[0].size < MAX_FILE_UPLOAD_SIZE
    }, t("Field4.Error1"))
      .refine((file) => {
        if (file.length < 1) return true
        return file[0] && SupportedImageFormats.includes(file[0].type)
      }, t("Field4.Error2"))
      .optional(),
  })
  type AddOwnerType = z.infer<typeof addOwnerSchema>

  const form = useForm<AddOwnerType>({
    resolver: zodResolver(addOwnerSchema),
  })

  async function onSubmit(values: AddOwnerType) {
    if (
      allOwners.some(
        (u) => u.phone === values.ownerPhone && u.agencyId === agencyId,
      )
    ) {
      // Check if an owner with same phone exists in this agency
      form.setError("ownerPhone", {
        type: "manual",
        message: t("APIError1"),
      })
    } else if (
      allOwners.some(
        (u) => u.phone === values.ownerPhone && u.email === values.ownerEmail,
      )
    ) {
      // Check if an owner with same phone and email exists in entire DB
      form.setError("ownerPhone", {
        type: "manual",
        message: t("APIError2"),
      })
    } else {
      const addOwnerData: AddOwnerRequestType = {
        agencyId: agencyId,
        data: {
          name: values.ownerName,
          phone: values.ownerPhone,
          email: values.ownerEmail,
          photos: values.ownerPhotos,
        },
      }
      const createdOwner = await addOwnerAction(addOwnerData, agencyName)
      if (createdOwner) {
        toast.success(t("Success"))
        window.open(
          createdOwner.whatsappInviteLink,
          "_blank",
          "noopener,noreferrer",
        )
        router.replace(`/dashboard/users/${createdOwner.id}`)
      } else {
        toast.error(t("Error"))
        router.replace(`/dashboard/users`)
      }
    }
  }

  return (
    <FormWrapper<AddOwnerType>
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      id="addOwnerForm"
    >
      <RyogoInput
        name={"ownerName"}
        type="text"
        label={t("Field1.Title")}
        placeholder={t("Field1.Placeholder")}
        description={t("Field1.Description")}
      />
      <RyogoInput
        name={"ownerPhone"}
        type="tel"
        label={t("Field2.Title")}
        placeholder={t("Field2.Placeholder")}
        description={t("Field2.Description")}
      />
      <RyogoInput
        name={"ownerEmail"}
        type="email"
        label={t("Field3.Title")}
        placeholder={t("Field3.Placeholder")}
        description={t("Field3.Description")}
      />
      <RyogoFileInput
        name={"agenctPhotos"}
        register={form.register("ownerPhotos")}
        label={t("Field4.Title")}
        placeholder={t("Field4.Placeholder")}
        description={t("Field4.Description")}
      />
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
  )
}
