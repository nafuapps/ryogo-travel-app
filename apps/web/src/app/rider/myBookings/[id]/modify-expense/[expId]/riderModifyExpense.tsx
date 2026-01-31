"use client"

import {
  DashboardInput,
  DashboardSelect,
  DashboardTextarea,
  DashboardFileInput,
} from "@/components/form/dashboardFormFields"
import { pageClassName } from "@/components/page/pageCommons"
import { Form } from "@/components/ui/form"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExpenseTypesEnum } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { modifyExpenseAction } from "../../../../../actions/expenses/modifyExpenseAction"
import { Button } from "@/components/ui/button"
import DeleteExpenseAlertButton from "@/app/dashboard/components/buttons/deleteExpenseAlertButton"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { FindExpenseDetailsByIdType } from "@ryogo-travel-app/api/services/expense.services"

export default function RiderModifyExpensePageComponent({
  expenseDetails,
}: {
  expenseDetails: NonNullable<FindExpenseDetailsByIdType>
}) {
  const t = useTranslations("Rider.ModifyRiderExpense")
  const router = useRouter()

  const modifyExpenseSchema = z.object({
    type: z.enum(ExpenseTypesEnum).nonoptional(t("Field1.Error1")),
    amount: z.coerce
      .number<number>(t("Field2.Error1"))
      .min(1, t("Field2.Error2"))
      .max(1000000, t("Field2.Error3"))
      .multipleOf(1, t("Field2.Error4"))
      .positive(t("Field2.Error5")),
    remarks: z.string().max(300, t("Field3.Error1")).optional(),
    expensePhoto: z
      .instanceof(FileList)
      .refine((file) => {
        if (file.length < 1) return true
        return file[0]!.size < 1000000
      }, t("Field4.Error1"))
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
      }, t("Field4.Error2"))
      .optional(),
  })

  type ModifyExpenseType = z.infer<typeof modifyExpenseSchema>

  //Form init
  const formData = useForm<ModifyExpenseType>({
    resolver: zodResolver(modifyExpenseSchema),
    defaultValues: {
      type: expenseDetails.type,
      amount: expenseDetails.amount,
      remarks: expenseDetails.remarks ?? undefined,
    },
  })

  //Form submit
  async function onSubmit(values: ModifyExpenseType) {
    if (
      await modifyExpenseAction({
        expenseId: expenseDetails.id,
        bookingId: expenseDetails.bookingId,
        ...values,
      })
    ) {
      toast.success(t("Success"))
      router.replace(`/rider/myBookings/${expenseDetails.bookingId}`)
    } else {
      toast.error(t("Error"))
      router.back()
    }
  }

  return (
    <div id="ModifyExpensePage" className={pageClassName}>
      <Form {...formData}>
        <form
          onSubmit={formData.handleSubmit(onSubmit)}
          id="modifyExpenseForm"
          className="flex flex-col gap-4 lg:gap-4 p-4 lg:p-5 bg-white rounded-lg shadow w-full"
        >
          <DashboardSelect
            name="type"
            title={t("Field1.Title")}
            register={formData.register("type")}
            array={getEnumValueDisplayPairs(ExpenseTypesEnum)}
            placeholder={t("Field1.Description")}
          />
          <DashboardInput
            name="amount"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            type="tel"
          />
          <DashboardTextarea
            name="remarks"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
          />
          <DashboardFileInput
            name={"expensePhoto"}
            register={formData.register("expensePhoto")}
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
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
          <DeleteExpenseAlertButton
            bookingId={expenseDetails.bookingId}
            expenseId={expenseDetails.id}
          />
          <Button
            variant={"outline"}
            size={"default"}
            type="button"
            disabled={formData.formState.isSubmitting}
            onClick={() => router.back()}
          >
            {t("CancelCTA")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
