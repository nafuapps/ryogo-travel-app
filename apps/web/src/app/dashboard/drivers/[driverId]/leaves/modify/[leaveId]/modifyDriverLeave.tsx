"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FindDriverLeaveByIdType } from "@ryogo-travel-app/api/services/driver.services"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { modifyDriverLeaveAction } from "@/app/actions/drivers/modifyDriverLeaveAction"
import {
  RyogoDatePicker,
  RyogoSwitch,
  RyogoTextarea,
} from "@/components/form/ryogoFormFields"
import { useTransition } from "react"
import { FormWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { ModifyDriverLeaveRequestType } from "@ryogo-travel-app/api/types/driverLeave.types"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export default function ModifyDriverLeavePageComponent({
  leave,
}: {
  leave: NonNullable<FindDriverLeaveByIdType>
}) {
  const t = useTranslations("Dashboard.ModifyDriverLeave")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const modifyDriverleaveSchema = z
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

  type ModifyDriverLeaveFormType = z.infer<typeof modifyDriverleaveSchema>

  //Form init
  const formData = useForm<ModifyDriverLeaveFormType>({
    resolver: zodResolver(modifyDriverleaveSchema),
    defaultValues: {
      startDate: leave.startDate,
      endDate: leave.endDate,
      isCompleted: leave.isCompleted,
      remarks: leave.remarks ?? undefined,
    },
  })

  //Form submit
  async function onSubmit(values: ModifyDriverLeaveFormType) {
    startTransition(async () => {
      const modifyLeave: ModifyDriverLeaveRequestType = {
        leaveId: leave.id,
        agencyId: leave.agencyId,
        startDate: values.startDate,
        endDate: values.endDate,
        isCompleted: values.isCompleted,
        remarks: values.remarks,
      }
      const modifiedLeave = await modifyDriverLeaveAction(modifyLeave)
      if (modifiedLeave) {
        router.replace(`/dashboard/drivers/${leave.driverId}/leaves`)
        toast.success(t("Success"))
      } else {
        router.back()
        toast.error(t("Error"))
      }
    })
  }
  return (
    <PageWrapper id="ModifyDriverLeavePage">
      <FormWrapper<ModifyDriverLeaveFormType>
        form={formData}
        onSubmit={formData.handleSubmit(onSubmit)}
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
          label={isPending ? t("Loading") : t("PrimaryCTA")}
          type="submit"
          disabled={isPending}
          showSpinner={isPending}
        />
        <RyogoOutlineButton
          size={"lg"}
          label={t("Back")}
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
        />
      </FormWrapper>
    </PageWrapper>
  )
}
