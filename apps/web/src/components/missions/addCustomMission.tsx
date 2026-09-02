"use client"

import {
  RyogoDatePicker,
  RyogoInput,
  RyogoSelect,
  RyogoSwitch,
  RyogoTextarea,
  RyogoTimePicker,
} from "@/components/form/ryogoFormFields"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import z from "zod"
import { toast } from "sonner"
import { useTransition } from "react"
import { FormWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { EntityTypeEnum } from "@ryogo-travel-app/db/schema"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { addCustomMissionAction } from "@/app/actions/missions/addCustomMissionAction"
import { RyogoH3 } from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import {
  regexCheckIDByEntityType,
  getDateTime,
} from "@/components/missions/missionCommons"
import { RyogoDefaultButton, RyogoOutlineButton } from "../buttons/ryogoButtons"

export default function AddCustomMissionPageComponent({
  userId,
  agencyId,
  isRider,
}: {
  userId: string
  agencyId: string
  isRider?: boolean
}) {
  const t = useTranslations("Dashboard.AddCustomMission")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const addCustomMissionSchema = z
    .object({
      entityType: z.enum(EntityTypeEnum).nonoptional(t("Field1.Error1")),
      entityId: z.string().max(12, t("Field2.Error1")).optional(),
      title: z.string().min(5, t("Field3.Error1")).max(100, t("Field3.Error2")),
      message: z.string().max(300, t("Field4.Error1")).optional(),
      dueDate: z.date(t("Field5.Error1")).nonoptional(t("Field5.Error1")),
      dueTime: z.iso.time(t("Field6.Error1")).nonempty(t("Field6.Error1")),
      isCritical: z.boolean(),
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
  type AddCustomMissionType = z.infer<typeof addCustomMissionSchema>

  const formData = useForm<AddCustomMissionType>({
    resolver: zodResolver(addCustomMissionSchema),
    defaultValues: {
      entityType: EntityTypeEnum.USER,
      title: "",
      dueDate: new Date(),
      dueTime: "10:00",
      isCritical: false,
    },
  })

  async function onSubmit(values: AddCustomMissionType) {
    startTransition(async () => {
      if (
        await addCustomMissionAction(userId, agencyId, {
          entityType: values.entityType,
          entityId: values.entityId,
          title: values.title,
          message: values.message,
          dueDate: getDateTime(values.dueDate, values.dueTime),
          isCritical: values.isCritical,
        })
      ) {
        toast.success(t("Success"))
      } else {
        toast.error(t("Error"))
      }
      router.replace(isRider ? `/rider/myMissions` : "/dashboard/missions")
    })
  }
  return (
    <PageWrapper id="AddCustomMissionPage">
      <RyogoH3 weight="font-bold">{t("Title")}</RyogoH3>
      <FormWrapper<AddCustomMissionType>
        form={formData}
        onSubmit={formData.handleSubmit(onSubmit)}
        id="addCustomMissionForm"
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
        <RyogoSwitch name={"isCritical"} label={t("Field7.Title")} />
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
