"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FindDriverLeaveByIdType } from "@ryogo-travel-app/api/services/driver.services"
import { InsertDriverLeaveType } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { modifyDriverLeaveAction } from "@/app/actions/drivers/modifyDriverLeaveAction"
import { Form } from "@/components/ui/form"
import {
  DashboardDatePicker,
  DashboardSwitch,
  DashboardTextarea,
} from "@/components/form/dashboardFormFields"
import { pageClassName } from "@/components/page/pageCommons"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { useTransition } from "react"

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

  type ModifyDriverLeaveType = z.infer<typeof modifyDriverleaveSchema>

  //Form init
  const formData = useForm<ModifyDriverLeaveType>({
    resolver: zodResolver(modifyDriverleaveSchema),
    defaultValues: {
      startDate: leave.startDate,
      endDate: leave.endDate,
      isCompleted: leave.isCompleted,
      remarks: leave.remarks ?? undefined,
    },
  })

  //Form submit
  async function onSubmit(values: ModifyDriverLeaveType) {
    startTransition(async () => {
      const modifyLeave: Partial<InsertDriverLeaveType> = {
        startDate: values.startDate,
        endDate: values.endDate,
        isCompleted: values.isCompleted,
        remarks: values.remarks,
      }
      const modifiedLeave = await modifyDriverLeaveAction(leave.id, modifyLeave)
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
    <div id="ModifyDriverLeavePage" className={pageClassName}>
      <Form {...formData}>
        <form
          onSubmit={formData.handleSubmit(onSubmit)}
          id="newDriverLeaveForm"
          className="flex flex-col gap-4 lg:gap-4 p-4 lg:p-5 bg-white rounded-lg shadow w-full"
        >
          <DashboardDatePicker
            name="startDate"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            pastAllowed
          />
          <DashboardDatePicker
            name="endDate"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            pastAllowed
          />
          <DashboardSwitch label={t("Field3.Title")} name="isCompleted" />
          <DashboardTextarea
            name="remarks"
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
          />
          <Button
            variant={"default"}
            size={"lg"}
            type="submit"
            disabled={isPending}
          >
            {isPending && <Spinner />}
            {isPending ? t("Loading") : t("PrimaryCTA")}
          </Button>
          <Button
            variant={"outline"}
            size={"lg"}
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
          >
            {t("Back")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
