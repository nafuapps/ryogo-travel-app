"use client"

import {
  RyogoInput,
  RyogoSelect,
  RyogoTextarea,
  RyogoFileInput,
  RyogoDatePicker,
  RyogoSwitch,
} from "@/components/form/ryogoFormFields"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  TransactionModesEnum,
  TransactionTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import DeleteTransactionAlertButton from "@/components/buttons/alert/deleteTransactionAlertButton"
import { modifyTransactionAction } from "@/app/actions/transactions/modifyTransactionAction"
import { FindTransactionDetailsByIdType } from "@ryogo-travel-app/api/services/transaction.services"
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
import compressImage from "@/lib/imageCompression"

export default function ModifyTransactionPageComponent({
  transactionDetails,
  assignedUserId,
}: {
  transactionDetails: NonNullable<FindTransactionDetailsByIdType>
  assignedUserId: string
}) {
  const t = useTranslations("Dashboard.ModifyTransaction")
  const router = useRouter()

  const modifyTransactionSchema = z.object({
    type: z.enum(TransactionTypesEnum).nonoptional(t("Field1.Error1")),
    amount: z.coerce
      .number<number>(t("Field2.Error1"))
      .min(MIN_AMOUNT_LIMIT, t("Field2.Error2"))
      .max(MAX_AMOUNT_LIMIT, t("Field2.Error3"))
      .multipleOf(1, t("Field2.Error4"))
      .positive(t("Field2.Error5")),
    mode: z.enum(TransactionModesEnum).nonoptional(t("Field3.Error1")),
    isApproved: z.boolean(),
    remarks: z
      .string()
      .max(MAX_FIELD_DESC_LENGTH, t("Field5.Error1"))
      .optional(),
    txnPhoto: FileRegex.refine((file) => {
      if (file.length < 1) return true
      return checkImageFileSize(file)
    }, t("Field6.Error1"))
      .refine((file) => {
        if (file.length < 1) return true
        return checkImageFileType(file)
      }, t("Field6.Error2"))
      .optional(),
    transactionDate: z.date(),
  })

  type ModifyTransactionType = z.infer<typeof modifyTransactionSchema>

  const form = useForm<ModifyTransactionType>({
    resolver: zodResolver(modifyTransactionSchema),
    defaultValues: {
      type: transactionDetails.type,
      mode: transactionDetails.mode,
      amount: transactionDetails.amount,
      isApproved: transactionDetails.isApproved,
      remarks: transactionDetails.remarks ?? undefined,
      transactionDate: transactionDetails.transactionDate,
    },
  })

  async function onSubmit(values: ModifyTransactionType) {
    const updatedTransaction = await modifyTransactionAction({
      data: {
        ...values,
        txnPhoto: await compressImage(values.txnPhoto),
        transactionId: transactionDetails.id,
        bookingId: transactionDetails.bookingId,
        agencyId: transactionDetails.agencyId,
        assignedUserId,
      },
    })
    if (updatedTransaction) {
      toast.success(t("Success"))
      router.replace(
        `/dashboard/bookings/${transactionDetails.bookingId}/transactions`,
      )
    } else {
      toast.error(t("Error"))
    }
  }

  return (
    <PageWrapper id="ModifyTransactionPage">
      <FormWrapper<ModifyTransactionType>
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        id="modifyTransactionForm"
      >
        <SectionRowWrapper className="items-center justify-between">
          <RyogoH3>{t("Title")}</RyogoH3>
          <HelpIconButton href="/dashboard/support/help-bookings#transactions" />
        </SectionRowWrapper>
        <FormContentWrapper>
          <RyogoSelect
            name="type"
            title={t("Field1.Title")}
            register={form.register("type")}
            array={Object.values(TransactionTypesEnum)}
            placeholder={t("Field1.Placeholder")}
          />
          <RyogoInput
            name="amount"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            type="tel"
          />
          <RyogoSelect
            name="mode"
            register={form.register("mode")}
            title={t("Field3.Title")}
            array={Object.values(TransactionModesEnum)}
            placeholder={t("Field3.Placeholder")}
          />
          <RyogoSwitch name="isApproved" label={t("Field4.Title")} />
          <RyogoTextarea
            name="remarks"
            label={t("Field5.Title")}
            placeholder={t("Field5.Placeholder")}
          />
          <RyogoFileInput
            name={"txnPhoto"}
            register={form.register("txnPhoto")}
            label={t("Field6.Title")}
            placeholder={t("Field6.Placeholder")}
            description={t("Field6.Description")}
          />
          <RyogoDatePicker
            name="transactionDate"
            label={t("Field7.Title")}
            placeholder={t("Field7.Placeholder")}
            description={t("Field7.Placeholder")}
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
          <DeleteTransactionAlertButton
            bookingId={transactionDetails.bookingId}
            transactionId={transactionDetails.id}
            agencyId={transactionDetails.agencyId}
            assignedUserId={assignedUserId}
            disabled={form.formState.isSubmitting}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
