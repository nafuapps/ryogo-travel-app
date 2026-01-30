"use client"

import { useTranslations } from "next-intl"
import {
  DashboardDatePicker,
  DashboardInput,
  DashboardSwitch,
  DashboardTextarea,
} from "@/components/form/dashboardFormFields"
import { pageClassName } from "@/components/page/pageCommons"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { InsertVehicleRepairType } from "@ryogo-travel-app/db/schema"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { newVehicleRepairAction } from "../../../../../actions/newVehicleRepairAction"

export default function NewVehicleRepairPageComponent({
  userId,
  agencyId,
  vehicleId,
}: {
  userId: string
  agencyId: string
  vehicleId: string
}) {
  const t = useTranslations("Dashboard.NewVehicleRepair")
  const router = useRouter()

  const newDriverleaveSchema = z
    .object({
      startDate: z.date(t("Field1.Error1")).nonoptional(t("Field1.Error1")),
      endDate: z.date(t("Field2.Error1")).nonoptional(t("Field2.Error1")),
      isCompleted: z.boolean(),
      remarks: z.string().optional(),
      cost: z.coerce
        .number<number>(t("Field5.Error1"))
        .min(0, t("Field5.Error2"))
        .max(1000000, t("Field5.Error3"))
        .multipleOf(1, t("Field5.Error4"))
        .nonnegative(t("Field5.Error5"))
        .optional(),
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

  type NewVehicleRepairType = z.infer<typeof newDriverleaveSchema>

  //Form init
  const formData = useForm<NewVehicleRepairType>({
    resolver: zodResolver(newDriverleaveSchema),
    defaultValues: {
      isCompleted: false,
    },
  })

  //Form submit
  async function onSubmit(values: NewVehicleRepairType) {
    const newLeave: InsertVehicleRepairType = {
      agencyId: agencyId,
      vehicleId: vehicleId,
      addedByUserId: userId,
      startDate: values.startDate,
      endDate: values.endDate,
      isCompleted: values.isCompleted,
      remarks: values.remarks,
      cost: values.cost,
    }
    const createdLeave = await newVehicleRepairAction(newLeave)
    if (createdLeave) {
      router.replace(`/dashboard/vehicles/${vehicleId}/repairs`)
      toast.success(t("Success"))
    } else {
      router.back()
      toast.error(t("Error"))
    }
  }
  return (
    <div id="NewVehicleRepairPage" className={pageClassName}>
      <Form {...formData}>
        <form
          onSubmit={formData.handleSubmit(onSubmit)}
          id="newVehicleRepairForm"
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
          <DashboardInput
            name={"cost"}
            type="tel"
            label={t("Field5.Title")}
            placeholder={t("Field5.Placeholder")}
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
