"use client"

import {
  RyogoInput,
  RyogoSelect,
  RyogoTextarea,
  RyogoFileInput,
  RyogoDatePicker,
} from "@/components/form/ryogoFormFields"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExpenseTypesEnum } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import DeleteExpenseAlertButton from "@/components/buttons/alert/deleteExpenseAlertButton"
import { modifyExpenseAction } from "@/app/actions/expenses/modifyExpenseAction"
import { FindExpenseDetailsByIdType } from "@ryogo-travel-app/api/services/expense.services"
import {
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  SectionRowWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { FileRegex } from "@/lib/regex"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  MAX_AMOUNT_LIMIT,
  MAX_FIELD_DESC_LENGTH,
  MIN_AMOUNT_LIMIT,
} from "@/lib/uiConfig"
import { RyogoH3 } from "@/components/typography"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import { checkImageFileSize, checkImageFileType } from "@/lib/utils"

export default function ModifyExpensePageComponent({
  expenseDetails,
  bookingAssignedUserId,
  isRider,
}: {
  expenseDetails: NonNullable<FindExpenseDetailsByIdType>
  bookingAssignedUserId: string
  isRider?: boolean
}) {
  const t = useTranslations("Dashboard.ModifyExpense")
  const router = useRouter()

  const modifyExpenseSchema = z.object({
    type: z.enum(ExpenseTypesEnum).nonoptional(t("Field1.Error1")),
    amount: z.coerce
      .number<number>(t("Field2.Error1"))
      .min(MIN_AMOUNT_LIMIT, t("Field2.Error2"))
      .max(MAX_AMOUNT_LIMIT, t("Field2.Error3"))
      .multipleOf(1, t("Field2.Error4"))
      .positive(t("Field2.Error5")),
    remarks: z
      .string()
      .max(MAX_FIELD_DESC_LENGTH, t("Field3.Error1"))
      .optional(),
    expensePhoto: FileRegex.refine((file) => {
      if (file.length < 1) return true
      return checkImageFileSize(file)
    }, t("Field4.Error1"))
      .refine((file) => {
        if (file.length < 1) return true
        return checkImageFileType(file)
      }, t("Field4.Error2"))
      .optional(),
    expenseDate: z.date(),
  })

  type ModifyExpenseType = z.infer<typeof modifyExpenseSchema>

  //Form init
  const form = useForm<ModifyExpenseType>({
    resolver: zodResolver(modifyExpenseSchema),
    defaultValues: {
      type: expenseDetails.type,
      amount: expenseDetails.amount,
      remarks: expenseDetails.remarks ?? undefined,
      expenseDate: expenseDetails.expenseDate,
    },
  })

  //Form submit
  async function onSubmit(values: ModifyExpenseType) {
    const updatedExpense = await modifyExpenseAction(
      {
        expenseId: expenseDetails.id,
        bookingId: expenseDetails.bookingId,
        ...values,
      },
      expenseDetails.agencyId,
      bookingAssignedUserId,
      isRider,
    )
    if (updatedExpense) {
      toast.success(t("Success"))
      router.replace(
        isRider
          ? `/rider/myBookings/${expenseDetails.bookingId}/expenses`
          : `/dashboard/bookings/${expenseDetails.bookingId}/expenses`,
      )
    } else {
      toast.error(t("Error"))
    }
  }

  return (
    <PageWrapper id="ModifyExpensePage">
      <FormWrapper<ModifyExpenseType>
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        id="modifyExpenseForm"
      >
        <SectionRowWrapper className="items-center justify-between">
          <RyogoH3>{t("Title")}</RyogoH3>
          <HelpIconButton
            href={
              isRider
                ? "/rider/mySupport/help-bookings#expenses"
                : "/dashboard/support/help-bookings#expenses"
            }
          />
        </SectionRowWrapper>
        <FormContentWrapper>
          <RyogoSelect
            name="type"
            title={t("Field1.Title")}
            register={form.register("type")}
            array={Object.values(ExpenseTypesEnum)}
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
            name="expensePhoto"
            register={form.register("expensePhoto")}
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
          />
          <RyogoDatePicker
            name="expenseDate"
            label={t("Field5.Title")}
            placeholder={t("Field5.Placeholder")}
            description={t("Field5.Placeholder")}
            pastAllowed
          />
        </FormContentWrapper>
        <StickyActionWrapper>
          <RyogoDefaultButton
            size={"lg"}
            label={form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            showSpinner={form.formState.isSubmitting}
          />
          <RyogoOutlineButton
            size={"lg"}
            label={t("CancelCTA")}
            type="button"
            onClick={() => router.back()}
            disabled={form.formState.isSubmitting}
          />
          <DeleteExpenseAlertButton
            bookingId={expenseDetails.bookingId}
            expenseId={expenseDetails.id}
            agencyId={expenseDetails.agencyId}
            bookingAssignedUserId={bookingAssignedUserId}
            disabled={form.formState.isSubmitting}
            isRider={isRider}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
