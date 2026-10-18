"use client"

import {
  RyogoDatePicker,
  RyogoFileInput,
  RyogoInput,
  RyogoSelect,
  RyogoSwitch,
  RyogoTextarea,
} from "@/components/form/ryogoFormFields"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  TransactionModesEnum,
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
import { RyogoCaption, RyogoH3 } from "@/components/typography"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import { checkImageFileSize, checkImageFileType } from "@/lib/utils"
import compressImage from "@/lib/imageCompression"

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
    isApproved: z.boolean(),
    remarks: z
      .string()
      .max(MAX_FIELD_DESC_LENGTH, t("Field5.Error1"))
      .optional(),
    txnPhoto: FileRegex.refine((file) => {
      return checkImageFileSize(file)
    }, t("Field6.Error1"))
      .refine((file) => {
        return checkImageFileType(file)
      }, t("Field6.Error2"))
      .optional(),
    transactionDate: z.date(),
  })
  type NewTransactionType = z.infer<typeof newTransactionSchema>

  //Form init
  const form = useForm<NewTransactionType>({
    resolver: zodResolver(newTransactionSchema),
    defaultValues: {
      type: TransactionTypesEnum.RECEIVED_PAYMENT_FROM_CUSTOMER,
      mode: TransactionModesEnum.CASH,
      isApproved: true,
      transactionDate: new Date(),
    },
  })

  //Form submit
  async function onSubmit(values: NewTransactionType) {
    const addedTransaction = await addTransactionAction({
      ...values,
      txnPhoto: await compressImage(values.txnPhoto),
      agencyId,
      bookingId,
      userId,
      assignedUserId,
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
        <SectionRowWrapper className="items-center justify-between">
          <RyogoH3>{t("Title")}</RyogoH3>
          <HelpIconButton href="/dashboard/support/help-bookings#transactions" />
        </SectionRowWrapper>
        <RyogoCaption color="slate">{t("Subtitle")}</RyogoCaption>
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
