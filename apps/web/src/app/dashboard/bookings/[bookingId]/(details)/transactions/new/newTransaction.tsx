"use client"

import {
  RyogoFileInput,
  RyogoInput,
  RyogoRadio,
  RyogoSelect,
  RyogoTextarea,
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
import z from "zod"
import { addTransactionAction } from "@/app/actions/transactions/addTransactionAction"
import { toast } from "sonner"
import {
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
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
import { RyogoCaption, RyogoH3 } from "@/components/typography"

export default function NewTransactionPageComponent({
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
  const t = useTranslations("Dashboard.NewTransaction")
  const router = useRouter()

  const newTransactionSchema = z.object({
    type: z.enum(TransactionTypesEnum).nonoptional(t("Field1.Error1")),
    amount: z.coerce
      .number<number>(t("Field2.Error1"))
      .min(MIN_AMOUNT_LIMIT, t("Field2.Error2"))
      .max(MAX_AMOUNT_LIMIT, t("Field2.Error3"))
      .multipleOf(1, t("Field2.Error4"))
      .positive(t("Field2.Error5")),
    mode: z.enum(TransactionModesEnum).nonoptional(t("Field3.Error1")),
    otherParty: z.enum(TransactionsPartiesEnum).nonoptional(t("Field4.Error1")),
    remarks: z
      .string()
      .max(MAX_FIELD_DESC_LENGTH, t("Field5.Error1"))
      .optional(),
    txnPhoto: FileRegex.refine((file) => {
      if (file.length < 1) return true
      return file[0] && file[0].size < MAX_FILE_UPLOAD_SIZE
    }, t("Field6.Error1"))
      .refine((file) => {
        if (file.length < 1) return true
        return file[0] && SupportedImageFormats.includes(file[0].type)
      }, t("Field6.Error2"))
      .optional(),
  })
  type NewTransactionType = z.infer<typeof newTransactionSchema>

  //Form init
  const form = useForm<NewTransactionType>({
    resolver: zodResolver(newTransactionSchema),
    defaultValues: {
      type: TransactionTypesEnum.CREDIT,
      mode: TransactionModesEnum.CASH,
      otherParty: TransactionsPartiesEnum.CUSTOMER,
    },
  })

  //Form submit
  async function onSubmit(values: NewTransactionType) {
    const addedTransaction = await addTransactionAction({
      agencyId,
      bookingId,
      userId,
      assignedUserId,
      ...values,
    })
    if (addedTransaction) {
      toast.success(t("Success"))
      router.replace(`/dashboard/bookings/${bookingId}/transactions`)
    } else {
      toast.error(t("Error"))
    }
  }

  return (
    <PageWrapper id="NewTransactionPage">
      <FormWrapper<NewTransactionType>
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        id="newTransactionForm"
      >
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoCaption color="slate">{t("Subtitle")}</RyogoCaption>
        <FormContentWrapper>
          <RyogoRadio
            name="type"
            title={t("Field1.Title")}
            register={form.register("type")}
            defaultValue={TransactionTypesEnum.CREDIT}
            array={Object.values(TransactionTypesEnum)}
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
            array={Object.values(TransactionModesEnum)}
            placeholder={t("Field3.Placeholder")}
          />
          <RyogoSelect
            name="otherParty"
            register={form.register("otherParty")}
            title={t("Field4.Title")}
            array={Object.values(TransactionsPartiesEnum)}
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
