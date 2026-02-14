"use client"

import {
  DashboardSelect,
  DashboardInput,
  DashboardTextarea,
  DashboardFileInput,
} from "@/components/form/dashboardFormFields"
import { pageClassName } from "@/components/page/pageCommons"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import stateCityData from "@/lib/states_cities.json"
import { useEffect, useRef, useTransition } from "react"
import { newCustomerAction } from "@/app/actions/customers/newCustomerAction"
import { NewCustomerRequestType } from "@ryogo-travel-app/api/types/customer.types"
import { getArrayValueDisplayPairs } from "@/lib/utils"

export default function NewCustomerForm({
  agencyId,
  allCustomers,
  userId,
  agencyLocation,
}: {
  agencyId: string
  allCustomers: FindCustomersInAgencyType
  userId: string
  agencyLocation: {
    id: string
    city: string
    state: string
  }
}) {
  const t = useTranslations("Dashboard.NewCustomer")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const newCustomerSchema = z.object({
    name: z.string().min(5, t("Field1.Error1")).max(30, t("Field1.Error2")),
    phone: z.string().length(10, t("Field2.Error1")),
    email: z.email(t("Field3.Error1")).max(60, t("Field3.Error2")).optional(),
    photo: z
      .instanceof(FileList)
      .refine((file) => {
        if (file.length < 1) return true
        return file[0] && file[0].size < 1000000
      }, t("Field4.Error1"))
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
      }, t("Field4.Error2"))
      .optional(),
    address: z
      .string()
      .min(20, t("Field5.Error1"))
      .max(300, t("Field5.Error2"))
      .optional(),
    remarks: z.string().max(300, t("Field6.Error1")).optional(),
    state: z.string().min(1, t("Field7.Error1")),
    city: z.string().min(1, t("Field8.Error1")),
  })
  type NewCustomerType = z.infer<typeof newCustomerSchema>

  //Form init
  const formData = useForm<NewCustomerType>({
    resolver: zodResolver(newCustomerSchema),
    defaultValues: {
      state: agencyLocation.state,
      city: agencyLocation.city,
    },
  })

  //Form submit
  async function onSubmit(values: NewCustomerType) {
    if (allCustomers.some((c) => c.phone === values.phone)) {
      //If customer with this phone exists in agency, show error
      formData.setError("phone", {
        type: "manual",
        message: t("APIError"),
      })
    } else {
      startTransition(async () => {
        const newCustomerData: NewCustomerRequestType = {
          agencyId: agencyId,
          addedByUserId: userId,
          name: values.name,
          phone: values.phone,
          state: values.state,
          city: values.city,
          email: values.email,
          address: values.address,
          remarks: values.remarks,
          photo: values.photo,
        }
        const createdCustomer = await newCustomerAction(newCustomerData)
        if (createdCustomer) {
          toast.success(t("Success"))
          router.replace(`/dashboard/customers/${createdCustomer.id}`)
        } else {
          toast.error(t("Error"))
        }
      })
    }
  }

  const data: Record<string, string[]> = stateCityData
  const selectedState = formData.watch("state")
  const cityOptions = selectedState
    ? (data[selectedState] ?? [t("Field8.Title")])
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
    <div id="NewCustomerPage" className={pageClassName}>
      <Form {...formData}>
        <form
          onSubmit={formData.handleSubmit(onSubmit)}
          id="newCustomerForm"
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
            name={"phone"}
            type="tel"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <DashboardInput
            name={"email"}
            type="email"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
          <DashboardFileInput
            name={"photo"}
            register={formData.register("photo")}
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
          />
          <DashboardTextarea
            name={"address"}
            label={t("Field5.Title")}
            placeholder={t("Field5.Placeholder")}
          />
          <DashboardTextarea
            name="remarks"
            label={t("Field6.Title")}
            placeholder={t("Field6.Placeholder")}
          />
          <DashboardSelect
            name={"state"}
            register={formData.register("state")}
            title={t("Field7.Title")}
            array={getArrayValueDisplayPairs(data)}
            placeholder={t("Field7.Title")}
          />
          <DashboardSelect
            name={"city"}
            register={formData.register("city")}
            title={t("Field8.Title")}
            array={getArrayValueDisplayPairs(cityOptions)}
            placeholder={t("Field8.Title")}
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
            {t("SecondaryCTA")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
