"use client"

import {
  RyogoRadio,
  RyogoInput,
  RyogoSelect,
  RyogoTextarea,
  RyogoFileInput,
} from "@/components/form/ryogoFormFields"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  TransactionModesEnum,
  TransactionsPartiesEnum,
  TransactionTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import DeleteTransactionAlertButton from "@/components/buttons/alert/deleteTransactionAlertButton"
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { modifyTransactionAction } from "@/app/actions/transactions/modifyTransactionAction"
import { FindTransactionDetailsByIdType } from "@ryogo-travel-app/api/services/transaction.services"
import { FormWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { FileRegex } from "@/lib/regex"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

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
      .min(1, t("Field2.Error2"))
      .max(1000000, t("Field2.Error3"))
      .multipleOf(1, t("Field2.Error4"))
      .positive(t("Field2.Error5")),
    mode: z.enum(TransactionModesEnum).nonoptional(t("Field3.Error1")),
    otherParty: z.enum(TransactionsPartiesEnum).nonoptional(t("Field4.Error1")),
    remarks: z.string().max(300, t("Field5.Error1")).optional(),
    txnPhoto: FileRegex.refine((file) => {
      if (file.length < 1) return true
      return file[0] && file[0].size < 1000000
    }, t("Field6.Error1"))
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
      }, t("Field6.Error2"))
      .optional(),
  })

  type ModifyTransactionType = z.infer<typeof modifyTransactionSchema>

  //Form init
  const form = useForm<ModifyTransactionType>({
    resolver: zodResolver(modifyTransactionSchema),
    defaultValues: {
      type: transactionDetails.type,
      mode: transactionDetails.mode,
      otherParty: transactionDetails.otherParty,
      amount: transactionDetails.amount,
      remarks: transactionDetails.remarks ?? undefined,
    },
  })

  //Form submit
  async function onSubmit(values: ModifyTransactionType) {
    const updatedTransaction = await modifyTransactionAction(
      {
        transactionId: transactionDetails.id,
        bookingId: transactionDetails.bookingId,
        ...values,
      },
      transactionDetails.agencyId,
      assignedUserId,
    )
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
        <RyogoRadio
          name="type"
          title={t("Field1.Title")}
          register={form.register("type")}
          defaultValue={TransactionTypesEnum.CREDIT}
          array={getEnumValueDisplayPairs(TransactionTypesEnum)}
          description={t("Field1.Description")}
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
          array={getEnumValueDisplayPairs(TransactionModesEnum)}
          placeholder={t("Field3.Placeholder")}
        />
        <RyogoSelect
          name="otherParty"
          register={form.register("otherParty")}
          title={t("Field4.Title")}
          array={getEnumValueDisplayPairs(TransactionsPartiesEnum)}
          placeholder={t("Field4.Placeholder")}
        />
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
        <DeleteTransactionAlertButton
          bookingId={transactionDetails.bookingId}
          transactionId={transactionDetails.id}
          agencyId={transactionDetails.agencyId}
          assignedUserId={assignedUserId}
        />
      </FormWrapper>
    </PageWrapper>
  )
}
