"use client"

import { addSupportTicketAction } from "@/app/actions/support/addSupportTicketAction"
import {
  RyogoFileInput,
  RyogoInput,
  RyogoSelect,
  RyogoTextarea,
} from "@/components/form/ryogoFormFields"
import { regexCheckIDByEntityType } from "@/components/missions/missionCommons"
import { FormWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { RyogoH3 } from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { FileRegex } from "@/lib/regex"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export default function AddSupportTicketPageComponent({
  userId,
  agencyId,
}: {
  userId: string
  agencyId: string
}) {
  const t = useTranslations("Dashboard.AddSupportTicket")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const addTicketSchema = z
    .object({
      entityType: z.enum(EntityTypeEnum).nonoptional(t("Field1.Error1")),
      entityId: z.string().max(12, t("Field2.Error1")).optional(),
      issue: z.string().min(5, t("Field3.Error1")).max(100, t("Field3.Error2")),
      details: z.string().max(300, t("Field4.Error1")).optional(),
      photo: FileRegex.refine((file) => {
        if (file.length < 1) return true
        return file[0] && file[0].size < 1000000
      }, t("Field5.Error1"))
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
              "application/pdf",
            ].includes(file[0].type)
          )
        }, t("Field5.Error2"))
        .optional(),
    })
    .superRefine(({ entityType, entityId }, ctx) => {
      if (entityId && !regexCheckIDByEntityType(entityType, entityId)) {
        ctx.addIssue({
          code: "custom",
          message: t("Field2.Error2"),
          path: ["entityId"],
        })
      }
    })

  type AddTicketType = z.infer<typeof addTicketSchema>

  const formData = useForm<AddTicketType>({
    resolver: zodResolver(addTicketSchema),
    defaultValues: {
      entityType: EntityTypeEnum.USER,
      issue: "",
    },
  })

  async function onSubmit(values: AddTicketType) {
    startTransition(async () => {
      const newTicket = await addSupportTicketAction(userId, agencyId, {
        entityType: values.entityType,
        entityId: values.entityId,
        issue: values.issue,
        details: values.details,
        photo: values.photo,
      })
      if (newTicket) {
        toast.success(t("Success"))
        router.replace(`/dashboard/support/tickets/${newTicket.id}`)
      } else {
        toast.error(t("Error"))
        router.replace(`/dashboard/support/tickets`)
      }
    })
  }

  return (
    <PageWrapper id="AddSupportTicketPage">
      <RyogoH3 weight="font-bold">{t("Title")}</RyogoH3>
      <FormWrapper<AddTicketType>
        form={formData}
        onSubmit={formData.handleSubmit(onSubmit)}
        id="addTicketForm"
      >
        <RyogoSelect
          name="entityType"
          title={t("Field1.Title")}
          register={formData.register("entityType")}
          array={getEnumValueDisplayPairs(EntityTypeEnum)}
          placeholder={t("Field1.Placeholder")}
          description={t("Field1.Description")}
        />
        <RyogoInput
          name="entityId"
          label={t("Field2.Title")}
          placeholder={t("Field2.Placeholder")}
          description={t("Field2.Description")}
          type="text"
        />
        <RyogoInput
          name="issue"
          label={t("Field3.Title")}
          placeholder={t("Field3.Placeholder")}
          description={t("Field3.Description")}
          type="text"
        />
        <RyogoTextarea
          name="details"
          label={t("Field4.Title")}
          placeholder={t("Field4.Placeholder")}
        />
        <RyogoFileInput
          name={"photo"}
          register={formData.register("photo")}
          label={t("Field5.Title")}
          placeholder={t("Field5.Placeholder")}
          description={t("Field5.Description")}
        />
        <Separator />
        <RyogoDefaultButton
          size={"lg"}
          label={isPending ? t("Loading") : t("PrimaryCTA")}
          type="submit"
          disabled={isPending}
          showSpinner={isPending}
        />
        <RyogoOutlineButton
          size={"lg"}
          label={t("CancelCTA")}
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
        />
      </FormWrapper>
    </PageWrapper>
  )
}
