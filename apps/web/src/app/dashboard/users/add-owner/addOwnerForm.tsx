"use client"

import { RyogoInput, RyogoFileInput } from "@/components/form/ryogoFormFields"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { AddOwnerRequestType } from "@ryogo-travel-app/api/types/user.types"
import { useTransition } from "react"
import { FormWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { addOwnerAction } from "@/app/actions/users/addOwnerAction"
import { FileRegex } from "@/lib/regex"

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
  const [isPending, startTransition] = useTransition()

  const addOwnerSchema = z.object({
    ownerName: z
      .string()
      .min(5, t("Field1.Error1"))
      .max(30, t("Field1.Error2")),
    ownerPhone: z.string().length(10, t("Field2.Error1")),
    ownerEmail: z.email(t("Field3.Error1")).max(60, t("Field3.Error2")),
    ownerPhotos: FileRegex.refine((file) => {
      if (file.length < 1) return true
      return file[0] && file[0].size < 1000000
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
          ].includes(file[0].type)
        )
      }, t("Field4.Error2"))
      .optional(),
  })
  type AddOwnerType = z.infer<typeof addOwnerSchema>

  const formData = useForm<AddOwnerType>({
    resolver: zodResolver(addOwnerSchema),
  })

  async function onSubmit(values: AddOwnerType) {
    if (
      allOwners.some(
        (u) => u.phone === values.ownerPhone && u.agencyId === agencyId,
      )
    ) {
      // Check if an owner with same phone exists in this agency
      formData.setError("ownerPhone", {
        type: "manual",
        message: t("APIError1"),
      })
    } else if (
      allOwners.some(
        (u) => u.phone === values.ownerPhone && u.email === values.ownerEmail,
      )
    ) {
      // Check if an owner with same phone and email exists in entire DB
      formData.setError("ownerPhone", {
        type: "manual",
        message: t("APIError2"),
      })
    } else {
      startTransition(async () => {
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
      })
    }
  }

  return (
    <FormWrapper<AddOwnerType>
      form={formData}
      onSubmit={formData.handleSubmit(onSubmit)}
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
        register={formData.register("ownerPhotos")}
        label={t("Field4.Title")}
        placeholder={t("Field4.Placeholder")}
        description={t("Field4.Description")}
      />
      <Button
        variant={"default"}
        size={"lg"}
        type="submit"
        disabled={isPending}
      >
        {isPending && <Spinner />}
        <RyogoCaption color="white">
          {isPending ? t("Loading") : t("PrimaryCTA")}
        </RyogoCaption>
      </Button>
      <Button
        variant={"outline"}
        type="button"
        disabled={isPending}
        onClick={() => router.back()}
      >
        <RyogoCaption color="light">{t("SecondaryCTA")}</RyogoCaption>
      </Button>
    </FormWrapper>
  )
}
