"use client"

import {
  DashboardRadio,
  DashboardInput,
  DashboardSelect,
  DashboardTextarea,
  DashboardFileInput,
} from "@/components/form/dashboardFormFields"
import { pageClassName } from "@/components/page/pageCommons"
import { Form } from "@/components/ui/form"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  SelectTransactionType,
  TransactionModesEnum,
  TransactionsPartiesEnum,
  TransactionTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { updateTransactionAction } from "./updateTransactionAction"
import { Button } from "@/components/ui/button"
import DeleteTransactionAlertButton from "@/app/dashboard/components/buttons/deleteTransactionAlertButton"

export default function ModifyTransactionPageComponent({
  bookingId,
  transactionId,
  transactionDetails,
}: {
  bookingId: string
  transactionId: string
  transactionDetails: SelectTransactionType
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
    txnPhoto: z
      .instanceof(FileList)
      .refine((file) => {
        if (file.length < 1) return true
        return file[0]!.size < 1000000
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
  const formData = useForm<ModifyTransactionType>({
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
    if (await updateTransactionAction({ ...values, transactionId })) {
      toast.success(t("Success"))
      router.replace(`/dashboard/bookings/${bookingId}/transactions`)
    } else {
      toast.error(t("Error"))
    }
  }

  return (
    <div id="ModifyTransactionPage" className={pageClassName}>
      <Form {...formData}>
        <form
          onSubmit={formData.handleSubmit(onSubmit)}
          id="modifyTransactionForm"
          className="flex flex-col gap-4 lg:gap-4 p-4 lg:p-5 bg-white rounded-lg shadow w-full"
        >
          <DashboardRadio
            name="type"
            title={t("Field1.Title")}
            register={formData.register("type")}
            defaultValue={TransactionTypesEnum.CREDIT}
            array={Object.values(TransactionTypesEnum)}
            description={t("Field1.Description")}
          />
          <DashboardInput
            name="amount"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            type="tel"
          />
          <DashboardSelect
            name="mode"
            register={formData.register("mode")}
            title={t("Field3.Title")}
            array={Object.values(TransactionModesEnum)}
            placeholder={t("Field3.Placeholder")}
          />
          <DashboardSelect
            name="otherParty"
            register={formData.register("otherParty")}
            title={t("Field4.Title")}
            array={Object.values(TransactionsPartiesEnum)}
            placeholder={t("Field4.Placeholder")}
          />
          <DashboardTextarea
            name="remarks"
            label={t("Field5.Title")}
            placeholder={t("Field5.Placeholder")}
          />
          <DashboardFileInput
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
            disabled={formData.formState.isSubmitting}
          >
            {formData.formState.isSubmitting && <Spinner />}
            {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </Button>
          <DeleteTransactionAlertButton
            bookingId={bookingId}
            transactionId={transactionId}
          />
          <Button
            variant={"link"}
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
