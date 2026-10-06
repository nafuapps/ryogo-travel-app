"use client"

import {
  RyogoDatePicker,
  RyogoSwitch,
  RyogoTextarea,
} from "@/components/form/ryogoFormFields"
import { zodResolver } from "@hookform/resolvers/zod"
import { DriverLeaveStatusEnum } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { newDriverLeaveAction } from "@/app/actions/drivers/newDriverLeaveAction"
import {
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  SectionRowWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoH3 } from "@/components/typography"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { HelpIconButton } from "@/components/flows/support/helpButtons"

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

  const newDriverLeaveSchema = z
    .object({
      startDate: z.date(t("Field1.Error1")).nonoptional(t("Field1.Error1")),
      endDate: z.date(t("Field2.Error1")).nonoptional(t("Field2.Error1")),
      status: z.boolean(),
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

  type NewDriverLeaveType = z.infer<typeof newDriverLeaveSchema>

  const form = useForm<NewDriverLeaveType>({
    resolver: zodResolver(newDriverLeaveSchema),
    defaultValues: {
      status: false,
    },
  })

  async function onSubmit(values: NewDriverLeaveType) {
    const createdLeave = await newDriverLeaveAction({
      data: {
        agencyId: agencyId,
        driverId: driverId,
        addedByUserId: userId,
        startDate: values.startDate,
        endDate: values.endDate,
        status: values.status
          ? DriverLeaveStatusEnum.COMPLETED
          : DriverLeaveStatusEnum.PENDING,
        remarks: values.remarks,
      },
    })
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
      <FormWrapper<NewDriverLeaveType>
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        id="newDriverLeaveForm"
      >
        <SectionRowWrapper className="items-start justify-between">
          <RyogoH3>{t("Title")}</RyogoH3>
          <HelpIconButton href="/dashboard/support/help-drivers#leaves" />
        </SectionRowWrapper>
        <RyogoCaption color="light">{t("Description")}</RyogoCaption>
        <FormContentWrapper>
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
          <RyogoSwitch label={t("Field3.Title")} name="status" />
          <RyogoTextarea
            name="remarks"
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
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
            label={t("Back")}
            type="button"
            onClick={() => router.back()}
            disabled={form.formState.isSubmitting}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
