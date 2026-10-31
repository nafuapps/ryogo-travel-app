"use client"

import { addReminderAction } from "@/app/actions/missions/addReminderAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import {
  RyogoDatePicker,
  RyogoInput,
  RyogoSwitch,
  RyogoTextarea,
  RyogoTimePicker,
} from "@/components/form/ryogoFormFields"
import {
  getDateTime,
  getEntityType,
} from "@/components/missions/missionCommons"
import {
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  SectionRowWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoH3 } from "@/components/typography"
import {
  MAX_ENTITY_ID_LENGTH,
  MAX_FIELD_DESC_LENGTH,
  MAX_FIELD_TITLE_LENGTH,
  MIN_ENTITY_ID_LENGTH,
  MIN_FIELD_TITLE_LENGTH,
} from "@/lib/uiConfig"
import { zodResolver } from "@hookform/resolvers/zod"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { addDays } from "date-fns"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export default function AddReminderPageComponent({
  userId,
  agencyId,
  isRider,
}: {
  userId: string
  agencyId: string
  isRider?: boolean
}) {
  const t = useTranslations("Dashboard.AddReminder")
  const router = useRouter()

  const addReminderSchema = z
    .object({
      entityId: z
        .string()
        .min(MIN_ENTITY_ID_LENGTH)
        .max(MAX_ENTITY_ID_LENGTH, t("Field2.Error1"))
        .optional(),
      title: z
        .string()
        .min(MIN_FIELD_TITLE_LENGTH, t("Field3.Error1"))
        .max(MAX_FIELD_TITLE_LENGTH, t("Field3.Error2")),
      message: z
        .string()
        .max(MAX_FIELD_DESC_LENGTH, t("Field4.Error1"))
        .optional(),
      dueDate: z.date(t("Field5.Error1")).nonoptional(t("Field5.Error1")),
      dueTime: z.iso.time(t("Field6.Error1")).nonempty(t("Field6.Error1")),
      isCritical: z.boolean(),
    })
    .superRefine(({ dueDate, dueTime }, ctx) => {
      //Check that the date is in the future
      if (getDateTime(dueDate, dueTime) < new Date()) {
        ctx.addIssue({
          code: "custom",
          message: t("Field5.Error2"),
          path: ["dueDate"],
        })
      }
    })
  type AddReminderType = z.infer<typeof addReminderSchema>

  const form = useForm<AddReminderType>({
    resolver: zodResolver(addReminderSchema),
    defaultValues: {
      title: "",
      dueDate: addDays(new Date(), 1),
      dueTime: "10:00",
      isCritical: false,
    },
  })

  async function onSubmit(values: AddReminderType) {
    const entityType = getEntityType(values.entityId)
    const addedReminder = await addReminderAction({
      data: {
        userId,
        agencyId,
        entityType: entityType ?? EntityTypeEnum.USER,
        entityId: entityType ? values.entityId : userId,
        title: values.title,
        message: values.message,
        dueDate: getDateTime(values.dueDate, values.dueTime),
        isCritical: values.isCritical,
      },
    })
    if (addedReminder) {
      toast.success(t("Success"))
    } else {
      toast.error(t("Error"))
    }
    router.replace(
      isRider
        ? `/rider/myMissions/myReminders`
        : "/dashboard/missions/reminders",
    )
  }

  return (
    <PageWrapper id="AddReminderPage">
      <FormWrapper<AddReminderType>
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        id="addReminderForm"
      >
        <SectionRowWrapper className="items-start justify-between">
          <RyogoH3>{t("Title")}</RyogoH3>
          <HelpIconButton
            href={
              isRider
                ? "/rider/mySupport/help-missions#custom"
                : "/dashboard/support/help-missions#custom"
            }
          />
        </SectionRowWrapper>
        <FormContentWrapper>
          <RyogoInput
            name="title"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
            type="text"
          />
          <RyogoTextarea
            name="message"
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
          />
          <RyogoDatePicker
            name="dueDate"
            label={t("Field5.Title")}
            placeholder={t("Field5.Placeholder")}
            description={t("Field5.Description")}
          />
          <RyogoTimePicker name="dueTime" label={t("Field6.Title")} />
          <RyogoSwitch name={"isCritical"} label={t("Field7.Title")} />
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
