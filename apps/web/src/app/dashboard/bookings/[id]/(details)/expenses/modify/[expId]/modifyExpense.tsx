"use client"

import {
  RyogoInput,
  RyogoSelect,
  RyogoTextarea,
  RyogoFileInput,
} from "@/components/form/ryogoFormFields"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExpenseTypesEnum } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { Button } from "@/components/ui/button"
import DeleteExpenseAlertButton from "@/components/buttons/deleteExpenseAlertButton"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { modifyExpenseAction } from "@/app/actions/expenses/modifyExpenseAction"
import { FindExpenseDetailsByIdType } from "@ryogo-travel-app/api/services/expense.services"
import { useTransition } from "react"
import { FormWrapper, PageWrapper } from "@/components/page/pageWrappers"

export default function ModifyExpensePageComponent({
  expenseDetails,
  assignedUserId,
}: {
  expenseDetails: NonNullable<FindExpenseDetailsByIdType>
  assignedUserId: string
}) {
  const t = useTranslations("Dashboard.ModifyExpense")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

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
        return file[0] && file[0].size < 1000000
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
    startTransition(async () => {
      if (
        await modifyExpenseAction(
          {
            expenseId: expenseDetails.id,
            bookingId: expenseDetails.bookingId,
            ...values,
          },
          expenseDetails.agencyId,
          assignedUserId,
        )
      ) {
        toast.success(t("Success"))
        router.replace(
          `/dashboard/bookings/${expenseDetails.bookingId}/expenses`,
        )
      } else {
        toast.error(t("Error"))
      }
    })
  }

  return (
    <PageWrapper id="ModifyExpensePage">
      <FormWrapper<ModifyExpenseType>
        form={formData}
        onSubmit={formData.handleSubmit(onSubmit)}
        id="modifyExpenseForm"
      >
        <RyogoSelect
          name="type"
          title={t("Field1.Title")}
          register={formData.register("type")}
          array={getEnumValueDisplayPairs(ExpenseTypesEnum)}
          placeholder={t("Field1.Description")}
        />
        <RyogoInput
          name="amount"
          label={t("Field2.Title")}
          placeholder={t("Field2.Placeholder")}
          type="tel"
        />
        <RyogoTextarea
          name="remarks"
          label={t("Field3.Title")}
          placeholder={t("Field3.Placeholder")}
        />
        <RyogoFileInput
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
          disabled={isPending}
        >
          {isPending && <Spinner />}
          {isPending ? t("Loading") : t("PrimaryCTA")}
        </Button>
        <DeleteExpenseAlertButton
          bookingId={expenseDetails.bookingId}
          expenseId={expenseDetails.id}
          agencyId={expenseDetails.agencyId}
          assignedUserId={assignedUserId}
        />
        <Button
          variant={"outline"}
          size={"default"}
          type="button"
          disabled={isPending}
          onClick={() => router.back()}
        >
          {t("CancelCTA")}
        </Button>
      </FormWrapper>
    </PageWrapper>
  )
}
