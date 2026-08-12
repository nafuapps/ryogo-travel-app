"use client"

import {
  RyogoFileInput,
  RyogoInput,
  RyogoRadio,
  RyogoSelect,
  RyogoTextarea,
} from "@/components/form/ryogoFormFields"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
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
import { getEnumValueDisplayPairs } from "@/lib/utils"
import { useTransition } from "react"
import { FormWrapper, PageWrapper } from "@/components/page/pageWrappers"

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
  const [isPending, startTransition] = useTransition()

  const newTransactionSchema = z.object({
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
    txnPhoto: z
      .instanceof(FileList)
      .refine((file) => {
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
  type NewTransactionType = z.infer<typeof newTransactionSchema>

  //Form init
  const formData = useForm<NewTransactionType>({
    resolver: zodResolver(newTransactionSchema),
    defaultValues: {
      type: TransactionTypesEnum.CREDIT,
      mode: TransactionModesEnum.CASH,
      otherParty: TransactionsPartiesEnum.CUSTOMER,
    },
  })

  //Form submit
  async function onSubmit(values: NewTransactionType) {
    startTransition(async () => {
      if (
        await addTransactionAction({
          agencyId,
          bookingId,
          userId,
          assignedUserId,
          ...values,
        })
      ) {
        toast.success(t("Success"))
        router.replace(`/dashboard/bookings/${bookingId}/transactions`)
      } else {
        toast.error(t("Error"))
      }
    })
  }

  return (
    <PageWrapper id="NewTransactionPage">
      <FormWrapper<NewTransactionType>
        form={formData}
        onSubmit={formData.handleSubmit(onSubmit)}
        id="newTransactionForm"
      >
        <RyogoRadio
          name="type"
          title={t("Field1.Title")}
          register={formData.register("type")}
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
          register={formData.register("mode")}
          title={t("Field3.Title")}
          array={getEnumValueDisplayPairs(TransactionModesEnum)}
          placeholder={t("Field3.Placeholder")}
        />
        <RyogoSelect
          name="otherParty"
          register={formData.register("otherParty")}
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
          register={formData.register("txnPhoto")}
          label={t("Field6.Title")}
          placeholder={t("Field6.Placeholder")}
          description={t("Field6.Description")}
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
