"use client"

import {
  RyogoDatePicker,
  RyogoSwitch,
  RyogoTextarea,
} from "@/components/form/ryogoFormFields"
import { zodResolver } from "@hookform/resolvers/zod"
import { InsertDriverLeaveType } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { newDriverLeaveAction } from "@/app/actions/drivers/newDriverLeaveAction"
import { FormWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoH4 } from "@/components/typography"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export default function NewDriverLeavePageComponent({
  userId,
  agencyId,
  driverId,
}: {
  userId: string
  agencyId: string
  driverId: string
}) {
  const t = useTranslations("Dashboard.NewDriverLeave")
  const router = useRouter()

  const newDriverleaveSchema = z
    .object({
      startDate: z.date(t("Field1.Error1")).nonoptional(t("Field1.Error1")),
      endDate: z.date(t("Field2.Error1")).nonoptional(t("Field2.Error1")),
      isCompleted: z.boolean(),
      remarks: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      //Start date cannot be after end date
      if (data.startDate > data.endDate) {
        ctx.addIssue({
          code: "custom",
          message: t("Field2.Error2"),
          path: ["endDate"],
        })
      }
    })

  type NewDriverLeaveType = z.infer<typeof newDriverleaveSchema>

  const form = useForm<NewDriverLeaveType>({
    resolver: zodResolver(newDriverleaveSchema),
    defaultValues: {
      isCompleted: false,
    },
  })

  async function onSubmit(values: NewDriverLeaveType) {
    const newLeave: InsertDriverLeaveType = {
      agencyId: agencyId,
      driverId: driverId,
      addedByUserId: userId,
      startDate: values.startDate,
      endDate: values.endDate,
      isCompleted: values.isCompleted,
      remarks: values.remarks,
    }
    const createdLeave = await newDriverLeaveAction(newLeave)
    if (createdLeave) {
      router.replace(`/dashboard/drivers/${driverId}/leaves`)
      toast.success(t("Success"))
    } else {
      router.back()
      toast.error(t("Error"))
    }
  }

  return (
    <PageWrapper id="NewDriverLeavePage">
      <RyogoH4 weight="font-bold">{t("Title")}</RyogoH4>
      <RyogoCaption color="light">{t("Description")}</RyogoCaption>
      <FormWrapper<NewDriverLeaveType>
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        id="newDriverLeaveForm"
      >
        <RyogoDatePicker
          name="startDate"
          label={t("Field1.Title")}
          placeholder={t("Field1.Placeholder")}
          pastAllowed
        />
        <RyogoDatePicker
          name="endDate"
          label={t("Field2.Title")}
          placeholder={t("Field2.Placeholder")}
          pastAllowed
        />
        <RyogoSwitch label={t("Field3.Title")} name="isCompleted" />
        <RyogoTextarea
          name="remarks"
          label={t("Field4.Title")}
          placeholder={t("Field4.Placeholder")}
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
          label={t("Back")}
          type="button"
          onClick={() => router.back()}
          disabled={form.formState.isSubmitting}
        />
      </FormWrapper>
    </PageWrapper>
  )
}
