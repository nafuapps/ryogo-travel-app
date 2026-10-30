"use client"

import { addExpenseAction } from "@/app/actions/expenses/addExpenseAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import {
  RyogoDatePicker,
  RyogoFileInput,
  RyogoInput,
  RyogoSelect,
  RyogoSwitch,
  RyogoTextarea,
} from "@/components/form/ryogoFormFields"
import {
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  SectionRowWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoH3 } from "@/components/typography"
import compressImage from "@/lib/imageCompression"
import { FileRegex } from "@/lib/regex"
import {
  MAX_AMOUNT_LIMIT,
  MAX_FIELD_DESC_LENGTH,
  MIN_AMOUNT_LIMIT,
} from "@/lib/uiConfig"
import { checkImageFileSize, checkImageFileType } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExpenseTypesEnum } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export default function NewExpensePageComponent({
  bookingId,
  userId,
  agencyId,
  assignedUserId,
  isRider,
}: {
  bookingId: string
  userId: string
  agencyId: string
  assignedUserId: string
  isRider?: boolean
}) {
  const t = useTranslations("Dashboard.NewExpense")
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
      return checkImageFileSize(file, true)
    }, t("Field4.Error1"))
      .refine((file) => {
        return checkImageFileType(file, true)
      }, t("Field4.Error2"))
      .optional(),
    expenseDate: z.date(),
    isPaidByDriver: z.boolean(),
  })
  type NewExpenseType = z.infer<typeof newExpenseSchema>

  //Form init
  const form = useForm<NewExpenseType>({
    resolver: zodResolver(newExpenseSchema),
    defaultValues: {
      type: ExpenseTypesEnum.FUEL,
      expenseDate: new Date(),
      isPaidByDriver: isRider ?? false,
    },
  })

  //Form submit
  async function onSubmit(values: NewExpenseType) {
    const addedExpense = await addExpenseAction(
      {
        ...values,
        expensePhoto: await compressImage(values.expensePhoto),
        bookingId,
        userId,
        agencyId,
        assignedUserId,
        isApproved: !isRider,
      },
      isRider,
    )
    if (addedExpense) {
      toast.success(t("Success"))
      router.replace(
        isRider
          ? `/rider/myBookings/${bookingId}/expenses`
          : `/dashboard/bookings/${bookingId}/expenses`,
      )
    } else {
      toast.error(t("Error"))
    }
  }

  return (
    <PageWrapper id="NewExpensePage">
      <FormWrapper<NewExpenseType>
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        id="newExpenseForm"
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
        <RyogoCaption color="slate">{t("Subtitle")}</RyogoCaption>
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
          {!isRider && (
            <RyogoSwitch name="isPaidByDriver" label={t("Field6.Title")} />
          )}
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
            label={t("CancelCTA")}
            type="button"
            onClick={() => router.back()}
            disabled={form.formState.isSubmitting}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
