"use client"

import { addSupportTicketAction } from "@/app/actions/support/addSupportTicketAction"
import {
  RyogoFileInput,
  RyogoInput,
  RyogoTextarea,
} from "@/components/form/ryogoFormFields"
import {
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoH3 } from "@/components/typography"
import { zodResolver } from "@hookform/resolvers/zod"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { FileRegex } from "@/lib/regex"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  MAX_ENTITY_ID_LENGTH,
  MAX_FIELD_DESC_LENGTH,
  MAX_FIELD_TITLE_LENGTH,
  MIN_ENTITY_ID_LENGTH,
  MIN_FIELD_DESC_LENGTH,
  MIN_FIELD_TITLE_LENGTH,
} from "@/lib/uiConfig"
import { checkImageFileSize, checkImageFileType } from "@/lib/utils"
import { getEntityType } from "@/components/missions/missionCommons"

export default function AddSupportTicketPageComponent({
  userId,
  agencyId,
  isRider,
}: {
  userId: string
  agencyId: string
  isRider?: boolean
}) {
  const t = useTranslations("Dashboard.AddSupportTicket")
  const router = useRouter()

  const addTicketSchema = z.object({
    entityId: z
      .string()
      .min(MIN_ENTITY_ID_LENGTH)
      .max(MAX_ENTITY_ID_LENGTH, t("Field2.Error1"))
      .optional(),
    issue: z
      .string()
      .min(MIN_FIELD_TITLE_LENGTH, t("Field3.Error1"))
      .max(MAX_FIELD_TITLE_LENGTH, t("Field3.Error2")),
    details: z
      .string()
      .min(MIN_FIELD_DESC_LENGTH, t("Field4.Error2"))
      .max(MAX_FIELD_DESC_LENGTH, t("Field4.Error1"))
      .optional(),
    photo: FileRegex.refine((file) => {
      if (file.length < 1) return true
      return checkImageFileSize(file)
    }, t("Field5.Error1"))
      .refine((file) => {
        if (file.length < 1) return true
        return checkImageFileType(file)
      }, t("Field5.Error2"))
      .optional(),
  })

  type AddTicketType = z.infer<typeof addTicketSchema>

  const form = useForm<AddTicketType>({
    resolver: zodResolver(addTicketSchema),
    defaultValues: {
      issue: "",
    },
  })

  async function onSubmit(values: AddTicketType) {
    const entityType = getEntityType(values.entityId)
    const newTicket = await addSupportTicketAction({
      data: {
        userId,
        agencyId,
        entityType: entityType ?? EntityTypeEnum.USER,
        entityId: entityType ? values.entityId : userId,
        issue: values.issue,
        details: values.details,
        photo: values.photo,
      },
    })
    if (newTicket) {
      toast.success(t("Success"))
      router.replace(
        isRider
          ? `/rider/mySupport/tickets/${newTicket.id}`
          : `/dashboard/support/tickets/${newTicket.id}`,
      )
    } else {
      toast.error(t("Error"))
      router.replace(
        isRider ? `/rider/mySupport/tickets` : `/dashboard/support/tickets`,
      )
    }
  }

  return (
    <PageWrapper id="AddSupportTicketPage">
      <FormWrapper<AddTicketType>
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        id="addTicketForm"
      >
        <RyogoH3 weight="font-bold">{t("Title")}</RyogoH3>
        <FormContentWrapper>
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
            register={form.register("photo")}
            label={t("Field5.Title")}
            placeholder={t("Field5.Placeholder")}
            description={t("Field5.Description")}
          />
          <RyogoInput
            name="entityId"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
            type="text"
          />
        </FormContentWrapper>
        <StickyActionWrapper>
          <RyogoDefaultButton
            size={"lg"}
            label={form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
            type="submit"
            disabled={form.formState.isSubmitting}
            showSpinner={form.formState.isSubmitting}
          />
          <RyogoOutlineButton
            size={"lg"}
            label={t("CancelCTA")}
            type="button"
            onClick={() => router.back()}
            disabled={form.formState.isSubmitting}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
