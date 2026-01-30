"use client"

import {
  DashboardFileInput,
  DashboardInput,
  DashboardRadio,
  DashboardSelect,
  DashboardTextarea,
} from "@/components/form/dashboardFormFields"
import { pageClassName } from "@/components/page/pageCommons"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
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
import { addTransactionAction } from "./addTransactionAction"
import { toast } from "sonner"
import { getEnumValueDisplayPairs } from "@/lib/utils"

export default function NewTransactionPageComponent({
  bookingId,
  userId,
  agencyId,
}: {
  bookingId: string
  userId: string
  agencyId: string
}) {
  const t = useTranslations("Dashboard.NewTransaction")
  const router = useRouter()

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
    const addSuccess = await addTransactionAction({
      ...values,
      bookingId,
      userId,
      agencyId,
    })
    if (addSuccess) {
      toast.success(t("Success"))
      router.replace(`/dashboard/bookings/${bookingId}/transactions`)
    } else {
      toast.error(t("Error"))
    }
  }

  return (
    <div id="NewTransactionPage" className={pageClassName}>
      <Form {...formData}>
        <form
          onSubmit={formData.handleSubmit(onSubmit)}
          id="newTransactionForm"
          className="flex flex-col gap-4 lg:gap-4 p-4 lg:p-5 bg-white rounded-lg shadow w-full"
        >
          <DashboardRadio
            name="type"
            title={t("Field1.Title")}
            register={formData.register("type")}
            defaultValue={TransactionTypesEnum.CREDIT}
            array={getEnumValueDisplayPairs(TransactionTypesEnum)}
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
            array={getEnumValueDisplayPairs(TransactionModesEnum)}
            placeholder={t("Field3.Placeholder")}
          />
          <DashboardSelect
            name="otherParty"
            register={formData.register("otherParty")}
            title={t("Field4.Title")}
            array={getEnumValueDisplayPairs(TransactionsPartiesEnum)}
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
          <Button
            variant={"outline"}
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
