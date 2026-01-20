"use client"

import {
  DashboardDatePicker,
  DashboardSwitch,
  DashboardTextarea,
} from "@/components/form/dashboardFormFields"
import { pageClassName } from "@/components/page/pageCommons"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { InsertDriverLeaveType } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { newDriverLeaveAction } from "./newDriverLeaveAction"

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

  //Form init
  const formData = useForm<NewDriverLeaveType>({
    resolver: zodResolver(newDriverleaveSchema),
    defaultValues: {
      isCompleted: false,
    },
  })

  //Form submit
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
    <div id="NewDriverLeavePage" className={pageClassName}>
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
            disabled={formData.formState.isSubmitting}
          >
            {formData.formState.isSubmitting && <Spinner />}
            {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </Button>
          <Button
            variant={"outline"}
            size={"lg"}
            type="button"
            onClick={() => router.back()}
            disabled={formData.formState.isSubmitting}
          >
            {t("Back")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
