"use client"

import { modifyCustomerAction } from "@/app/actions/customers/modifyCustomerAction"
import {
  DashboardInput,
  DashboardSelect,
  DashboardTextarea,
} from "@/components/form/dashboardFormFields"
import { pageClassName } from "@/components/page/pageCommons"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { FindCustomerDetailsByIdType } from "@ryogo-travel-app/api/services/customer.services"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import stateCityData from "@/lib/states_cities.json"
import { useEffect, useRef, useTransition } from "react"
import {
  getArrayValueDisplayPairs,
  getStringValueDisplayPairs,
} from "@/lib/utils"

export default function ModifyCustomerPageComponent({
  customer,
}: {
  customer: NonNullable<FindCustomerDetailsByIdType>
}) {
  const t = useTranslations("Dashboard.ModifyCustomer")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const modifyCustomerSchema = z.object({
    name: z.string().min(5, t("Field1.Error1")).max(30, t("Field1.Error2")),
    email: z.email(t("Field2.Error1")).max(60, t("Field2.Error2")).optional(),
    address: z
      .string()
      .min(20, t("Field3.Error1"))
      .max(300, t("Field3.Error2"))
      .optional(),
    remarks: z.string().max(300, t("Field4.Error1")).optional(),
    state: z.string().min(1, t("Field5.Error1")),
    city: z.string().min(1, t("Field6.Error1")),
  })
  type ModifyCustomerType = z.infer<typeof modifyCustomerSchema>

  const formData = useForm<ModifyCustomerType>({
    resolver: zodResolver(modifyCustomerSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email ?? undefined,
      address: customer.address ?? undefined,
      remarks: customer.remarks ?? undefined,
      state: customer.location.state,
      city: customer.location.city,
    },
  })

  //Submit actions
  async function onSubmit(data: ModifyCustomerType) {
    startTransition(async () => {
      const modifyCustomerData = {
        name: data.name,
        email: data.email ?? undefined,
        address: data.address ?? undefined,
        remarks: data.remarks ?? undefined,
        state: data.state,
        city: data.city,
      }
      if (
        await modifyCustomerAction(
          customer.id,
          customer.agencyId,
          modifyCustomerData,
        )
      ) {
        router.replace(`/dashboard/customers/${customer.id}`)
        toast.success(t("Success"))
      } else {
        router.back()
        toast.error(t("Error"))
      }
    })
  }

  const data: Record<string, string[]> = stateCityData
  const selectedState = formData.watch("state")
  const cityOptions = selectedState
    ? (data[selectedState] ?? [t("Field6.Title")])
    : []
  const setValue = formData.setValue

  const isFirstRender = useRef(true)

  useEffect(() => {
    // Skip on the initial render of the component
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setValue("city", "") // Reset the city dropdown's value when the state dropdown changes
  }, [selectedState, setValue])

  return (
    <div id="ModifyCustomer" className={pageClassName}>
      <Form {...formData}>
        <form
          id="ModifyCustomerForm"
          onSubmit={formData.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 lg:gap-4 p-4 lg:p-5 bg-white rounded-lg shadow w-full"
        >
          <DashboardInput
            name={"name"}
            type="text"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <DashboardInput
            name={"email"}
            type="email"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <DashboardTextarea
            name={"address"}
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
          />
          <DashboardTextarea
            name="remarks"
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
          />
          <DashboardSelect
            name={"state"}
            register={formData.register("state")}
            title={t("Field5.Title")}
            array={getArrayValueDisplayPairs(data)}
            placeholder={t("Field5.Title")}
          />
          <DashboardSelect
            name={"city"}
            register={formData.register("city")}
            title={t("Field6.Title")}
            array={getStringValueDisplayPairs(cityOptions)}
            placeholder={t("Field6.Title")}
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
            variant={"secondary"}
            size={"lg"}
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
          >
            {t("SecondaryCTA")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
