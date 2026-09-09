"use client"

import {
  RyogoFileInput,
  RyogoInput,
  RyogoSelect,
  RyogoTextarea,
} from "@/components/form/ryogoFormFields"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExpenseTypesEnum } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import z from "zod"
import { toast } from "sonner"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { addExpenseAction } from "@/app/actions/expenses/addExpenseAction"
import { FormWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { FileRegex, SupportedImageFormats } from "@/lib/regex"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  MAX_AMOUNT_LIMIT,
  MAX_FIELD_DESC_LENGTH,
  MAX_FILE_UPLOAD_SIZE,
  MIN_AMOUNT_LIMIT,
} from "@/lib/uiConfig"

export default function RiderAddExpensePageComponent({
  bookingId,
  userId,
  agencyId,
  assignedUserId,
}: {
  bookingId: string
  userId: string
  agencyId: string
  assignedUserId: string
}) {
  const t = useTranslations("Rider.AddRiderExpense")
  const router = useRouter()

  const newExpenseSchema = z.object({
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
      return file[0] && file[0].size < MAX_FILE_UPLOAD_SIZE
    }, t("Field4.Error1"))
      .refine((file) => {
        if (file.length < 1) return true
        return file[0] && SupportedImageFormats.includes(file[0].type)
      }, t("Field4.Error2"))
      .optional(),
  })
  type NewExpenseType = z.infer<typeof newExpenseSchema>

  //Form init
  const formData = useForm<NewExpenseType>({
    resolver: zodResolver(newExpenseSchema),
    defaultValues: {
      type: ExpenseTypesEnum.FUEL,
    },
  })

  //Form submit
  async function onSubmit(values: NewExpenseType) {
    const result = await addExpenseAction(
      {
        agencyId,
        bookingId,
        userId,
        assignedUserId,
        ...values,
      },
      true,
    )
    if (result) {
      toast.success(t("Success"))
      router.replace(`/rider/myBookings/${bookingId}`)
    } else {
      toast.error(t("Error"))
      router.back()
    }
  }

  return (
    <PageWrapper id="RiderNewExpensePage">
      <FormWrapper<NewExpenseType>
        form={formData}
        onSubmit={formData.handleSubmit(onSubmit)}
        id="newExpenseForm"
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
        <RyogoDefaultButton
          size={"lg"}
          label={
            formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")
          }
          type="submit"
          disabled={formData.formState.isSubmitting}
          showSpinner={formData.formState.isSubmitting}
        />
        <RyogoOutlineButton
          size={"lg"}
          label={t("CancelCTA")}
          type="button"
          onClick={() => router.back()}
          disabled={formData.formState.isSubmitting}
        />
      </FormWrapper>
    </PageWrapper>
  )
}
